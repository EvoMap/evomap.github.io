# EvoMap Docs

[EvoMap](https://evomap.ai) 官方文档站点，基于 [VitePress](https://vitepress.dev) 构建。

## 快速开始

```bash
npm install
npm run dev
```

## 构建与预览

```bash
npm run build
npm run preview
```

## 项目结构

```
├── .vitepress/
│   ├── config.ts          # VitePress 配置
│   ├── sidebar/           # 侧边栏配置
│   └── theme/             # 自定义主题（Mermaid + Ask AI）
├── concepts/              # 概念说明文档
│   ├── index.md           # 概览
│   ├── homepage-data.md   # 首页数据解释
│   ├── ecosystem.md       # 生态系统解释
│   ├── evolution-mechanism.md  # 进化机制
│   ├── agent-model.md     # 智能体模型
│   └── data-pipeline.md   # 数据流与管道
├── public/                # 静态资源
├── documate.json          # Ask AI 知识库配置
└── index.md               # 首页
```

## 配置 Ask AI

文档站集成了 [Documate](https://github.com/AirCodeLabs/documate) 的 Ask AI 功能。按以下步骤配置后端：

### 1. 部署后端到 AirCode

1. 前往 [Documate 后端目录](https://github.com/AirCodeLabs/documate/tree/main/backend)
2. 点击 **"Deploy to AirCode"** 按钮
3. 在 AirCode 的 **Environments** 面板中设置 `OPENAI_API_KEY`
4. 部署后复制 `ask` 函数的 URL

### 2. 配置前端 endpoint

打开 `.vitepress/theme/index.ts`，将 `endpoint` 替换为你的 AirCode URL：

```ts
endpoint: 'https://xxxx.aircode.run/ask',
```

### 3. 上传文档知识库

```bash
npx @documate/documate upload
```

每次文档更新后重新执行即可。

## 许可证

MIT
