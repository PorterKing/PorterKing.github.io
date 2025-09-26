# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

**波&雪的专属纪念网页** - 这是一个为情侣打造的浪漫纪念网页，记录两人从2024年3月18日开始的美好时光。项目采用纯前端技术，无需服务器部署，完全本地运行。

## 常用命令

### 启动开发服务器
```bash
npm start
# 或者
npm run dev
# 或直接使用Python
python3 -m http.server 3000
```
在浏览器中访问 http://localhost:3000

### 项目构建
```bash
npm run build
```
将src目录的文件复制到public目录用于部署

### 代码检查
```bash
npm run lint
```

## 核心功能架构

### 1. 爱情时间计数器 (`src/love-timer.js`)
- **功能**: 实时计算并显示从2024-03-18开始的相恋时间
- **更新频率**: 每秒更新一次
- **特殊功能**: 在特殊纪念日（100天、1年等）自动显示庆祝消息
- **显示格式**: 天、小时、分钟、秒的动态计数

### 2. 图片轮播系统 (`src/image-slider.js`)
- **图片源**: 自动扫描 `assets/images/` 文件夹
- **支持格式**: JPG, PNG, GIF, WebP
- **命名规范**: 推荐使用 01.jpg, 02.jpg... 或有意义的名称
- **交互方式**:
  - 键盘：← → 箭头键
  - 鼠标：点击按钮
  - 触摸：左右滑动（移动端）
  - 自动播放：每5秒切换

### 3. 背景音乐播放器 (`src/music-player.js`)
- **音乐源**: 自动扫描 `assets/music/` 文件夹
- **支持格式**: MP3, WAV, OGG, M4A
- **功能**: 播放/暂停、音量调节、自动切换
- **快捷键**: P键播放/暂停，N键下一首

### 4. 主控制器 (`src/main.js`)
- **初始化**: 统一管理所有模块的启动
- **特效**: 爱心飘落动画、点击爱心效果、随机爱情话语
- **交互**: 双击显示爱情话语，鼠标移动视差效果
- **快捷键**: Ctrl+H显示帮助，Ctrl+I显示信息

## 配置文件详解

### `config/love-config.js`
```javascript
const LOVE_CONFIG = {
    startDate: '2024-03-18T00:00:00',  // 恋爱开始时间
    display: {
        timerInterval: 1000,           // 计时器更新间隔
        imageInterval: 5000,           // 图片轮播间隔
        heartAnimation: {              // 爱心动画配置
            enabled: true,
            interval: 3000,
            maxHearts: 20
        }
    },
    personalization: {                 // 个性化设置
        primaryColor: '#ff6b9d',       // 主色调
        secondaryColor: '#a8e6cf',     // 辅助色
        title: '波&雪的专属回忆',        // 标题文字
        footerMessage: '💕 愿我们的爱情如星辰般永恒 💕'
    }
}
```

## 文件结构说明

```
bo&xue/
├── index.html                 # 主页面，包含完整的HTML结构
├── src/                      # 核心代码目录
│   ├── styles.css            # 浪漫主题样式（毛玻璃效果、渐变色彩）
│   ├── love-timer.js         # 时间计数器模块
│   ├── image-slider.js       # 图片轮播模块
│   ├── music-player.js       # 音乐播放模块
│   └── main.js               # 主控制器和特效
├── assets/                   # 资源文件目录
│   ├── images/              # 图片文件夹（用户添加照片）
│   └── music/               # 音乐文件夹（用户添加音乐）
├── config/                  # 配置文件
│   └── love-config.js       # 核心配置
└── package.json            # 项目配置
```

## 用户使用指南

### 添加照片
1. 将照片文件放入 `assets/images/` 文件夹
2. 推荐命名：01.jpg, 02.jpg, 03.jpg...
3. 支持格式：JPG, PNG, GIF, WebP
4. 建议尺寸：1920x1080或更高

### 添加音乐
1. 将音乐文件放入 `assets/music/` 文件夹
2. 支持格式：MP3, WAV, OGG, M4A
3. 推荐轻柔浪漫的音乐类型

### 个性化定制
- 修改 `config/love-config.js` 中的配置
- 可以更改颜色主题、文字内容、时间间隔等
- 修改恋爱开始日期：`startDate` 字段

## 技术特点

### 前端技术栈
- **HTML5**: 语义化结构，无障碍支持
- **CSS3**: 现代设计（毛玻璃效果、CSS Grid、Flexbox）
- **JavaScript ES6+**: 模块化架构，异步处理
- **响应式设计**: 移动优先，适配所有设备

### 设计风格
- **毛玻璃效果**: backdrop-filter 和半透明背景
- **渐变色彩**: 粉色到紫色的浪漫色调
- **动画效果**: 心跳动画、飘浮爱心、平滑过渡
- **交互反馈**: 悬停效果、点击动画、键盘支持

### 性能优化
- **懒加载**: 图片按需加载
- **节流控制**: 动画和事件优化
- **内存管理**: 及时清理DOM元素和定时器
- **缓存策略**: 图片和音频文件缓存

## 开发注意事项

### 修改样式时
- 主要颜色定义在CSS变量中（`:root`）
- 响应式断点：768px（平板）、480px（手机）
- 动画时长统一使用 `--transition` 变量

### 添加新功能时
- 在对应的模块文件中添加功能
- 在 `main.js` 中集成新模块
- 更新 `config/love-config.js` 添加相关配置

### 调试技巧
- 打开浏览器控制台查看日志
- 使用 `window.loveApp` 访问应用实例
- 检查文件加载情况（Network面板）

## 部署建议

### 本地部署
- 直接用浏览器打开 `index.html`
- 或使用Python HTTP服务器

### 静态网站部署
- 支持GitHub Pages、Netlify、Vercel等
- 上传整个项目文件夹即可
- 无需服务器端配置

### 移动端优化
- PWA支持（可添加到主屏幕）
- 触摸手势优化
- 移动端专用样式调整

这个项目专注于创造浪漫温馨的用户体验，每个细节都为爱情而设计。💕