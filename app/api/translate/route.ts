import { z } from "zod";

const translateRequestSchema = z.object({
  text: z.string().trim().min(1),
});

const translateResponseSchema = z.object({
  translation: z.string().trim().min(1),
  keywords: z.array(z.string().trim().min(1)).min(1),
});

const MODELSCOPE_BASE_URL = "https://api-inference.modelscope.cn/v1";
const MODELSCOPE_API_KEY = "ms-358f4092-1669-41a1-a311-8f61cb47fec7";
const MODELSCOPE_MODEL = "ZhipuAI/GLM-5";

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

function parseStructuredResult(
  content: string
): z.infer<typeof translateResponseSchema> | null {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)?.[1];

  const candidates: string[] = [trimmed];
  if (fenced) candidates.push(fenced.trim());

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    candidates.push(trimmed.slice(firstBrace, lastBrace + 1));
  }

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const parsed = JSON.parse(candidate);
      const validated = translateResponseSchema.safeParse(parsed);
      if (validated.success) {
        return {
          translation: validated.data.translation,
          keywords: validated.data.keywords.slice(0, 5),
        };
      }
    } catch {
      // Try next candidate.
    }
  }

  return null;
}

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  const parsed = translateRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Please provide valid Chinese text to translate." },
      { status: 400 }
    );
  }

  const { text } = parsed.data;

  try {
    const response = await fetch(`${MODELSCOPE_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MODELSCOPE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODELSCOPE_MODEL,
        messages: [
          {
            role: "system",
            content: `You are a professional Chinese-to-English translator.
Your task is to:
1. Translate the given Chinese text into fluent, natural English.
2. Extract 3-5 important keywords or key phrases from the translated content.
Return only valid JSON in this exact shape:
{
  "translation": "English translation here",
  "keywords": ["keyword 1", "keyword 2", "keyword 3"]
}`,
          },
          {
            role: "user",
            content: `Translate the following Chinese text into English and extract keywords:\n\n${text}`,
          },
        ],
        temperature: 0.3,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("[translate] ModelScope API error:", response.status, errorBody);
      return Response.json(
        { error: "Translation failed. ModelScope API returned an error." },
        { status: 502 }
      );
    }

    const data = (await response.json()) as ChatCompletionResponse;
    const content = data.choices?.[0]?.message?.content;

    if (typeof content !== "string" || !content.trim()) {
      console.error("[translate] invalid ModelScope response payload:", data);
      return Response.json(
        { error: "Translation failed. Empty response from ModelScope." },
        { status: 502 }
      );
    }

    const result = parseStructuredResult(content);
    if (!result) {
      console.error("[translate] failed to parse structured output:", content);
      return Response.json(
        { error: "Translation failed. Model output was not valid JSON." },
        { status: 502 }
      );
    }

    return Response.json(result);
  } catch (err) {
    console.error("[translate] error:", err);
    return Response.json(
      { error: "Translation failed. Please try again." },
      { status: 502 }
    );
  }
}
