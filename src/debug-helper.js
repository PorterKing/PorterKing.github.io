/**
 * 调试辅助工具
 * 用于检测GitHub Pages部署后的常见问题
 */

class DebugHelper {
    constructor() {
        this.init();
    }

    init() {
        console.log('🔧 调试辅助工具已启动');
        this.detectEnvironment();
        this.checkResourceAccess();

        // 添加全局错误处理
        this.setupGlobalErrorHandling();
    }

    detectEnvironment() {
        const isGitHubPages = window.location.hostname.includes('github.io') ||
                             window.location.hostname.includes('huanglixue.com');
        const isHTTPS = window.location.protocol === 'https:';
        const isLocalhost = window.location.hostname === 'localhost' ||
                           window.location.hostname === '127.0.0.1';

        console.log('🌍 环境检测:');
        console.log(`  - GitHub Pages: ${isGitHubPages}`);
        console.log(`  - HTTPS: ${isHTTPS}`);
        console.log(`  - 本地环境: ${isLocalhost}`);
        console.log(`  - 当前域名: ${window.location.hostname}`);
        console.log(`  - 完整URL: ${window.location.href}`);

        // 设置全局变量供其他模块使用
        window.DEBUG_INFO = {
            isGitHubPages,
            isHTTPS,
            isLocalhost,
            hostname: window.location.hostname,
            fullURL: window.location.href
        };
    }

    async checkResourceAccess() {
        console.log('🔍 检查资源访问权限...');

        // 检查关键文件是否可访问
        const criticalFiles = [
            'assets/music/music.mp3',
            'assets/images/0.JPG',
            'assets/images/1.JPG',
            'config/love-config.js',
            'config/images-list-fixed.js'
        ];

        for (const file of criticalFiles) {
            try {
                const response = await fetch(file, { method: 'HEAD' });
                if (response.ok) {
                    console.log(`✅ 文件可访问: ${file}`);
                } else {
                    console.error(`❌ 文件不可访问: ${file} (状态: ${response.status})`);
                }
            } catch (error) {
                console.error(`🚫 文件访问错误: ${file}`, error);
            }
        }
    }

    setupGlobalErrorHandling() {
        // 捕获未处理的错误
        window.addEventListener('error', (event) => {
            console.error('🚨 全局错误:', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });

        // 捕获未处理的Promise错误
        window.addEventListener('unhandledrejection', (event) => {
            console.error('🚨 未处理的Promise错误:', event.reason);
        });

        // 捕获资源加载错误
        window.addEventListener('error', (event) => {
            if (event.target && event.target !== window) {
                console.error('🚨 资源加载错误:', {
                    type: event.target.tagName,
                    src: event.target.src || event.target.href,
                    message: '资源加载失败'
                });
            }
        }, true);
    }

    // 提供给其他模块使用的调试方法
    logResourceLoad(type, path, success, error = null) {
        const prefix = success ? '✅' : '❌';
        const message = `${prefix} ${type}加载: ${path}`;

        if (success) {
            console.log(message);
        } else {
            console.error(message, error);
        }
    }

    // 检查配置文件是否正确加载
    checkConfigLoaded() {
        const hasLoveConfig = typeof window.LOVE_CONFIG !== 'undefined';
        const hasImagesList = typeof window.IMAGES_LIST !== 'undefined';
        const hasMusicList = typeof window.MUSIC_LIST !== 'undefined';

        console.log('📋 配置文件检查:');
        console.log(`  - LOVE_CONFIG: ${hasLoveConfig}`);
        console.log(`  - IMAGES_LIST: ${hasImagesList} (长度: ${window.IMAGES_LIST?.length || 0})`);
        console.log(`  - MUSIC_LIST: ${hasMusicList} (长度: ${window.MUSIC_LIST?.length || 0})`);

        if (!hasLoveConfig || !hasImagesList || !hasMusicList) {
            console.error('⚠️ 部分配置文件未加载，请检查script标签和文件路径');
        }

        return { hasLoveConfig, hasImagesList, hasMusicList };
    }

    // 显示调试信息面板
    showDebugInfo() {
        const debugInfo = {
            environment: window.DEBUG_INFO,
            config: this.checkConfigLoaded(),
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            performance: {
                loadTime: performance.now(),
                memory: performance.memory ? {
                    used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + ' MB',
                    total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + ' MB'
                } : 'N/A'
            }
        };

        console.log('🔧 调试信息汇总:', debugInfo);
        return debugInfo;
    }
}

// 自动初始化调试工具
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.debugHelper = new DebugHelper();
    });
} else {
    window.debugHelper = new DebugHelper();
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DebugHelper;
} else {
    window.DebugHelper = DebugHelper;
}