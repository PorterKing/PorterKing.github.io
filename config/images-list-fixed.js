/**
 * 自动生成图片列表 - 基于规范命名 0-99.JPG
 * 只扫描大写JPG格式，最多支持100张图片（0-99）
 */

// 生成规范命名的图片列表 - 只扫描大写JPG格式，最多100张
function generateImagesList() {
    const imagesList = [];

    // 生成 0-99 范围的图片路径（共100张），只使用大写JPG格式
    for (let i = 0; i <= 99; i++) {
        imagesList.push(`assets/images/${i}.JPG`);
    }

    console.log(`📋 生成图片扫描列表: 0-99 共100张，只支持格式: JPG`);
    return imagesList;
}

const IMAGES_LIST = generateImagesList();

// 生成音乐文件列表 - 只检测指定的music.mp3文件
function generateMusicList() {
    // 只检测 music.mp3 文件
    return ['assets/music/music.mp3'];
}

const MUSIC_LIST = generateMusicList();

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IMAGES_LIST, MUSIC_LIST };
} else {
    window.IMAGES_LIST = IMAGES_LIST;
    window.MUSIC_LIST = MUSIC_LIST;
}