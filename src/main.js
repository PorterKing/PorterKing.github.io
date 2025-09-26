/**
 * 主控制器 - 波&雪的专属纪念网页
 * 统一管理所有模块的初始化和交互
 */

class LoveMemoryApp {
    constructor() {
        this.loveTimer = null;
        this.imageSlider = null;
        this.musicPlayer = null;
        this.heartsAnimation = null;
        this.hasTriedAutoPlay = false;

        this.init();
    }

    async init() {
        try {
            console.log('🌹 波&雪的专属纪念网页正在初始化...');

            // 等待DOM完全加载
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // 初始化各个模块
            await this.initModules();

            // 初始化爱心动画
            this.initHeartsAnimation();

            // 添加特殊交互
            this.initSpecialInteractions();

            // 显示欢迎消息
            this.showWelcomeMessage();

            console.log('💕 所有模块初始化完成！');

        } catch (error) {
            console.error('初始化失败:', error);
        }
    }

    async initModules() {
        // 初始化爱情时间计数器
        if (typeof LoveTimer !== 'undefined') {
            this.loveTimer = new LoveTimer();
            console.log('⏰ 时间计数器已启动');
        }

        // 初始化图片轮播
        if (typeof ImageSlider !== 'undefined') {
            this.imageSlider = new ImageSlider();
            console.log('🖼️ 图片轮播已启动');
        }

        // 初始化音乐播放器
        if (typeof MusicPlayer !== 'undefined') {
            this.musicPlayer = new MusicPlayer();
            console.log('🎵 音乐播放器已启动');
        }

        // 等待一小段时间让模块完全初始化
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    initHeartsAnimation() {
        if (!LOVE_CONFIG.display.heartAnimation.enabled) return;

        const heartsContainer = document.getElementById('heartsBackground');
        if (!heartsContainer) return;

        this.heartsAnimation = setInterval(() => {
            this.createFloatingHeart();
        }, LOVE_CONFIG.display.heartAnimation.interval);

        console.log('💖 爱心动画已启动');
    }

    createFloatingHeart() {
        const heartsContainer = document.getElementById('heartsBackground');
        if (!heartsContainer) return;

        // 限制爱心数量
        const existingHearts = heartsContainer.children.length;
        if (existingHearts >= LOVE_CONFIG.display.heartAnimation.maxHearts) {
            return;
        }

        const heart = document.createElement('div');
        heart.className = 'floating-heart';

        // 随机选择爱心样式
        const heartSymbols = ['💕', '💖', '💗', '💝', '💞', '💟', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤍', '🖤'];
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

        // 随机位置和动画属性
        const startX = Math.random() * window.innerWidth;
        const animationDuration = 3 + Math.random() * 4; // 3-7秒
        const heartSize = 20 + Math.random() * 20; // 20-40px

        heart.style.cssText = `
            position: fixed;
            left: ${startX}px;
            bottom: -50px;
            font-size: ${heartSize}px;
            animation: floatUp ${animationDuration}s ease-out forwards;
            pointer-events: none;
            z-index: 1;
        `;

        heartsContainer.appendChild(heart);

        // 动画结束后移除元素
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, animationDuration * 1000);
    }

    initSpecialInteractions() {
        // 点击页面创建爱心
        document.addEventListener('click', (e) => {
            this.createClickHeart(e.clientX, e.clientY);

            // 首次点击时尝试自动播放音乐
            this.tryAutoPlayOnFirstClick();
        });

        // 双击显示特殊消息
        let clickCount = 0;
        document.addEventListener('click', () => {
            clickCount++;
            setTimeout(() => {
                if (clickCount === 1) {
                    clickCount = 0;
                } else if (clickCount >= 2) {
                    this.showRandomLoveMessage();
                    clickCount = 0;
                }
            }, 300);
        });

        // 鼠标移动产生微妙的视差效果
        document.addEventListener('mousemove', (e) => {
            this.addParallaxEffect(e);
        });

        // 添加键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'h':
                        e.preventDefault();
                        this.showHelpMessage();
                        break;
                    case 'i':
                        e.preventDefault();
                        this.showAppInfo();
                        break;
                }
            }
        });
    }

    createClickHeart(x, y) {
        const heart = document.createElement('div');
        heart.textContent = '💖';
        heart.className = 'click-heart';

        heart.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: 24px;
            color: ${LOVE_CONFIG.personalization.primaryColor};
            animation: heartPop 0.8s ease-out forwards;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
        `;

        document.body.appendChild(heart);

        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 800);
    }

    addParallaxEffect(e) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

        const container = document.querySelector('.container');
        if (container) {
            container.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    }

    showRandomLoveMessage() {
        const loveMessages = [
            '💕 每一天都是我们爱情故事的新篇章',
            '🌟 和你在一起的每一刻都闪闪发光',
            '💖 你是我心中最美的风景',
            '🌹 爱你不是一天两天，而是每天都在延续',
            '💫 感谢遇见你，让我的世界如此美好',
            '🌸 你的笑容是我见过最美的花',
            '💝 我们的爱情就像这个计时器，永不停歇',
            '🦋 你来了，春天就来了',
            '💕 愿我们的爱情如星辰般永恒璀璨'
        ];

        const randomMessage = loveMessages[Math.floor(Math.random() * loveMessages.length)];
        this.showFloatingMessage(randomMessage, 4000);
    }

    showFloatingMessage(message, duration = 3000) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'floating-message';
        messageDiv.textContent = message;

        messageDiv.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, ${LOVE_CONFIG.personalization.primaryColor}, ${LOVE_CONFIG.personalization.secondaryColor});
            color: white;
            padding: 20px 30px;
            border-radius: 25px;
            font-size: 18px;
            font-weight: 500;
            z-index: 10000;
            animation: messageFloat 0.5s ease-out;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            max-width: 80%;
            text-align: center;
            backdrop-filter: blur(10px);
        `;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'messageFloat 0.5s ease-out reverse';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 500);
        }, duration);
    }

    showWelcomeMessage() {
        setTimeout(() => {
            const stats = this.loveTimer ? this.loveTimer.getTotalStats() : null;
            const message = stats ?
                `🌹 欢迎回到我们的专属回忆空间\n我们已经相爱了 ${stats.totalDays} 天了！` :
                '🌹 欢迎来到波&雪的专属纪念空间 💕';

            this.showFloatingMessage(message, 5000);
        }, 2000);
    }

    showHelpMessage() {
        const helpText = `
        🎹 键盘快捷键：
        P - 播放/暂停音乐
        N - 下一首音乐
        ← → - 切换图片
        Space - 开关自动轮播
        Ctrl+H - 显示帮助
        Ctrl+I - 显示信息

        🖱️ 鼠标操作：
        点击 - 产生爱心特效
        双击 - 显示随机爱情话语
        滑动 - 切换图片（移动端）
        `;

        this.showFloatingMessage(helpText, 8000);
    }

    showAppInfo() {
        const imageInfo = this.imageSlider ? this.imageSlider.getCurrentImageInfo() : null;
        const musicInfo = this.musicPlayer ? this.musicPlayer.getPlayerState() : null;
        const timerStats = this.loveTimer ? this.loveTimer.getTotalStats() : null;
        const cacheStats = this.imageSlider ? this.imageSlider.getCacheStats() : null;

        const infoText = `
        📊 系统信息：
        📷 图片: ${imageInfo ? `${imageInfo.total} 张` : '未加载'}
        🎵 音乐: ${musicInfo ? `${musicInfo.tracksCount} 首` : '未加载'}
        ⏰ 相恋时间: ${timerStats ? `${timerStats.totalDays} 天` : '计算中'}
        💕 制作于: 2024年

        🚀 性能信息：
        💾 缓存图片: ${cacheStats ? `${cacheStats.cachedImages} 张` : '0'}
        📈 缓存命中率: ${cacheStats ? `${(cacheStats.cacheHitRate * 100).toFixed(1)}%` : '0%'}
        ⚡ 预加载图片: ${cacheStats ? `${cacheStats.preloadedImages} 张` : '0'}
        `;

        this.showFloatingMessage(infoText, 6000);
    }

    // 获取应用状态
    getAppStatus() {
        return {
            loveTimer: this.loveTimer ? 'running' : 'stopped',
            imageSlider: this.imageSlider ? 'running' : 'stopped',
            musicPlayer: this.musicPlayer ? 'running' : 'stopped',
            heartsAnimation: this.heartsAnimation ? 'running' : 'stopped'
        };
    }

    tryAutoPlayOnFirstClick() {
        // 只在首次点击时尝试
        if (this.hasTriedAutoPlay) return;
        this.hasTriedAutoPlay = true;

        // 如果音乐播放器存在且音乐没有播放，尝试自动播放
        if (this.musicPlayer && !this.musicPlayer.isPlaying) {
            setTimeout(() => {
                this.musicPlayer.autoPlayMusic();
            }, 500);
        }
    }

    // 销毁应用
    destroy() {
        if (this.loveTimer) {
            this.loveTimer.destroy();
        }

        if (this.imageSlider) {
            this.imageSlider.destroy();
        }

        if (this.musicPlayer) {
            this.musicPlayer.destroy();
        }

        if (this.heartsAnimation) {
            clearInterval(this.heartsAnimation);
        }

        console.log('💔 应用已销毁');
    }
}

// 页面加载完成后自动初始化
let loveApp = null;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loveApp = new LoveMemoryApp();
    });
} else {
    loveApp = new LoveMemoryApp();
}

// 导出到全局，方便调试
window.LoveMemoryApp = LoveMemoryApp;
if (loveApp) {
    window.loveApp = loveApp;
}