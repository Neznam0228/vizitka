/* =====================================================
   1. HEADER — меняется при скролле
   ===================================================== */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
    } else {
        header.classList.remove('is-scrolled');
    }
}, { passive: true });

/* =====================================================
   2. REVEAL — плавное появление секций при скролле
   ===================================================== */
const revealTargets = [
    ...document.querySelectorAll('.section__head'),
    ...document.querySelectorAll('.advantage'),
    ...document.querySelectorAll('.skill-group'),
    ...document.querySelectorAll('.project'),
    ...document.querySelectorAll('.contact__info'),
    ...document.querySelectorAll('.contact__form'),
];

revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(i * 40, 240)}ms`;
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* =====================================================
   3. SMOOTH SCROLL — плавный скролл по якорям
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#' || href === '') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

/* =====================================================
   4. 3D МОДЕЛЬ — пёс в hero
   ===================================================== */
const dogViewer = document.getElementById('petViewer');

if (dogViewer) {
    dogViewer.addEventListener('load', () => {
        console.log('✓ 3D пёс загружен');

        if (dogViewer.availableAnimations && dogViewer.availableAnimations.length > 0) {
            dogViewer.animationName = dogViewer.availableAnimations[0];
            dogViewer.play();
        }
    });

    dogViewer.addEventListener('error', (e) => {
        console.error('✗ Ошибка загрузки модели:', e);
    });
}

/* =====================================================
   5. ФОРМА — UI-фидбек при отправке
   ===================================================== */
const form = document.getElementById('contactForm');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const original = btn.innerHTML;

        btn.innerHTML = '✓ Отправлено';
        btn.style.background = '#16a34a';
        btn.style.pointerEvents = 'none';

        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
            btn.style.pointerEvents = '';
            form.reset();
        }, 2500);
    });
}

/* =====================================================
   6. ИНТЕРАКТИВНЫЕ ДЕМО В КАРТОЧКАХ ПРОЕКТОВ
   ===================================================== */

/* -----------------------------------------------------
   Демо 1: МАРКЕТПЛЕЙС
   ----------------------------------------------------- */
document.querySelectorAll('.demo-shop__item').forEach((item) => {
    item.addEventListener('click', () => {
        if (item.classList.contains('is-added')) return;

        item.classList.add('is-added');

        const price = parseInt(item.dataset.price, 10);
        const cart = item.closest('.demo-shop');
        const countEl = cart.querySelector('[data-cart-count]');
        const totalEl = cart.querySelector('[data-cart-total]');

        const newCount = parseInt(countEl.textContent, 10) + 1;
        countEl.textContent = newCount;

        const currentTotal = parseInt(
            totalEl.textContent.replace(/\D/g, ''),
            10
        ) || 0;
        const newTotal = currentTotal + price;
        totalEl.textContent = newTotal.toLocaleString('ru-RU') + ' ₽';

        setTimeout(() => item.classList.remove('is-added'), 1800);
    });
});

/* -----------------------------------------------------
   Демо 2: ДАШБОРД
   ----------------------------------------------------- */
const DASH_DATA = {
    '7d':   { revenue: '96/100', orders: '10', conv: '3', points: '0,70 30,55 60,60 90,40 120,45 150,30 180,35 210,20 240,25 270,15 300,20' },
    '30d':  { revenue: '98/100', orders: '12', conv: '4', points: '0,80 30,65 60,70 90,50 120,55 150,40 180,45 210,30 240,35 270,25 300,30' },
    'year': { revenue: '100/100',orders: '15', conv: '5', points: '0,90 30,85 60,75 90,65 120,70 150,55 180,45 210,40 240,30 270,20 300,10' },
};

document.querySelectorAll('.demo-dash__tab').forEach((tab) => {
    tab.addEventListener('click', () => {
        const wrapper = tab.closest('.demo-dash');
        const period = tab.dataset.period;
        const data = DASH_DATA[period];
        if (!data) return;

        wrapper.querySelectorAll('.demo-dash__tab').forEach((t) => {
            t.classList.toggle('is-active', t === tab);
        });

        const metrics = {
            revenue: data.revenue,
            orders: data.orders,
            conv: data.conv,
        };
        Object.entries(metrics).forEach(([key, value]) => {
            const el = wrapper.querySelector(`[data-metric="${key}"]`);
            if (!el) return;
            el.textContent = value;
            el.classList.add('is-updated');
            setTimeout(() => el.classList.remove('is-updated'), 800);
        });

        const chart = wrapper.querySelector('[data-chart] polyline');
        if (chart) chart.setAttribute('points', data.points);
    });
});

/* -----------------------------------------------------
   Демо 3: ЧАТ
   ----------------------------------------------------- */
const BOT_RESPONSES = [
    'Понял тебя! 👍',
    'Интересная мысль 🤔',
    'Давай обсудим это подробнее',
    'Кстати, я умею отправлять файлы 📎',
    'Ха-ха, отличная шутка 😄',
    'Могу помочь с задачей?',
    'Уже записал в заметки 📝',
    'Согласен на все 100%',
    'Расскажи ещё что-нибудь',
    'Звучит здорово! ✨',
];

document.querySelectorAll('[data-chat-form]').forEach((form) => {
    const input = form.querySelector('[data-chat-input]');
    const messages = form.closest('.demo-chat').querySelector('[data-chat-messages]');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        addChatMessage(messages, text, 'user');
        input.value = '';

        const typingEl = addTypingIndicator(messages);

        setTimeout(() => {
            typingEl.remove();
            const reply = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
            addChatMessage(messages, reply, 'bot');
        }, 700 + Math.random() * 500);
    });
});

function addChatMessage(container, text, type) {
    const msg = document.createElement('div');
    msg.className = `demo-chat__msg demo-chat__msg--${type}`;

    const avatar = document.createElement('span');
    avatar.className = 'demo-chat__avatar';
    avatar.textContent = type === 'user' ? '🙂' : '🤖';

    const bubble = document.createElement('div');
    bubble.className = 'demo-chat__bubble';
    bubble.textContent = text;

    msg.appendChild(avatar);
    msg.appendChild(bubble);
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

function addTypingIndicator(container) {
    const msg = document.createElement('div');
    msg.className = 'demo-chat__msg demo-chat__msg--bot';
    msg.innerHTML = `
        <span class="demo-chat__avatar">🤖</span>
        <div class="demo-chat__bubble">печатает…</div>
    `;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
    return msg;
}

/* -----------------------------------------------------
   Демо 4: КУРСЫ
   ----------------------------------------------------- */
document.querySelectorAll('[data-course-btn]').forEach((btn) => {
    const course = btn.closest('.demo-course');
    const bar = course.querySelector('[data-course-bar]');
    const text = course.querySelector('[data-course-text]');
    const lessons = course.querySelectorAll('.demo-course__lesson');

    let current = 0;

    btn.addEventListener('click', () => {
        if (current >= lessons.length) {
            btn.textContent = 'Готово ✓';
            btn.disabled = true;
            return;
        }

        lessons[current].classList.remove('is-active');
        lessons[current].classList.add('is-done');
        current++;

        if (current < lessons.length) {
            lessons[current].classList.add('is-active');
        }

        const percent = Math.round((current / lessons.length) * 100);
        bar.style.width = percent + '%';
        text.textContent = percent + '%';

        if (current >= lessons.length) {
            btn.textContent = 'Готово ✓';
            btn.disabled = true;
            text.style.color = '#16a34a';
        } else {
            btn.textContent = `Следующий этап ${current + 1} →`;
        }
    });
});