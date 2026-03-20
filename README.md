# AI Translation Assistant

一个简单好用的**中译英 + 关键词提取**工具。输入中文，自动返回英文翻译和3-5个关键词。

项目采用前后端分离架构：
- 前端：Next.js（API Route 作为后端）
- 模型：ModelScope GLM-5

![界面预览](/image.png)

## 功能特点

- 中译英翻译，语句自然流畅
- 自动提取 3~5 个关键词
- 前端加载状态、错误处理、结果卡片渐入动画
- 深色主题 + 网格背景 + 光晕效果，视觉体验还行

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 16 + React 19 + TypeScript |
| 样式 | Tailwind CSS + Radix UI |
| 接口 | Next.js Route Handler (`/api/translate`) |
| 备选后端 | FastAPI（`main.py`） |
| 模型 | ModelScope OpenAI 兼容接口（GLM-5） |

## 项目结构

```
.
├── app/
│   ├── page.tsx                      # 首页
│   └── api/translate/route.ts        # 翻译 API（前端直接调用的后端）
├── components/
│   ├── translator/                   # 翻译器相关组件
│   │   ├── translator.tsx            # 主组件
│   │   ├── input-card.tsx            # 输入卡片
│   │   ├── result-card.tsx           # 结果卡片
│   │   ├── error-alert.tsx           # 错误提示
│   │   └── translator-header.tsx     # 标题栏
│   └── ui/                           # UI 组件库（shadcn/ui）
├── main.py                           # FastAPI 版本（可选）
├── package.json                      # Node 依赖
└── requirements.txt                  # Python 依赖
```

## 快速开始

最简单的方式——直接跑前端，后端 API 已经在 Next.js 里了。

### 前端运行（推荐）

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev
```

然后打开 http://localhost:3000 ，输入中文试试。

### 可选：FastAPI 版本

如果你想用 Python 后端：

```bash
# 1. 安装 Python 依赖
pip install -r requirements.txt

# 2. 启动服务
python main.py
```

访问地址：
- 接口文档：`http://localhost:8000/docs`
- 健康检查：`http://localhost:8000/health`

## API 示例（Next.js 版本）

`POST /api/translate`

请求：
```json
{
  "text": "今天天气真好，适合出去散步。"
}
```

响应：
```json
{
  "translation": "The weather is nice today, perfect for a walk outside.",
  "keywords": ["weather", "nice", "walk", "outside"]
}
```

---

> 💡 **Tip for 面试官**: 如果你觉得这个项目还行，可以考虑给我个机会聊聊 🥺

## 我是怎么做这个项目的

说出来你们可能不信，这个项目是面试题催出来的 🤡

一开始拿到需求，我寻思：翻译谁不会做啊，但关键是怎么把"提取关键词"这个功能自然地融合进去。直接让模型返回两个字段听起来简单，但模型输出的是一段文本，怎么稳定地解析成结构化数据才是真正要解决的问题。

**第一步，先把路走通** 🔗

前后端连上，模型能调通，流程能跑起来。这个阶段没搞太复杂的东西，先保证核心链路不出错。毕竟万丈高楼平地起嘛 ~

**第二步，搞定结构化输出** 📦

GLM-5 返回的是一段文本，里面包含翻译和关键词。我写了专门的解析逻辑——尝试从 Markdown 代码块、纯 JSON 块、原始文本中提取能 parse 的内容。这个过程踩了点坑，模型偶尔会返回不完整的 JSON，所以加了多重兜底逻辑。

> 📌 小插曲：一开始没想到模型会返回各种奇奇怪怪的格式，调试了很久才覆盖了大部分情况 😅

**第三步，补交互体验** ✨

光有功能不够，用起来得舒服。loading 状态、报错提示、按钮禁用、结果卡片的渐入动画……这些小细节弄完，整个应用看起来才像个正经东西。顺便把主题搞成深色，加了点网格背景和光晕效果，虽然不是什么技术难点，但视觉效果能加分！

**第四步，关于技术选型** 🤔

为什么用 Next.js 而非纯前后端分离？为什么用 ModelScope 的 GLM-5？

主要是为了赶时间 🙈 Next.js 本身自带 API 能力，不需要额外部署后端服务；ModelScope 的接口是 OpenAI 兼容的，改改 url 和 key 就能直接用，省心。如果被问到为什么选这些，我的回答是：在有限时间内选择最可控、风险最低的方案。

---

## 后续可以优化的地方 🚀

- 尝试换用更强的模型（GLM-5 → Qwen / DeepSeek）
- 加个翻译历史记录和调用统计
- 完善单元测试和 API 限流
- 关键词提取可以做得更精细，比如控制去重、"去停用词"等

---

## 注意

项目里用的是 ModelScope 的 API，需要有效的 `api_key` 才能正常工作。如果要提交到 GitHub，记得把 `app/api/translate/route.ts` 里的 `MODELSCOPE_API_KEY` 换成你自己的，或者通过环境变量传入。

祝面试顺利！