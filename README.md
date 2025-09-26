# 波&雪的专属纪念网页 💕

一个为情侣打造的浪漫纪念网页，记录从2024年3月18日开始的美好时光。

![Love Memorial](https://img.shields.io/badge/Love-Memorial-ff6b9d?style=for-the-badge&logo=heart)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 🌟 特色功能

- ⏰ **实时爱情计时器** - 精确显示相恋时间（天、小时、分钟、秒）
- 🖼️ **照片轮播展示** - 自动轮播珍贵回忆照片，支持手势控制
- 🎵 **背景音乐播放** - 浪漫背景音乐，营造温馨氛围
- 💖 **浪漫动效** - 飘落爱心、点击特效、温柔渐变
- 📱 **响应式设计** - 完美适配PC、平板、手机
- 🎨 **毛玻璃风格** - 现代美观的视觉设计

## 🚀 快速开始

### 1. 启动项目

```bash
# 方式一：使用npm
npm start

# 方式二：使用Python
python3 start_server.py

# 方式三：直接HTTP服务器
python3 -m http.server 3000
```

然后在浏览器访问: http://localhost:3000

### 2. 添加内容

#### 添加照片
- 将照片放入 `assets/images/` 文件夹
- 推荐命名：`0.jpg`, `1.jpg`, `2.jpg`...
- 支持格式：JPG, PNG, GIF, WebP

#### 添加音乐
- 将音乐放入 `assets/music/` 文件夹
- 命名如：`music1.mp3`, `music2.mp3`
- 支持格式：MP3, WAV, OGG, M4A

### 3. 个性化定制

编辑 `config/love-config.js` 文件：

```javascript
const LOVE_CONFIG = {
    startDate: '2024-03-18T00:00:00',  // 修改你们的开始时间
    personalization: {
        title: '你们的专属回忆',         // 自定义标题
        primaryColor: '#ff6b9d',        // 主色调
        footerMessage: '💕 你们的专属话语 💕'
    }
}
```

## 🎮 快捷键操作

| 按键 | 功能 |
|------|------|
| `P` | 播放/暂停音乐 |
| `N` | 下一首音乐 |
| `←` `→` | 切换图片 |
| `Space` | 开关自动轮播 |
| `Ctrl+H` | 显示帮助 |
| `Ctrl+I` | 显示系统信息 |

## 📁 项目结构

```
波&雪的纪念网页/
├── index.html              # 主页面
├── src/                    # 核心代码
│   ├── styles.css          # 样式文件
│   ├── love-timer.js       # 时间计数器
│   ├── image-slider.js     # 图片轮播
│   ├── music-player.js     # 音乐播放器
│   └── main.js             # 主控制器
├── assets/                 # 资源文件
│   ├── images/            # 照片存放处
│   └── music/             # 音乐存放处
├── config/                # 配置文件
│   ├── love-config.js     # 核心配置
│   └── images-list-fixed.js # 文件列表
└── start_server.py        # 启动脚本
```

## 🛠️ 技术栈

- **前端**: HTML5 + CSS3 + JavaScript ES6+
- **设计**: 毛玻璃效果、渐变色彩、响应式布局
- **动画**: CSS动画 + JavaScript交互特效
- **兼容**: 现代浏览器 + 移动端优化

## 🌈 设计亮点

- **毛玻璃效果**: `backdrop-filter` 营造梦幻感
- **浪漫配色**: 粉色到紫色的温柔渐变
- **流畅动画**: 心跳效果、飘落爱心、平滑过渡
- **用户体验**: 触摸手势、键盘快捷键、视差效果

## 📱 部署方案

### GitHub Pages
1. 上传代码到GitHub仓库
2. 在Settings中开启Pages
3. 选择分支发布即可

### Netlify/Vercel
1. 连接GitHub仓库
2. 自动构建部署
3. 获得自定义域名

### 本地分享
直接用浏览器打开 `index.html` 即可运行

## 💝 使用场景

- 🎂 **纪念日庆祝** - 特殊日期自动弹出庆祝消息
- 📷 **回忆展示** - 温馨展示两人的美好时光
- 🎁 **浪漫礼物** - 为TA定制的专属网页
- 💕 **日常陪伴** - 随时查看相恋时间和照片

## 🔧 开发指南

详细的开发文档请查看 [CLAUDE.md](./CLAUDE.md)

## 📄 许可证

[MIT License](./LICENSE) - 自由使用，记得给个⭐️

## 💌 致谢

献给所有相爱的人们，愿每一份爱情都如星辰般永恒璀璨。

---

<div align="center">
  <strong>💕 愿我们的爱情如星辰般永恒 💕</strong>
</div>