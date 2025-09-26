/**
 * 自动生成图片列表 - 基于规范命名 0-99.JPG
 * 只扫描JPG格式，最多支持100张图片（0-99）
 * 兼容大小写：JPG 和 jpg
 */

// 生成规范命名的图片列表 - 只扫描JPG格式，最多100张
function generateImagesList() {
    const imagesList = [];
    const supportedFormats = ['JPG', 'jpg']; // 只支持JPG格式（大小写兼容）

    // 生成 0-99 范围的图片路径（共100张）
    for (let i = 0; i <= 99; i++) {
        // 为每个数字尝试大写和小写的JPG格式
        supportedFormats.forEach(format => {
            imagesList.push(`assets/images/${i}.${format}`);
        });
    }

    console.log(`📋 生成图片扫描列表: 0-99 共100张，支持格式: JPG/jpg`);
    return imagesList;
}

const IMAGES_LIST = generateImagesList();

// 生成音乐文件列表 - 自动扫描常见音乐文件
function generateMusicList() {
    const musicList = [];
    const supportedFormats = ['mp3', 'wav', 'ogg', 'm4a'];

    // 常见的音乐文件命名模式 - 优先检测现有文件
    const commonNames = [
        'music',      // 当前存在的文件
        'music1', 'music2', 'music3', 'music4', 'music5',
        'song', 'song1', 'song2', 'song3', 'song4', 'song5',
        'background', 'bgm', 'love', 'romantic',
        '1', '2', '3', '4', '5'  // 数字命名
    ];

    // 为每个名称和格式组合生成路径
    commonNames.forEach(name => {
        supportedFormats.forEach(format => {
            musicList.push(`assets/music/${name}.${format}`);
        });
    });

    return musicList;
}

const MUSIC_LIST = generateMusicList();

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IMAGES_LIST, MUSIC_LIST };
} else {
    window.IMAGES_LIST = IMAGES_LIST;
    window.MUSIC_LIST = MUSIC_LIST;
}