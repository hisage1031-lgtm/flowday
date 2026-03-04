// ========================================
// FlowDay - App Logic
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initDateDisplay();
    initGreeting();
    initCalendar();
    initFocusMode();
    initSmartInput();
    initModals();
    initTheme();
    initNotifications();
    initTaskChecks();
});

// ========== Navigation ==========
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navigateTo(page);
        });
    });
}

function navigateTo(page) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (activeNav) activeNav.classList.add('active');

    // Update pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const activePage = document.getElementById(`page-${page}`);
    if (activePage) activePage.classList.add('active');

    // Update title
    const titles = {
        dashboard: '今日概览',
        schedule: '智能日程',
        health: '健康习惯',
        goals: '目标引擎',
        focus: '专注模式'
    };
    document.getElementById('pageTitle').textContent = titles[page] || '';

    // Close sidebar on mobile
    document.getElementById('sidebar').classList.remove('open');
}

// ========== Date Display ==========
function initDateDisplay() {
    const now = new Date();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const display = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${weekdays[now.getDay()]}`;
    document.getElementById('dateDisplay').textContent = display;
}

// ========== Greeting ==========
function initGreeting() {
    const hour = new Date().getHours();
    let greeting;
    if (hour < 6) greeting = '夜深了，注意休息';
    else if (hour < 12) greeting = '早上好，开启高效的一天';
    else if (hour < 14) greeting = '中午好，记得休息一下';
    else if (hour < 18) greeting = '下午好，保持专注';
    else greeting = '晚上好，回顾今天的收获';
    document.getElementById('greeting').textContent = `👋 ${greeting}！`;
}

// ========== Calendar ==========
function initCalendar() {
    const container = document.getElementById('calendarWeek');
    if (!container) return;

    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + 1);

    const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

    const events = [
        [{ text: '晨会', type: 'work' }, { text: '网球', type: 'health' }],
        [{ text: '产品评审', type: 'work' }],
        [{ text: '深度工作', type: 'work' }, { text: '健身', type: 'health' }],
        [{ text: '团队1:1', type: 'work' }, { text: '网球', type: 'health' }],
        [{ text: '周报', type: 'work' }],
        [{ text: '网球比赛', type: 'health' }, { text: '阅读', type: 'personal' }],
        [{ text: '休息', type: 'personal' }]
    ];

    for (let i = 0; i < 7; i++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        const isToday = day.toDateString() === now.toDateString();

        const dayEl = document.createElement('div');
        dayEl.className = `calendar-day${isToday ? ' today' : ''}`;

        const dayEvents = (events[i] || []).map(e =>
            `<div class="calendar-event event-${e.type}">${e.text}</div>`
        ).join('');

        dayEl.innerHTML = `
            <div class="calendar-day-header">${weekdays[i]}</div>
            <div class="calendar-day-num">${day.getDate()}</div>
            ${dayEvents}
        `;
        container.appendChild(dayEl);
    }
}

// ========== Focus Mode ==========
function initFocusMode() {
    let timer = null;
    let totalSeconds = 25 * 60;
    let remainingSeconds = totalSeconds;
    let isRunning = false;

    const timerEl = document.getElementById('focusTimer');
    const statusEl = document.getElementById('focusStatus');
    const startBtn = document.getElementById('focusStartBtn');
    const resetBtn = document.getElementById('focusResetBtn');
    const taskDisplay = document.getElementById('focusTaskDisplay');

    function updateDisplay() {
        const mins = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // Start / Pause
    startBtn.addEventListener('click', () => {
        if (isRunning) {
            // Pause
            clearInterval(timer);
            isRunning = false;
            startBtn.textContent = '▶ 继续';
            startBtn.classList.remove('btn-pause');
            statusEl.textContent = '已暂停';
        } else {
            // Start
            isRunning = true;
            startBtn.textContent = '⏸ 暂停';
            startBtn.classList.add('btn-pause');
            statusEl.textContent = '专注中...';
            timer = setInterval(() => {
                if (remainingSeconds <= 0) {
                    clearInterval(timer);
                    isRunning = false;
                    statusEl.textContent = '🎉 完成！';
                    startBtn.textContent = '▶ 开始';
                    startBtn.classList.remove('btn-pause');
                    return;
                }
                remainingSeconds--;
                updateDisplay();
            }, 1000);
        }
    });

    // Reset
    resetBtn.addEventListener('click', () => {
        clearInterval(timer);
        isRunning = false;
        remainingSeconds = totalSeconds;
        updateDisplay();
        startBtn.textContent = '▶ 开始';
        startBtn.classList.remove('btn-pause');
        statusEl.textContent = '准备专注';
    });

    // Presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            totalSeconds = parseInt(btn.dataset.minutes) * 60;
            remainingSeconds = totalSeconds;
            clearInterval(timer);
            isRunning = false;
            updateDisplay();
            startBtn.textContent = '▶ 开始';
            startBtn.classList.remove('btn-pause');
            statusEl.textContent = '准备专注';
        });
    });

    // Task selection
    document.querySelectorAll('.focus-task-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.focus-task-item').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            taskDisplay.textContent = `当前任务：${item.dataset.task}`;
        });
    });
}

// ========== Smart Input (F1) ==========
function initSmartInput() {
    const input = document.getElementById('scheduleInput');
    const parseBtn = document.getElementById('parseInputBtn');
    const suggestion = document.getElementById('aiSuggestion');
    const content = document.getElementById('suggestionContent');
    const confirmBtn = document.getElementById('confirmSchedule');
    const cancelBtn = document.getElementById('cancelSchedule');

    if (!parseBtn) return;

    parseBtn.addEventListener('click', () => {
        const text = input.value.trim();
        if (!text) return;

        // Simulate AI parsing
        parseBtn.textContent = '解析中...';
        parseBtn.disabled = true;

        setTimeout(() => {
            const result = simulateAIParse(text);
            content.innerHTML = result;
            suggestion.classList.remove('hidden');
            parseBtn.textContent = 'AI 解析';
            parseBtn.disabled = false;
        }, 800);
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') parseBtn.click();
    });

    confirmBtn.addEventListener('click', () => {
        suggestion.classList.add('hidden');
        input.value = '';
        showToast('日程已添加');
    });

    cancelBtn.addEventListener('click', () => {
        suggestion.classList.add('hidden');
    });
}

function simulateAIParse(text) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = `${tomorrow.getMonth() + 1}月${tomorrow.getDate()}日`;

    // Simple keyword matching for demo
    let time = '15:00';
    let duration = '1小时';
    let category = '工作';
    let title = text;

    if (text.includes('下午')) time = '14:00';
    if (text.includes('3点') || text.includes('三点')) time = '15:00';
    if (text.includes('上午')) time = '10:00';
    if (text.includes('网球') || text.includes('运动')) category = '健康';
    if (text.includes('读书') || text.includes('阅读')) category = '个人';

    return `
        <div style="display:flex;flex-direction:column;gap:8px;font-size:14px;">
            <div>📋 <strong>标题</strong>：${title}</div>
            <div>📅 <strong>日期</strong>：${dateStr}</div>
            <div>🕐 <strong>时间</strong>：${time}（预计 ${duration}）</div>
            <div>🏷️ <strong>类别</strong>：${category}</div>
            <div style="color:var(--text-tertiary);font-size:12px;margin-top:4px;">
                💡 AI 已自动检测时间冲突，该时段可用
            </div>
        </div>
    `;
}

// ========== Modals ==========
function initModals() {
    const addScheduleBtn = document.getElementById('addScheduleBtn');
    const addGoalBtn = document.getElementById('addGoalBtn');
    const addHealthBtn = document.getElementById('addHealthBtn');
    const aiDecomposeBtn = document.getElementById('aiDecomposeBtn');

    if (addScheduleBtn) {
        addScheduleBtn.addEventListener('click', () => openModal('scheduleModal'));
    }
    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', () => openModal('goalModal'));
    }
    if (addHealthBtn) {
        addHealthBtn.addEventListener('click', () => openModal('healthModal'));
    }

    // AI Decompose button
    if (aiDecomposeBtn) {
        aiDecomposeBtn.addEventListener('click', () => {
            const title = document.getElementById('newGoalTitle').value || '新目标';
            const desc = document.getElementById('newGoalDesc').value || '';
            const decomposeEl = document.getElementById('aiDecompose');
            const resultEl = document.getElementById('decomposeResult');

            aiDecomposeBtn.textContent = '🤖 分解中...';
            aiDecomposeBtn.disabled = true;

            setTimeout(() => {
                resultEl.innerHTML = `
                    <div style="font-size:14px;line-height:1.8;margin-top:8px;">
                        <div><strong>目标</strong>：${title}</div>
                        <div style="margin-top:8px;"><strong>建议里程碑：</strong></div>
                        <div style="padding-left:12px;">
                            <div>1️⃣ 调研与规划阶段（第1-2周）</div>
                            <div>2️⃣ 核心执行阶段（第3-8周）</div>
                            <div>3️⃣ 优化与巩固（第9-10周）</div>
                            <div>4️⃣ 验证与总结（第11-12周）</div>
                        </div>
                        <div style="color:var(--text-tertiary);font-size:12px;margin-top:8px;">
                            💡 每个里程碑将自动生成具体的周任务
                        </div>
                    </div>
                `;
                decomposeEl.classList.remove('hidden');
                aiDecomposeBtn.textContent = '🤖 重新分解';
                aiDecomposeBtn.disabled = false;
            }, 1000);
        });
    }

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.add('hidden');
            }
        });
    });
}

function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

// ========== Theme Toggle ==========
function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const saved = localStorage.getItem('flowday-theme');
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    toggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('flowday-theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('flowday-theme', 'dark');
        }
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    menuToggle.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });
}

// ========== Notifications ==========
function initNotifications() {
    const btn = document.getElementById('notifBtn');
    const panel = document.getElementById('notifPanel');
    const clearBtn = document.getElementById('clearNotifs');

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && e.target !== btn) {
            panel.classList.add('hidden');
        }
    });

    clearBtn.addEventListener('click', () => {
        document.querySelectorAll('.notif-item.unread').forEach(item => {
            item.classList.remove('unread');
        });
    });
}

// ========== Task Checkbox Animation ==========
function initTaskChecks() {
    document.querySelectorAll('.task-check input').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const taskItem = this.closest('.task-item');
            if (this.checked) {
                taskItem.style.opacity = '0.6';
                setTimeout(() => { taskItem.style.opacity = ''; }, 1500);
            }
        });
    });
}

// ========== Toast Notification ==========
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--text-primary);
        color: var(--bg-primary);
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 300;
        animation: fadeIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    toast.textContent = `✓ ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}
