// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {

    // 页面导航功能
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('.section');

    // 处理导航点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);

            // 更新活动导航链接
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 显示指定的内容区域
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    // 演示按钮功能
    const demoButton = document.getElementById('demo-button');
    if (demoButton) {
        demoButton.addEventListener('click', function() {
            const messages = [
                '欢迎使用博学 Web 项目！',
                'JavaScript 功能正常运行！',
                '点击导航尝试不同的页面',
                '这是一个响应式设计的示例'
            ];

            const randomMessage = messages[Math.floor(Math.random() * messages.length)];

            // 创建提示弹窗
            showNotification(randomMessage);

            // 按钮动画效果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }

    // 通知弹窗功能
    function showNotification(message) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;

        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
            word-wrap: break-word;
        `;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // 添加到页面
        document.body.appendChild(notification);

        // 3秒后自动消失
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);

        // 点击关闭
        notification.addEventListener('click', function() {
            this.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (this.parentNode) {
                    this.parentNode.removeChild(this);
                }
            }, 300);
        });
    }

    // 页面加载完成提示
    setTimeout(() => {
        showNotification('页面加载完成！点击按钮体验功能。');
    }, 500);

    // 键盘快捷键支持
    document.addEventListener('keydown', function(e) {
        // Alt + 数字键快速导航
        if (e.altKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    showSection('home');
                    break;
                case '2':
                    e.preventDefault();
                    showSection('about');
                    break;
                case '3':
                    e.preventDefault();
                    showSection('contact');
                    break;
            }
        }
    });

    // 简单的性能监控
    console.log('页面加载时间:', performance.now().toFixed(2) + 'ms');
    console.log('欢迎使用博学 Web 项目！');
    console.log('提示: 使用 Alt+1/2/3 进行快速导航');
});