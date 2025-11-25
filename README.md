# 小红书文案助手 ✨

一个基于 AI 的小红书风格内容卡片生成工具，帮你快速创建精美的视觉内容。

![小红书文案助手](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?logo=tailwindcss)
![Gemini Pro](https://img.shields.io/badge/Gemini-Pro-4285F4?logo=google)

## 功能特性

- 🤖 **AI 智能生成** - 使用 Google Gemini Pro 智能拆分主题，生成 3-7 张内容卡片
- 🎨 **6 种配色方案** - 精心设计的小红书风格配色（粉色少女、清新蓝调、活力橙黄等）
- ✏️ **实时编辑** - 支持编辑标题、内容和标签
- 🎭 **一键换色** - 快速切换卡片配色主题
- 📥 **导出功能** - 单张或批量导出高清 PNG 图片（1080x1440px）
- ⚡ **流畅动画** - 基于 Framer Motion 的精美交互动画
- 💾 **本地存储** - API Key 自动保存到浏览器本地

## 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **状态管理**: Zustand
- **动画库**: Framer Motion
- **AI 服务**: Google Gemini Pro
- **图片导出**: html2canvas

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 获取 Gemini API Key

访问 [Google AI Studio](https://ai.google.dev/) 获取免费的 Gemini API Key。

### 3. 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:5173 启动。

### 4. 使用说明

1. 首次使用需要设置 Gemini API Key（会保存到浏览器本地）
2. 输入你想创作的主题（如："夏日穿搭指南"）
3. 点击"生成内容卡片"，AI 会自动生成 3-7 张精美卡片
4. 可以编辑、换色、导出单张或全部卡片

## 项目结构

```
xhscard/
├── src/
│   ├── components/          # React 组件
│   │   ├── ui/             # 基础 UI 组件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Textarea.tsx
│   │   ├── CardPreview.tsx  # 卡片预览组件
│   │   ├── CardEditor.tsx   # 卡片编辑器
│   │   ├── CardList.tsx     # 卡片列表
│   │   ├── ThemeInput.tsx   # 主题输入
│   │   └── ErrorMessage.tsx # 错误提示
│   ├── lib/                # 工具函数
│   │   ├── gemini.ts       # Gemini API 集成
│   │   ├── cardThemes.ts   # 卡片配色方案
│   │   ├── exportUtils.ts  # 导出工具
│   │   └── utils.ts        # 通用工具
│   ├── store/              # 状态管理
│   │   └── useCardStore.ts # Zustand Store
│   ├── types/              # TypeScript 类型
│   │   └── index.ts
│   ├── App.tsx             # 主应用
│   └── main.tsx            # 入口文件
├── public/                 # 静态资源
├── tailwind.config.js      # Tailwind 配置
├── vite.config.ts          # Vite 配置
└── package.json
```

## 配色方案

- 🌸 **粉色少女** - 粉+紫渐变，甜美温柔
- 🌊 **清新蓝调** - 蓝+青渐变，清爽舒适
- 🍊 **活力橙黄** - 橙+黄渐变，阳光活力
- 🌿 **自然绿意** - 绿+青渐变，清新自然
- 💜 **优雅紫调** - 紫+粉渐变，优雅高贵
- 🌅 **日落暖调** - 橙+粉渐变，温暖浪漫

## 构建部署

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

构建产物位于 `dist/` 目录，可直接部署到静态托管服务（如 Vercel、Netlify 等）。

## 开发指南

### 添加新的配色方案

在 `src/lib/cardThemes.ts` 中添加新的配色：

```typescript
export const colorSchemes: Record<ThemeColor, ColorScheme> = {
  // ... 现有配色
  newTheme: {
    name: '新主题',
    gradient: 'linear-gradient(135deg, #color1 0%, #color2 100%)',
    titleColor: '#titleColor',
    contentColor: '#contentColor',
    tagBg: '#tagBgColor',
    tagText: '#tagTextColor',
  },
}
```

### 自定义卡片尺寸

在 `src/components/CardPreview.tsx` 中修改卡片尺寸：

```tsx
style={{
  width: '360px',  // 宽度
  height: '480px', // 高度（建议保持 3:4 比例）
}}
```

## 注意事项

- API Key 仅保存在浏览器本地，不会上传到服务器
- 建议使用 Chrome/Edge/Safari 等现代浏览器以获得最佳体验
- 导出图片为 2 倍分辨率，确保清晰度
- 单次生成最多 7 张卡片

## 许可证

MIT License

## 致谢

- [Google Gemini](https://ai.google.dev/) - AI 内容生成
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Framer Motion](https://www.framer.com/motion/) - 动画库
- [Lucide Icons](https://lucide.dev/) - 图标库

---

Made with ❤️ by Claude
