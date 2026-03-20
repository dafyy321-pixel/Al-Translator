"""
FastAPI backend for AI translation assistant.
Translates Chinese text to English and extracts keywords using ModelScope API.
"""

import json
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from openai import OpenAI

app = FastAPI(
    title="AI Translation Assistant",
    description="Translate Chinese text to English with keyword extraction",
    version="1.0.0"
)

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request model
class TranslateRequest(BaseModel):
    text: str = Field(..., description="Chinese text to translate", min_length=1)


# Response model
class TranslateResponse(BaseModel):
    translation: str = Field(..., description="English translation")
    keywords: list[str] = Field(..., description="Extracted keywords (3 items)")


MODELSCOPE_BASE_URL = "https://api-inference.modelscope.cn/v1"
MODELSCOPE_API_KEY = "ms-358f4092-1669-41a1-a311-8f61cb47fec7"
MODELSCOPE_MODEL = "ZhipuAI/GLM-5"

# Initialize OpenAI client (ModelScope).
client = OpenAI(
    base_url=MODELSCOPE_BASE_URL,
    api_key=MODELSCOPE_API_KEY,
)


def extract_json_from_response(text: str) -> dict | None:
    """Extract JSON from model response, handling various formats."""
    # Try to find JSON in the response
    json_pattern = r'\{[^{}]*"translation"[^{}]*"keywords"[^{}]*\}'
    match = re.search(json_pattern, text, re.DOTALL)

    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    # Try to find any JSON object
    json_objects = re.findall(r'\{[^{}]*\}', text)
    for obj in reversed(json_objects):
        try:
            parsed = json.loads(obj)
            if "translation" in parsed and "keywords" in parsed:
                return parsed
        except json.JSONDecodeError:
            continue

    return None


@app.post("/translate", response_model=TranslateResponse)
async def translate(request: TranslateRequest):
    """
    Translate Chinese text to English and extract 3 keywords.
    """
    # Build the prompt
    prompt = f"""You are a translation assistant. Your task is to:
1. Translate the following Chinese text to English
2. Extract exactly 3 keywords from the English translation

Return ONLY a valid JSON object in this exact format:
{{
    "translation": "English translation here",
    "keywords": ["keyword1", "keyword2", "keyword3"]
}}

Do not include any other text, explanations, or markdown formatting.
Respond with only the JSON.

Chinese text to translate:
{request.text}"""

    try:
        # Call the API (non-streaming for easier parsing)
        response = client.chat.completions.create(
            model=MODELSCOPE_MODEL,
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,  # Lower temperature for more deterministic output
        )

        # Get the response content
        content = response.choices[0].message.content

        if not content:
            raise HTTPException(status_code=500, detail="Empty response from API")

        # Extract JSON from response
        result = extract_json_from_response(content)

        if not result:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse JSON from API response: {content[:200]}"
            )

        # Validate the response has required fields
        if "translation" not in result or "keywords" not in result:
            raise HTTPException(
                status_code=500,
                detail="Response missing required fields"
            )

        # Ensure exactly 3 keywords
        keywords = result["keywords"][:3]
        while len(keywords) < 3:
            keywords.append("")

        return TranslateResponse(
            translation=result["translation"],
            keywords=keywords[:3]
        )

    except OpenAI.APIError as e:
        raise HTTPException(status_code=503, detail=f"API error: {str(e)}")
    except OpenAI.APIConnectionError as e:
        raise HTTPException(status_code=503, detail=f"Connection error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
