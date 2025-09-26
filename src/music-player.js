/**
 * 背景音乐播放器模块
 * 播放适合情侣的浪漫背景音乐
 * 支持播放控制、音量调节和音乐切换
 */

class MusicPlayer {
    constructor() {
        this.currentTrackIndex = 0;
        this.musicTracks = [];
        this.audio = null;
        this.isPlaying = false;
        this.currentVolume = LOVE_CONFIG.music.defaultVolume;

        this.elements = {
            playBtn: document.getElementById('playBtn'),
            musicInfo: document.getElementById('musicInfo'),
            volumeSlider: document.getElementById('volumeSlider'),
            musicIcon: document.querySelector('.music-icon'),
            musicText: document.querySelector('.music-text')
        };

        this.init();
    }

    async init() {
        try {
            // 初始化音频对象
            this.audio = new Audio();
            this.setupAudioEvents();

            // 加载音乐文件
            await this.loadMusicTracks();

            // 初始化控制界面
            this.initControls();

            // 设置默认音量
            this.setVolume(this.currentVolume);

            console.log(`音乐播放器初始化完成，共发现 ${this.musicTracks.length} 首音乐`);

        } catch (error) {
            console.error('音乐播放器初始化失败:', error);
            this.showNoMusicMessage();
        }
    }

    async loadMusicTracks() {
        // 使用预定义的音乐列表
        const musicList = window.MUSIC_LIST || [];

        console.log('🎵 开始加载音乐列表...');
        console.log('📋 预定义音乐列表:', musicList);

        const predefinedTracks = musicList.map((path, index) => {
            const filename = path.split('/').pop();
            const name = filename.replace(/\.[^/.]+$/, ""); // 移除扩展名
            return {
                name: name === 'music' ? '我们的浪漫音乐' : name,
                path: path
            };
        });

        console.log(`🔍 正在检查 ${predefinedTracks.length} 首音乐的可用性...`);

        // 检查哪些音乐文件存在
        this.musicTracks = await this.checkMusicTracksExist(predefinedTracks);

        console.log(`✅ 成功加载 ${this.musicTracks.length} 首音乐`);

        if (this.musicTracks.length === 0) {
            console.error('❌ 没有找到任何可用的音乐文件!');
            console.log('🔧 请检查以下几点:');
            console.log('  1. 音乐文件是否存在于 assets/music/ 目录');
            console.log('  2. 文件名是否正确');
            console.log('  3. 网络连接和文件权限');
        }
    }

    async checkMusicTracksExist(tracks) {
        const existingTracks = [];

        for (const track of tracks) {
            try {
                console.log(`🔍 检查音乐文件: ${track.path}`);
                const exists = await this.audioFileExists(track.path);
                if (exists) {
                    console.log(`✅ 音乐文件可用: ${track.path}`);
                    existingTracks.push(track);
                } else {
                    console.log(`❌ 音乐文件不可用: ${track.path}`);
                }
            } catch (error) {
                console.error(`🚫 音乐文件检查出错: ${track.path}`, error);
                continue;
            }
        }

        return existingTracks;
    }

    audioFileExists(audioPath) {
        return new Promise((resolve) => {
            const audio = new Audio();

            const timeout = setTimeout(() => {
                console.log(`⏰ 音频检查超时: ${audioPath}`);
                resolve(false);
            }, 8000); // 增加到8秒超时，适应网络延迟

            audio.addEventListener('canplaythrough', () => {
                console.log(`🎵 音频可以播放: ${audioPath}`);
                clearTimeout(timeout);
                resolve(true);
            });

            audio.addEventListener('loadeddata', () => {
                console.log(`📦 音频数据已加载: ${audioPath}`);
                clearTimeout(timeout);
                resolve(true);
            });

            audio.addEventListener('error', (e) => {
                console.error(`❌ 音频加载错误: ${audioPath}`, e);
                clearTimeout(timeout);
                resolve(false);
            });

            // 设置音频源开始加载
            console.log(`📡 开始加载音频: ${audioPath}`);
            audio.src = audioPath;
        });
    }

    setupAudioEvents() {
        if (!this.audio) return;

        // 音乐加载完成
        this.audio.addEventListener('loadeddata', () => {
            console.log('音乐加载完成');
        });

        // 音乐播放结束
        this.audio.addEventListener('ended', () => {
            if (this.musicTracks.length === 1 && !this.audio.loop) {
                // 单曲循环播放（如果loop没有生效的话）
                console.log('🔄 单曲播放结束，重新开始');
                this.replayCurrent();
            } else if (this.musicTracks.length > 1) {
                // 多曲时切换到下一首
                this.nextTrack();
            }
            // 如果loop=true，浏览器会自动循环，不需要手动处理
        });

        // 播放出错
        this.audio.addEventListener('error', (e) => {
            console.error('音乐播放错误:', e);
            this.nextTrack();
        });

        // 音量变化
        this.audio.addEventListener('volumechange', () => {
            this.updateVolumeDisplay();
        });

        // 播放状态变化
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayButton();
        });

        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayButton();
        });
    }

    initControls() {
        // 播放/暂停按钮
        if (this.elements.playBtn) {
            this.elements.playBtn.addEventListener('click', () => {
                this.togglePlay();
            });
        }

        // 音量控制
        if (this.elements.volumeSlider) {
            this.elements.volumeSlider.addEventListener('input', (e) => {
                const volume = parseFloat(e.target.value) / 100;
                this.setVolume(volume);
            });

            // 设置初始音量
            this.elements.volumeSlider.value = this.currentVolume * 100;
        }

        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (e.key === 'p' || e.key === 'P') {
                e.preventDefault();
                this.togglePlay();
            } else if (e.key === 'n' || e.key === 'N') {
                e.preventDefault();
                if (this.musicTracks.length === 1) {
                    // 单曲时按N键重新开始播放
                    console.log('🔄 单曲模式下重新开始播放');
                    this.replayCurrent();
                } else {
                    this.nextTrack();
                }
            }
        });

        // 加载第一首音乐
        if (this.musicTracks.length > 0) {
            this.loadTrack(0);

            // 如果配置为自动播放，延迟2秒后开始播放
            if (LOVE_CONFIG.music.autoPlay) {
                setTimeout(() => {
                    this.autoPlayMusic();
                }, 2000);
            }
        } else {
            this.showNoMusicMessage();
        }
    }

    async togglePlay() {
        if (!this.audio || this.musicTracks.length === 0) {
            this.showNoMusicMessage();
            return;
        }

        try {
            if (this.isPlaying) {
                this.audio.pause();
            } else {
                // 现代浏览器需要用户交互才能播放音频
                await this.audio.play();
            }
        } catch (error) {
            console.error('播放/暂停失败:', error);

            // 如果是因为用户没有交互导致的错误，显示提示
            if (error.name === 'NotAllowedError') {
                this.showPlayPermissionMessage();
            }
        }
    }

    async autoPlayMusic() {
        if (!this.audio || this.musicTracks.length === 0) return;

        try {
            // 尝试自动播放音乐
            await this.audio.play();
            console.log('🎵 背景音乐自动播放开始');
        } catch (error) {
            console.log('自动播放被浏览器阻止，等待用户交互');
            // 显示温馨提示，不显示错误
            this.showAutoPlayTip();
        }
    }

    loadTrack(index) {
        if (!this.audio || this.musicTracks.length === 0) return;

        // 确保索引有效
        this.currentTrackIndex = ((index % this.musicTracks.length) + this.musicTracks.length) % this.musicTracks.length;

        const track = this.musicTracks[this.currentTrackIndex];

        // 停止当前播放
        if (this.isPlaying) {
            this.audio.pause();
        }

        // 加载新音乐
        this.audio.src = track.path;
        this.audio.load();

        // 如果只有一首歌，设置为循环播放
        if (this.musicTracks.length === 1) {
            this.audio.loop = true;
            console.log(`🔄 单曲循环模式已开启: ${track.name}`);
        } else {
            this.audio.loop = false;
        }

        // 更新界面显示
        this.updateMusicInfo(track);

        console.log(`加载音乐: ${track.name}`);
    }

    replayCurrent() {
        if (this.musicTracks.length === 0) return;

        console.log('🔄 单曲循环播放');

        // 重置播放位置到开头
        if (this.audio) {
            this.audio.currentTime = 0;
            // 继续播放
            this.audio.play().catch(error => {
                console.error('单曲循环播放失败:', error);
            });
        }
    }

    nextTrack() {
        if (this.musicTracks.length === 0) return;

        const wasPlaying = this.isPlaying;

        // 如果只有一首歌，重新播放同一首
        if (this.musicTracks.length === 1) {
            console.log('🎵 只有一首歌，重新开始播放');
            this.replayCurrent();
            return;
        } else {
            // 多首歌时，切换到下一首，实现轮询播放
            const nextIndex = (this.currentTrackIndex + 1) % this.musicTracks.length;
            this.loadTrack(nextIndex);
        }

        // 如果之前在播放，继续播放下一首
        if (wasPlaying) {
            setTimeout(() => {
                this.togglePlay();
            }, 500);
        }

        console.log(`🎵 自动切换到: ${this.musicTracks[this.currentTrackIndex]?.name || '未知音乐'}`);
    }

    prevTrack() {
        if (this.musicTracks.length === 0) return;

        const wasPlaying = this.isPlaying;

        // 如果只有一首歌，重新播放同一首
        if (this.musicTracks.length === 1) {
            console.log('🎵 只有一首歌，重新开始播放');
            this.replayCurrent();
            return;
        } else {
            // 多首歌时，切换到上一首，实现轮询播放
            const prevIndex = (this.currentTrackIndex - 1 + this.musicTracks.length) % this.musicTracks.length;
            this.loadTrack(prevIndex);
        }

        // 如果之前在播放，继续播放上一首
        if (wasPlaying) {
            setTimeout(() => {
                this.togglePlay();
            }, 500);
        }

        console.log(`🎵 手动切换到: ${this.musicTracks[this.currentTrackIndex]?.name || '未知音乐'}`);
    }

    setVolume(volume) {
        this.currentVolume = Math.max(0, Math.min(1, volume));

        if (this.audio) {
            this.audio.volume = this.currentVolume;
        }

        this.updateVolumeDisplay();
    }

    updatePlayButton() {
        if (!this.elements.playBtn) return;

        if (this.isPlaying) {
            if (this.elements.musicIcon) {
                this.elements.musicIcon.textContent = '⏸️';
            }
            if (this.elements.musicText) {
                this.elements.musicText.textContent = '暂停音乐';
            }
            this.elements.playBtn.classList.add('playing');
        } else {
            if (this.elements.musicIcon) {
                this.elements.musicIcon.textContent = '▶️';
            }
            if (this.elements.musicText) {
                this.elements.musicText.textContent = '播放音乐';
            }
            this.elements.playBtn.classList.remove('playing');
        }
    }

    updateMusicInfo(track) {
        if (this.elements.musicInfo) {
            const musicName = this.elements.musicInfo.querySelector('.music-name');
            if (musicName) {
                let displayName = track ? track.name : '暂无音乐';

                // 如果只有一首歌，显示循环标识
                if (this.musicTracks.length === 1 && track) {
                    displayName = `🔄 ${track.name} (单曲循环)`;
                }

                musicName.textContent = displayName;
            }
        }
    }

    updateVolumeDisplay() {
        if (this.elements.volumeSlider) {
            this.elements.volumeSlider.value = this.currentVolume * 100;
        }

        // 更新音量图标
        const volumeIcon = document.querySelector('.volume-icon');
        if (volumeIcon) {
            if (this.currentVolume === 0) {
                volumeIcon.textContent = '🔇';
            } else if (this.currentVolume < 0.5) {
                volumeIcon.textContent = '🔉';
            } else {
                volumeIcon.textContent = '🔊';
            }
        }
    }

    showNoMusicMessage() {
        if (this.elements.musicInfo) {
            const musicName = this.elements.musicInfo.querySelector('.music-name');
            if (musicName) {
                musicName.textContent = '请添加音乐文件到 assets/music/ 文件夹';
            }
        }

        if (this.elements.playBtn) {
            this.elements.playBtn.disabled = true;
            this.elements.playBtn.style.opacity = '0.5';
        }
    }

    showPlayPermissionMessage() {
        // 创建提示消息
        const message = document.createElement('div');
        message.className = 'play-permission-message';
        message.innerHTML = `
            <p>🎵 请点击播放按钮来启动音乐</p>
            <p>（浏览器需要用户交互才能播放音频）</p>
        `;

        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 107, 157, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 9999;
            text-align: center;
            animation: fadeInOut 3s ease;
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 3000);
    }

    showAutoPlayTip() {
        // 创建温馨提示
        const tip = document.createElement('div');
        tip.className = 'auto-play-tip';
        tip.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">🎵</span>
                <div>
                    <p><strong>音乐准备就绪</strong></p>
                    <p>点击播放按钮开启浪漫时光</p>
                </div>
            </div>
        `;

        tip.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, rgba(255, 107, 157, 0.95), rgba(200, 154, 230, 0.95));
            color: white;
            padding: 15px 20px;
            border-radius: 15px;
            z-index: 9999;
            font-size: 14px;
            max-width: 280px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            animation: slideInRight 0.5s ease-out;
        `;

        document.body.appendChild(tip);

        // 点击提示可关闭
        tip.addEventListener('click', () => {
            tip.remove();
        });

        // 10秒后自动消失
        setTimeout(() => {
            if (tip.parentNode) {
                tip.style.animation = 'slideOutRight 0.5s ease-out';
                setTimeout(() => tip.remove(), 500);
            }
        }, 10000);
    }

    // 获取播放器状态
    getPlayerState() {
        return {
            isPlaying: this.isPlaying,
            currentTrack: this.musicTracks[this.currentTrackIndex] || null,
            volume: this.currentVolume,
            tracksCount: this.musicTracks.length
        };
    }

    // 销毁播放器
    destroy() {
        if (this.audio) {
            this.audio.pause();
            this.audio = null;
        }
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MusicPlayer;
} else {
    window.MusicPlayer = MusicPlayer;
}