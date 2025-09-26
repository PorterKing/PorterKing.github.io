/**
 * 自动生成图片列表 - 基于规范命名 0-23.JPG
 * 支持动态扫描 images 文件夹下的所有图片
 */

// 生成规范命名的图片列表 - 支持多种格式
function generateImagesList() {
    const imagesList = [];
    const supportedFormats = ['JPG', 'jpg', 'PNG', 'png', 'JPEG', 'jpeg'];

    // 生成 0-99 范围的图片路径，支持多种格式
    for (let i = 0; i <= 99; i++) {
        // 为每个数字尝试所有支持的格式
        supportedFormats.forEach(format => {
            imagesList.push(`assets/images/${i}.${format}`);
        });
    }

    return imagesList;
}

const IMAGES_LIST = generateImagesList();

const MUSIC_LIST = [
    'assets/music/music1.mp3',
    'assets/music/music2.mp3'
];

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IMAGES_LIST, MUSIC_LIST };
} else {
    window.IMAGES_LIST = IMAGES_LIST;
    window.MUSIC_LIST = MUSIC_LIST;
}