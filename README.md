# AI Translation Assistant

一个用于**中译英 + 关键词提取**的小型项目，支持输入中文后返回英文翻译结果，并自动提取关键词。

这个项目是面试场景下完成的版本，重点放在：
- 功能闭环完整（输入 -> 调用模型 -> 结构化输出 -> 前端展示）
- 启动简单，尽量做到“拉下来就能跑”
- 代码结构清晰，便于继续扩展

## 功能概览
- 中文文本翻译为自然英文
- 自动提取 3~5 个关键词
- 前端交互包含加载态、错误提示、结果展示和复制功能
- 后端对模型返回结果做了结构化解析，避免直接把原始文本返回给页面

## 技术栈
- 前端：Next.js 16 + React 19 + TypeScript
- 接口：Next.js Route Handler（`/api/translate`）
- 可选后端：FastAPI（`main.py`）
- 模型调用：ModelScope OpenAI 兼容接口（GLM-5）

## 项目结构
```text
.
├─ app/
│  ├─ page.tsx
│  └─ api/translate/route.ts      # Next.js API（实际前端调用）
├─ components/translator/         # 输入、结果、错误提示等 UI 组件
├─ main.py                        # FastAPI 版本接口（可选）
├─ requirements.txt               # Python 依赖
└─ package.json                   # Node 依赖与脚本
```

## 简单运行说明（推荐）
下面是最常用、最简单的启动方式（前后端同仓，直接跑 Next.js）：

1. 安装依赖
```bash
npm install
```

2. 启动开发环境
```bash
npm run dev
```

3. 打开浏览器
- 访问 `http://localhost:3000`
- 输入中文文本后点击翻译即可

## 另一种运行方式（FastAPI 版本，可选）
如果你想单独跑 Python 接口：

1. 安装 Python 依赖
```bash
pip install -r requirements.txt
```

2. 启动服务
```bash
python main.py
```

3. 访问地址
- 接口文档：`http://localhost:8000/docs`
- 健康检查：`http://localhost:8000/health`

## API 示例（Next.js 版本）
`POST /api/translate`

请求体：
```json
{
  "text": "今天上海天气不错，适合出去走走。"
}
```

响应体（示例）：
```json
{
  "translation": "The weather in Shanghai is nice today, great for a walk outside.",
  "keywords": ["Shanghai", "weather", "walk"]
}
```

## 我的开发过程（面试版记录）
这版是按“先跑通、再打磨”的节奏做的。

第一步我先把主链路打通：前端输入中文，后端能稳定调用模型并返回翻译结果。这个阶段重点不是“做得多漂亮”，而是保证最小可用闭环先成立。

第二步我补了结构化输出。大模型有时候会返回解释性文本，不是严格 JSON，所以我加了 JSON 解析和兜底逻辑，确保前端拿到的数据格式稳定，不会因为模型多说两句就崩掉。

第三步是交互体验：把加载、错误、结果分开展示，并加了复制按钮。这样用户在网络慢、模型超时、返回异常时，不会完全无反馈。

最后我整理了代码和说明文档，把“怎么跑起来”和“为什么这样设计”写清楚，方便面试官快速看懂项目重点。

## 可继续优化的方向
- 增加多模型切换（比如 GLM-5 / Qwen / DeepSeek）
- 增加请求日志与耗时统计，方便线上排查
- 加上单元测试和 API 集成测试
- 对关键词提取做更细粒度控制（词性过滤、去重策略）

## 说明
当前代码中已写入 ModelScope 的 `base_url` 与 `api_key`，目的是保证本地可以直接运行。
如果要公开到 GitHub，建议尽快替换或回收该 Token，避免密钥泄露风险。
