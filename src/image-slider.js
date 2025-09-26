/**
 * 图片轮播模块
 * 自动读取assets/images文件夹中的图片进行轮播展示
 * 支持手动控制和自动播放
 */

class ImageSlider {
    constructor() {
        this.currentImageIndex = 0;
        this.images = [];
        this.autoPlayInterval = null;
        this.isAutoPlay = true;

        this.elements = {
            backgroundSlider: document.getElementById('backgroundSlider'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            imageCounter: document.getElementById('imageCounter'),
            autoPlayToggle: document.getElementById('autoPlayToggle')
        };

        this.init();
    }

    async init() {
        try {
            // 尝试加载图片
            await this.loadImages();

            // 初始化UI控制
            this.initControls();

            // 显示第一张图片
            if (this.images.length > 0) {
                this.showImage(0);
                this.startAutoPlay();
            } else {
                this.showNoImagesMessage();
            }

        } catch (error) {
            console.error('图片轮播初始化失败:', error);
            this.showNoImagesMessage();
        }
    }

    async loadImages() {
        // 使用预定义的图片列表
        const imagesToCheck = window.IMAGES_LIST || [];

        console.log(`正在检查 ${imagesToCheck.length} 张图片...`);

        // 检查哪些图片存在
        this.images = await this.checkImagesExist(imagesToCheck);

        console.log(`成功加载 ${this.images.length} 张图片`);
    }

    async checkImagesExist(imagePaths) {
        const existingImages = [];

        // 使用并发检测来提升性能，每次并发检查10个图片
        const batchSize = 10;

        for (let i = 0; i < imagePaths.length; i += batchSize) {
            const batch = imagePaths.slice(i, i + batchSize);

            const batchResults = await Promise.allSettled(
                batch.map(async (imagePath) => {
                    const exists = await this.imageExists(imagePath);
                    return { path: imagePath, exists };
                })
            );

            // 收集存在的图片
            batchResults.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value.exists) {
                    existingImages.push(result.value.path);
                }
            });

            // 显示检测进度
            console.log(`图片检测进度: ${Math.min(i + batchSize, imagePaths.length)}/${imagePaths.length}`);
        }

        // 按数字顺序排序图片
        return existingImages.sort((a, b) => {
            const getNumber = (path) => {
                const match = path.match(/(\d+)\./);
                return match ? parseInt(match[1]) : 999;
            };
            return getNumber(a) - getNumber(b);
        });
    }

    imageExists(imagePath) {
        return new Promise((resolve) => {
            const img = new Image();

            img.onload = () => {
                resolve(true);
            };

            img.onerror = () => {
                resolve(false);
            };

            // 设置超时
            setTimeout(() => resolve(false), 3000);

            img.src = imagePath;
        });
    }

    initControls() {
        // 上一张按钮
        if (this.elements.prevBtn) {
            this.elements.prevBtn.addEventListener('click', () => {
                this.prevImage();
            });
        }

        // 下一张按钮
        if (this.elements.nextBtn) {
            this.elements.nextBtn.addEventListener('click', () => {
                this.nextImage();
            });
        }

        // 自动播放开关
        if (this.elements.autoPlayToggle) {
            this.elements.autoPlayToggle.addEventListener('change', (e) => {
                this.isAutoPlay = e.target.checked;
                if (this.isAutoPlay) {
                    this.startAutoPlay();
                } else {
                    this.stopAutoPlay();
                }
            });
        }

        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevImage();
            } else if (e.key === 'ArrowRight') {
                this.nextImage();
            } else if (e.key === ' ') {
                e.preventDefault();
                this.toggleAutoPlay();
            }
        });

        // 触摸控制（移动端）
        this.initTouchControls();
    }

    initTouchControls() {
        let startX = 0;
        let startY = 0;

        if (this.elements.backgroundSlider) {
            this.elements.backgroundSlider.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });

            this.elements.backgroundSlider.addEventListener('touchend', (e) => {
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;

                const deltaX = endX - startX;
                const deltaY = endY - startY;

                // 检查是否为水平滑动
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                    if (deltaX > 0) {
                        this.prevImage(); // 向右滑动，显示上一张
                    } else {
                        this.nextImage(); // 向左滑动，显示下一张
                    }
                }
            });
        }
    }

    showImage(index) {
        if (!this.images || this.images.length === 0) return;

        // 确保索引在有效范围内
        this.currentImageIndex = ((index % this.images.length) + this.images.length) % this.images.length;

        const imagePath = this.images[this.currentImageIndex];

        // 更新背景图片
        if (this.elements.backgroundSlider) {
            // 创建新的图片元素
            const imgElement = document.createElement('div');
            imgElement.className = 'background-image active';
            imgElement.style.backgroundImage = `url(${imagePath})`;

            // 移除之前的图片
            const oldImages = this.elements.backgroundSlider.querySelectorAll('.background-image');
            oldImages.forEach(img => {
                img.classList.remove('active');
                setTimeout(() => {
                    if (img.parentNode) {
                        img.parentNode.removeChild(img);
                    }
                }, 500);
            });

            // 添加新图片
            this.elements.backgroundSlider.appendChild(imgElement);
        }

        // 更新计数器
        this.updateCounter();

        // 添加切换动画效果
        this.addTransitionEffect();
    }

    updateCounter() {
        if (this.elements.imageCounter) {
            this.elements.imageCounter.textContent =
                `${this.currentImageIndex + 1} / ${this.images.length}`;
        }
    }

    addTransitionEffect() {
        // 为整个容器添加淡入淡出效果
        const container = document.querySelector('.container');
        if (container) {
            container.classList.add('image-transition');
            setTimeout(() => {
                container.classList.remove('image-transition');
            }, 500);
        }
    }

    prevImage() {
        if (this.images.length === 0) return;
        this.showImage(this.currentImageIndex - 1);

        // 暂停自动播放一段时间
        if (this.isAutoPlay) {
            this.restartAutoPlay();
        }
    }

    nextImage() {
        if (this.images.length === 0) return;
        this.showImage(this.currentImageIndex + 1);

        // 暂停自动播放一段时间
        if (this.isAutoPlay) {
            this.restartAutoPlay();
        }
    }

    startAutoPlay() {
        if (!this.isAutoPlay || this.images.length <= 1) return;

        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextImage();
        }, LOVE_CONFIG.display.imageInterval);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    restartAutoPlay() {
        this.stopAutoPlay();
        setTimeout(() => {
            this.startAutoPlay();
        }, 2000); // 2秒后重新开始自动播放
    }

    toggleAutoPlay() {
        this.isAutoPlay = !this.isAutoPlay;

        if (this.elements.autoPlayToggle) {
            this.elements.autoPlayToggle.checked = this.isAutoPlay;
        }

        if (this.isAutoPlay) {
            this.startAutoPlay();
        } else {
            this.stopAutoPlay();
        }
    }

    showNoImagesMessage() {
        if (this.elements.backgroundSlider) {
            this.elements.backgroundSlider.innerHTML = `
                <div class="no-images-message">
                    <h3>🖼️ 还没有照片哦</h3>
                    <p>请将你们的纪念照片放入 <code>assets/images/</code> 文件夹中</p>
                    <p>支持的格式：JPG, PNG, GIF, WebP</p>
                    <p>建议命名：01.jpg, 02.jpg, 03.jpg...</p>
                    <div class="placeholder-heart">💕</div>
                </div>
            `;
        }

        if (this.elements.imageCounter) {
            this.elements.imageCounter.textContent = '0 / 0';
        }
    }

    // 获取当前图片信息
    getCurrentImageInfo() {
        if (this.images.length === 0) return null;

        return {
            index: this.currentImageIndex,
            total: this.images.length,
            path: this.images[this.currentImageIndex]
        };
    }

    // 销毁轮播器
    destroy() {
        this.stopAutoPlay();
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageSlider;
} else {
    window.ImageSlider = ImageSlider;
}