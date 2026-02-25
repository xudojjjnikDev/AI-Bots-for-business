// script.js — исправленная версия

// ===== МОБИЛЬНОЕ МЕНЮ =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ===== ПЛАВНАЯ ПРОКРУТКА =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== АНИМАЦИЯ ПРИ СКРОЛЛЕ =====
const animatedElements = document.querySelectorAll(
    '.problem-card, .pricing-card, .case-card, .review-card, .step, .faq-item, .about-wrapper, .guarantee-block'
);

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('fade-hidden');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

animatedElements.forEach(el => {
    el.classList.add('fade-hidden');
    observer.observe(el);
});

// ===== FAQ =====
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        document.querySelectorAll('.faq-item.open').forEach(openItem => {
            openItem.classList.remove('open');
            openItem.querySelector('.faq-answer').classList.remove('open');
        });

        if (!isOpen) {
            item.classList.add('open');
            answer.classList.add('open');
        }
    });
});

// ===== ОБРАБОТКА ФОРМЫ =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Защита от ботов (honeypot)
        if (document.getElementById('website').value !== '') return;

        const submitBtn = contactForm.querySelector('button[type="submit"]');

        // ✅ ИСПРАВЛЕНО: блокируем кнопку СРАЗУ, до всех проверок
        submitBtn.textContent = 'Отправляю...';
        submitBtn.disabled = true;

        // ✅ ИСПРАВЛЕНО: валидация телефона ИЛИ Telegram-username
        const phoneValue = document.getElementById('phone').value.trim();
        const isTelegram = phoneValue.startsWith('@') && phoneValue.length >= 2;
        const phoneDigits = phoneValue.replace(/\D/g, '');
        const isPhone = phoneDigits.length >= 10 && phoneDigits.length <= 12;

        if (!isTelegram && !isPhone) {
            alert('Введите корректный номер телефона или Telegram (например, @username)');
            submitBtn.textContent = 'Отправить заявку';
            submitBtn.disabled = false;
            return;
        }

        const formData = {
            name: document.getElementById('name').value,
            phone: phoneValue,
            business: document.getElementById('business').value,
            message: document.getElementById('message').value,
            date: new Date().toLocaleString('ru-RU')
        };

        try {
            const response = await fetch('https://hook.eu1.make.com/vc7olb8of3bjcay79ulfjm933gowksla', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';

                setTimeout(() => {
                    contactForm.reset();
                    contactForm.style.display = 'block';
                    formSuccess.style.display = 'none';
                    submitBtn.textContent = 'Отправить заявку';
                    submitBtn.disabled = false;
                }, 5000);
            } else {
                throw new Error('Bad response: ' + response.status);
            }
        } catch (error) {
            console.error('Ошибка отправки:', error);
            submitBtn.textContent = 'Отправить заявку';
            submitBtn.disabled = false;
            alert('Что-то пошло не так. Напишите мне напрямую в Telegram: @xudojjjnik');
        }
    });
}

// ===== NAVBAR ПРИ СКРОЛЛЕ =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        navbar.style.background = 'rgba(255,255,255,0.97)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = '#fff';
        navbar.style.backdropFilter = 'none';
        navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
    }
}, { passive: true });
