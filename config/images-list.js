/**
 * 图片列表配置文件
 * 由于浏览器安全限制，无法自动扫描文件夹
 * 请在这里手动添加你的图片文件名
 */

const IMAGES_LIST = [
    // 优先显示JPG和PNG格式的图片（浏览器兼容性更好）
    'assets/images/1 第一次牵手.JPG',
    'assets/images/3 第一次拍合照.PNG',
    'assets/images/3.1 第一次拍合照.JPG',
    'assets/images/4 第一次露营.jpg',
    'assets/images/6 一起玩娱乐.JPG',
    'assets/images/7.2 澳门之旅.JPG',
    'assets/images/8 订婚.JPG',
    'assets/images/9 无名.JPG',
    'assets/images/10 长沙之旅.JPG',
    'assets/images/10.1 长沙之旅.JPG',
    'assets/images/12 日本之旅.JPG',
    'assets/images/12.1 日本之旅.JPG',
    'assets/images/12.2 日本之旅.jpg',
    'assets/images/12.3 日本之旅.JPG',
    'assets/images/12.4 日本之旅.jpg',
    'assets/images/13 花房拍照.JPG',
    'assets/images/13.1 花房拍照.JPG',
    'assets/images/1a4d481316923ff7ee9d3bb2de4beee0.JPG',
    'assets/images/封面_求婚.JPG',
    // HEIC格式（部分浏览器可能不支持，放在后面）
    'assets/images/2 第一次踏春.HEIC',
    'assets/images/5 第一次做首饰过七夕.HEIC',
    'assets/images/7 澳门之旅.HEIC',
    'assets/images/7.1 澳门之旅.HEIC',
    'assets/images/11 第一次看日出.HEIC'
];

const MUSIC_LIST = [
    'assets/music/music.mp3'
];

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IMAGES_LIST, MUSIC_LIST };
} else {
    window.IMAGES_LIST = IMAGES_LIST;
    window.MUSIC_LIST = MUSIC_LIST;
}