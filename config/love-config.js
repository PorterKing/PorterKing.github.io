// 波&雪的专属配置文件

// 爱情起始时间配置
const LOVE_CONFIG = {
    // 确认关系的时刻 - 2024年3月18日
    startDate: '2024-03-18T00:00:00',

    // 纪念日配置
    memorialDay: {
        year: 2024,
        month: 3,
        day: 18,
        description: '我们确认关系的美好时刻'
    },

    // 显示配置
    display: {
        // 时间计数器更新间隔（毫秒）
        timerInterval: 1000,
        // 图片轮播间隔（毫秒）
        imageInterval: 5000,
        // 爱心动画配置
        heartAnimation: {
            enabled: true,
            interval: 3000,
            maxHearts: 20
        }
    },

    // 图片配置
    images: {
        // 图片文件夹路径
        folderPath: 'assets/images/',
        // 支持的图片格式
        supportedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        // 默认图片列表（如果文件夹为空时使用）
        defaultImages: [
            // 可以在这里添加默认图片路径
        ]
    },

    // 音乐配置
    music: {
        // 音乐文件夹路径
        folderPath: 'assets/music/',
        // 支持的音频格式
        supportedFormats: ['mp3', 'wav', 'ogg', 'm4a'],
        // 默认音量（0-1）
        defaultVolume: 0.8,
        // 是否自动播放
        autoPlay: true,
        // 默认音乐列表
        defaultPlaylist: [
            // 可以在这里添加默认音乐路径
        ]
    },

    // 个性化设置
    personalization: {
        // 主题颜色
        primaryColor: '#ff6b9d',
        secondaryColor: '#a8e6cf',
        // 标题文字
        title: '波&雪的专属回忆',
        subtitle: '只属于我们的美好时光',
        // 底部消息
        footerMessage: '💕 愿我们的爱情如星辰般永恒 💕'
    }
};

// 导出配置（兼容不同的模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LOVE_CONFIG;
} else {
    window.LOVE_CONFIG = LOVE_CONFIG;
}