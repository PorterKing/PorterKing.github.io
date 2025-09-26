/**
 * 爱情时间计数器模块
 * 实时显示波&雪在一起的时间
 * 从2024年3月18日开始计算
 */

class LoveTimer {
    constructor() {
        this.startDate = new Date(LOVE_CONFIG.startDate);
        this.timerInterval = null;
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };

        this.init();
    }

    init() {
        // 立即更新一次显示
        this.updateTimer();

        // 设置定时器，每秒更新
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, LOVE_CONFIG.display.timerInterval);

        // 添加特殊日期检查
        this.checkSpecialDates();
    }

    updateTimer() {
        const now = new Date();
        const timeDifference = now - this.startDate;

        // 计算时间差
        const timeUnits = this.calculateTimeUnits(timeDifference);

        // 更新显示
        this.updateDisplay(timeUnits);

        // 添加动画效果
        this.addCounterAnimation();
    }

    calculateTimeUnits(timeDifference) {
        const millisecondsInSecond = 1000;
        const millisecondsInMinute = millisecondsInSecond * 60;
        const millisecondsInHour = millisecondsInMinute * 60;
        const millisecondsInDay = millisecondsInHour * 24;

        return {
            days: Math.floor(timeDifference / millisecondsInDay),
            hours: Math.floor((timeDifference % millisecondsInDay) / millisecondsInHour),
            minutes: Math.floor((timeDifference % millisecondsInHour) / millisecondsInMinute),
            seconds: Math.floor((timeDifference % millisecondsInMinute) / millisecondsInSecond)
        };
    }

    updateDisplay(timeUnits) {
        // 使用动画效果更新数字
        this.animateNumberChange(this.elements.days, timeUnits.days);
        this.animateNumberChange(this.elements.hours, timeUnits.hours);
        this.animateNumberChange(this.elements.minutes, timeUnits.minutes);
        this.animateNumberChange(this.elements.seconds, timeUnits.seconds);
    }

    animateNumberChange(element, newValue) {
        if (!element) return;

        const currentValue = parseInt(element.textContent) || 0;

        if (currentValue !== newValue) {
            element.style.transform = 'scale(1.1)';
            element.style.color = LOVE_CONFIG.personalization.primaryColor;

            setTimeout(() => {
                element.textContent = this.formatNumber(newValue);
                element.style.transform = 'scale(1)';
                element.style.color = '';
            }, 150);
        } else {
            element.textContent = this.formatNumber(newValue);
        }
    }

    formatNumber(number) {
        // 确保数字至少显示两位
        return number.toString().padStart(2, '0');
    }

    addCounterAnimation() {
        // 每秒为计数器添加微妙的脉动效果
        const timerContainer = document.querySelector('.timer-container');
        if (timerContainer) {
            timerContainer.classList.add('pulse-animation');
            setTimeout(() => {
                timerContainer.classList.remove('pulse-animation');
            }, 300);
        }
    }

    checkSpecialDates() {
        const now = new Date();
        const timeDiff = now - this.startDate;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        // 检查是否是特殊的纪念日
        const specialDays = [100, 200, 365, 500, 730, 1000]; // 100天、200天、1年、500天、2年、1000天等

        if (specialDays.includes(daysDiff)) {
            this.showSpecialMessage(daysDiff);
        }
    }

    showSpecialMessage(days) {
        const messages = {
            100: '🎉 今天是我们在一起的第100天！',
            200: '🎉 今天是我们在一起的第200天！',
            365: '🎉 今天是我们在一起的第一个周年纪念日！',
            500: '🎉 今天是我们在一起的第500天！',
            730: '🎉 今天是我们在一起的第二个周年纪念日！',
            1000: '🎉 今天是我们在一起的第1000天！'
        };

        const message = messages[days] || `🎉 今天是我们在一起的第${days}天！`;

        // 创建特殊消息弹窗
        this.createSpecialMessageModal(message);
    }

    createSpecialMessageModal(message) {
        const modal = document.createElement('div');
        modal.className = 'special-message-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>特殊的日子</h2>
                <p>${message}</p>
                <p>💕 感谢有你陪伴的每一天 💕</p>
                <button onclick="this.parentElement.parentElement.remove()">好的</button>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        document.body.appendChild(modal);
    }

    // 获取总共的时间统计
    getTotalStats() {
        const now = new Date();
        const timeDiff = now - this.startDate;

        return {
            totalDays: Math.floor(timeDiff / (1000 * 60 * 60 * 24)),
            totalHours: Math.floor(timeDiff / (1000 * 60 * 60)),
            totalMinutes: Math.floor(timeDiff / (1000 * 60)),
            totalSeconds: Math.floor(timeDiff / 1000)
        };
    }

    // 销毁定时器
    destroy() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoveTimer;
} else {
    window.LoveTimer = LoveTimer;
}