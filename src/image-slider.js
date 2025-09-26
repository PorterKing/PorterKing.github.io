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
        this.imageCache = new Map();
        this.loadingQueue = [];
        this.isInitialLoadComplete = false;
        this.preloadedImages = new Set();

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

        // 优先加载前几张图片
        const priorityImages = await this.loadPriorityImages(imagesToCheck.slice(0, 5));

        if (priorityImages.length > 0) {
            this.images = priorityImages;
            this.showImage(0); // 立即显示第一张
            this.updateCounter();
            console.log(`优先加载了前 ${priorityImages.length} 张图片`);
        }

        // 后台继续加载剩余图片
        this.loadRemainingImages(imagesToCheck);
    }

    async loadPriorityImages(priorityPaths) {
        console.log('正在优先加载前几张图片...');
        const existingImages = [];

        // 顺序加载优先图片，确保按顺序显示
        for (const imagePath of priorityPaths) {
            try {
                const exists = await this.preloadImage(imagePath);
                if (exists) {
                    existingImages.push(imagePath);
                    this.preloadedImages.add(imagePath);
                }
            } catch (error) {
                continue;
            }
        }

        return this.sortImagesByNumber(existingImages);
    }

    async loadRemainingImages(allImagePaths) {
        console.log('后台加载剩余图片...');
        const remainingPaths = allImagePaths.filter(path => !this.preloadedImages.has(path));

        // 使用较小的批次和更快的超时
        const batchSize = 5;
        const allExistingImages = [...this.images];

        for (let i = 0; i < remainingPaths.length; i += batchSize) {
            const batch = remainingPaths.slice(i, i + batchSize);

            const batchResults = await Promise.allSettled(
                batch.map(async (imagePath) => {
                    const exists = await this.fastImageCheck(imagePath);
                    return { path: imagePath, exists };
                })
            );

            // 收集新发现的图片
            const newImages = [];
            batchResults.forEach((result) => {
                if (result.status === 'fulfilled' && result.value.exists) {
                    newImages.push(result.value.path);
                }
            });

            if (newImages.length > 0) {
                // 添加到总列表并重新排序
                allExistingImages.push(...newImages);
                this.images = this.sortImagesByNumber(allExistingImages);
                this.updateCounter();
                console.log(`发现了 ${newImages.length} 张新图片，总计 ${this.images.length} 张`);
            }

            // 避免阻塞UI
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        this.isInitialLoadComplete = true;
        console.log(`所有图片加载完成，共 ${this.images.length} 张`);
    }

    sortImagesByNumber(imagePaths) {
        return imagePaths.sort((a, b) => {
            const getNumber = (path) => {
                const match = path.match(/(\d+)\./);
                return match ? parseInt(match[1]) : 999;
            };
            return getNumber(a) - getNumber(b);
        });
    }

    preloadImage(imagePath) {
        return new Promise((resolve) => {
            // 检查缓存
            if (this.imageCache.has(imagePath)) {
                resolve(true);
                return;
            }

            const img = new Image();
            let isResolved = false;

            const handleLoad = () => {
                if (isResolved) return;
                isResolved = true;
                this.imageCache.set(imagePath, img);
                console.log(`✅ 图片预加载成功: ${imagePath.split('/').pop()}`);
                resolve(true);
            };

            const handleError = () => {
                if (isResolved) return;
                isResolved = true;
                console.log(`❌ 图片不存在: ${imagePath.split('/').pop()}`);
                resolve(false);
            };

            img.onload = handleLoad;
            img.onerror = handleError;

            // 优先图片使用较长超时，确保重要图片能加载完成
            const timeoutId = setTimeout(() => {
                if (!isResolved) {
                    isResolved = true;
                    console.log(`⏰ 图片加载超时: ${imagePath.split('/').pop()}`);
                    resolve(false);
                }
            }, 10000);

            // 设置图片源，触发加载
            img.src = imagePath;

            // 清理超时器
            img.onload = () => {
                clearTimeout(timeoutId);
                handleLoad();
            };

            img.onerror = () => {
                clearTimeout(timeoutId);
                handleError();
            };
        });
    }

    fastImageCheck(imagePath) {
        return new Promise((resolve) => {
            // 检查缓存
            if (this.imageCache.has(imagePath)) {
                resolve(true);
                return;
            }

            const img = new Image();
            let isResolved = false;

            const handleLoad = () => {
                if (isResolved) return;
                isResolved = true;
                this.imageCache.set(imagePath, img);
                resolve(true);
            };

            const handleError = () => {
                if (isResolved) return;
                isResolved = true;
                resolve(false);
            };

            img.onload = handleLoad;
            img.onerror = handleError;

            // 后台加载使用较短超时，快速检测
            const timeoutId = setTimeout(() => {
                if (!isResolved) {
                    isResolved = true;
                    resolve(false);
                }
            }, 4000);

            // 设置图片源
            img.src = imagePath;

            // 清理超时器
            img.onload = () => {
                clearTimeout(timeoutId);
                handleLoad();
            };

            img.onerror = () => {
                clearTimeout(timeoutId);
                handleError();
            };
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
            this.showImageWithTransition(imagePath);
        }

        // 预加载相邻图片
        this.preloadAdjacentImages();

        // 定期清理缓存
        this.cleanupCache();

        // 更新计数器
        this.updateCounter();

        // 添加切换动画效果
        this.addTransitionEffect();
    }

    showImageWithTransition(imagePath) {
        // 创建新的图片元素
        const imgElement = document.createElement('div');
        imgElement.className = 'background-image';

        // 先隐藏，等加载完再显示
        imgElement.style.opacity = '0';
        imgElement.style.transition = 'opacity 0.5s ease-in-out';

        // 检查是否有缓存的图片
        if (this.imageCache.has(imagePath)) {
            imgElement.style.backgroundImage = `url(${imagePath})`;
            imgElement.style.opacity = '1';
            imgElement.classList.add('active');
        } else {
            // 显示加载占位符
            imgElement.classList.add('loading');
            imgElement.innerHTML = `
                <div class="image-loading">
                    <div class="loading-spinner"></div>
                    <p>加载中...</p>
                </div>
            `;

            // 异步加载图片
            this.loadImageAsync(imagePath).then((success) => {
                if (success) {
                    imgElement.innerHTML = '';
                    imgElement.classList.remove('loading');
                    imgElement.style.backgroundImage = `url(${imagePath})`;
                    imgElement.style.opacity = '1';
                    imgElement.classList.add('active');
                }
            });
        }

        // 移除之前的图片
        const oldImages = this.elements.backgroundSlider.querySelectorAll('.background-image');
        oldImages.forEach(img => {
            img.classList.remove('active');
            img.style.opacity = '0';
            setTimeout(() => {
                if (img.parentNode) {
                    img.parentNode.removeChild(img);
                }
            }, 500);
        });

        // 添加新图片
        this.elements.backgroundSlider.appendChild(imgElement);
    }

    async loadImageAsync(imagePath) {
        try {
            const success = await this.fastImageCheck(imagePath);
            return success;
        } catch (error) {
            console.error(`图片加载失败: ${imagePath}`, error);
            return false;
        }
    }

    preloadAdjacentImages() {
        if (this.images.length <= 1) return;

        // 预加载前后各2张图片
        const preloadIndices = [];
        for (let i = -2; i <= 2; i++) {
            if (i === 0) continue; // 跳过当前图片
            const index = (this.currentImageIndex + i + this.images.length) % this.images.length;
            preloadIndices.push(index);
        }

        // 异步预加载
        preloadIndices.forEach(index => {
            const imagePath = this.images[index];
            if (!this.imageCache.has(imagePath)) {
                this.fastImageCheck(imagePath);
            }
        });
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

    // 缓存清理机制
    cleanupCache() {
        // 当缓存超过50张图片时，清理不常用的图片
        if (this.imageCache.size > 50) {
            console.log('开始清理图片缓存...');
            const keys = Array.from(this.imageCache.keys());
            const currentImagePath = this.images[this.currentImageIndex];

            // 保留当前图片和相邻的10张图片
            const keepPaths = new Set();
            for (let i = -5; i <= 5; i++) {
                const index = (this.currentImageIndex + i + this.images.length) % this.images.length;
                if (this.images[index]) {
                    keepPaths.add(this.images[index]);
                }
            }

            // 删除不需要保留的缓存
            keys.forEach(path => {
                if (!keepPaths.has(path)) {
                    this.imageCache.delete(path);
                }
            });

            console.log(`缓存清理完成，保留 ${this.imageCache.size} 张图片`);
        }
    }

    // 获取缓存统计
    getCacheStats() {
        return {
            cachedImages: this.imageCache.size,
            totalImages: this.images.length,
            preloadedImages: this.preloadedImages.size,
            cacheHitRate: this.imageCache.size / Math.max(this.images.length, 1)
        };
    }

    // 销毁轮播器
    destroy() {
        this.stopAutoPlay();
        this.imageCache.clear();
        this.preloadedImages.clear();
        this.loadingQueue = [];
        console.log('图片轮播器已销毁，缓存已清理');
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageSlider;
} else {
    window.ImageSlider = ImageSlider;
}