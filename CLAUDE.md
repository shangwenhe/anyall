```
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
```

## 项目概述

这是一个功能完整的打字练习程序，帮助用户快速熟悉键盘布局并提升打字效率。包含多种练习模式、游戏化学习和数据统计功能。

## 常用开发命令

### 开发命令
```bash
npm install       # 安装依赖
npm run dev       # 启动开发服务器 (http://localhost:5173/)
npm run build     # 构建生产版本到 dist/ 目录
npm run lint      # 代码检查
npm run preview   # 预览生产版本
```

## 项目架构

### 技术栈
- **React 19 + TypeScript**：类型安全的前端开发
- **Vite**：快速的开发构建工具
- **localStorage**：本地数据存储
- **CSS3**：响应式布局和动画效果

### 核心文件结构
```
src/
├── components/          # React组件
│   ├── Keyboard.tsx     # 虚拟键盘组件
│   ├── KeyboardPractice.tsx  # 键盘熟悉练习
│   ├── TypingPractice.tsx    # 打字练习
│   ├── FallingGame.tsx       # 下落消消乐游戏
│   ├── TimedGame.tsx         # 限时挑战游戏
│   ├── ErrorKeyGame.tsx      # 错误键位特训
│   ├── Settings.tsx          # 设置页面
│   └── *.css            # 组件样式
├── utils/              # 工具函数
│   ├── storage.ts      # 本地存储管理
│   └── typing.ts       # 打字统计计算
├── constants.ts        # 常量和配置
├── types.ts            # TypeScript类型定义
├── App.tsx             # 主应用组件
├── App.css             # 全局样式
└── main.tsx            # 应用入口
```

## 核心功能

### 练习模式
1. **键盘熟悉**：分区域练习（左手区、右手区、全部字母区、数字区、符号区）
2. **打字练习**：三级难度（初级、中级、高级），实时统计速度和准确率
3. **自定义练习**：支持用户输入任意文本进行练习

### 游戏模式
1. **键位下落消消乐**：字符从屏幕上方掉落，按对应键位消除
2. **限时打字挑战**：1分钟或3分钟限时挑战，测试打字速度
3. **错误键位特训**：针对用户经常出错的键位进行强化练习

### 数据统计
- 实时计算打字速度（WPM）和准确率（%）
- 记录练习历史和游戏最高分
- 统计错误键位频次，提供针对性训练

### 设置功能
- 字体大小调节（小、中、大）
- 主题切换（浅色、深色）
- 音效开关
- 数据管理（清空记录）

## 数据存储

所有数据都保存在浏览器的 `localStorage` 中，包括：
- 练习记录（最近10次）
- 游戏最高分
- 错误键位统计
- 用户设置

## 状态管理

应用使用 React 的 useState 和 useRef 进行组件级状态管理，结合 localStorage 进行数据持久化。主要状态包括：
- 练习模式和难度
- 游戏类型和设置
- 自定义练习文本
- 实时统计数据

## 组件设计原则

### 1. 组件划分
- 每个功能模块独立为一个组件
- 键盘组件（Keyboard.tsx）是可复用的核心组件
- 练习和游戏组件继承自基础布局

### 2. 样式架构
- 使用 CSS 变量实现主题一致性
- 响应式设计，适配不同屏幕尺寸
- 组件样式与逻辑分离，便于维护

### 3. 数据流
- 父子组件通过 props 传递数据
- 事件处理通过回调函数实现
- 共享数据通过 localStorage 存储和读取

## 开发要点

### 添加新功能
1. 在 `src/types.ts` 中定义相关类型
2. 在 `src/constants.ts` 中添加配置或数据
3. 创建新的 React 组件并实现逻辑
4. 在 `App.tsx` 中集成组件并添加导航
5. 编写相应的样式文件

### 代码规范
- 使用 TypeScript 进行类型安全开发
- 组件使用函数式写法和 React Hooks
- 样式使用 CSS Modules 或 CSS-in-JS（如果需要）
- 遵循 ESLint 检查规则

### 浏览器兼容性
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+