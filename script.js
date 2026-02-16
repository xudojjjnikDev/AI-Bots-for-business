// script.js

// Мобильное меню
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Закрыть меню при клике на ссылку
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Плавная прокрутка для навигации
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Анимация при скролле (fade-in)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Добавляем анимацию для секций
document.querySelectorAll('section, .problem-card, .pricing-card, .case-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Обработка формы
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Собираем данные формы
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            business: document.getElementById('business').value,
            message: document.getElementById('message').value,
            date: new Date().toLocaleString('ru-RU')
        };

        // Отправка данных на вебхук Make.com
        try {
            const response = await fetch('https://hook.eu1.make.com/vc7olb8of3bjcay79ulfjm933gowksla', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Успех - показываем сообщение
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';

                // Сброс формы через 3 секунды
                setTimeout(() => {
                    contactForm.reset();
                    contactForm.style.display = 'block';
                    formSuccess.style.display = 'none';
                }, 3000);
            } else {
                alert('Ошибка отправки. Попробуй еще раз.');
                console.error('Ошибка ответа:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Ошибка отправки:', error);
            alert('Что-то пошло не так. Проверь подключение к интернету.');
        }
    });
}

// Функция сохранения заявки (для демонстрации, больше не используется формой)
// Но оставим на случай, если понадобится позже
function saveLead(leadData) {
    let leads = JSON.parse(localStorage.getItem('leads') || '[]');
    leads.push(leadData);
    localStorage.setItem('leads', JSON.stringify(leads));
}

// Динамическое добавление кейсов (когда появятся)
function addCase(caseData) {
    const casesContainer = document.getElementById('casesContainer');
    const placeholder = document.querySelector('.case-card.placeholder');
    
    if (placeholder && casesContainer) {
        // Убираем плейсхолдер, когда появится первый кейс
        casesContainer.innerHTML = '';
    }
    
    const caseHTML = `
        <div class="case-card">
            <div class="case-icon">
                <i class="fas ${caseData.icon || 'fa-briefcase'}"></i>
            </div>
            <h3>${caseData.title}</h3>
            <p class="case-client"><strong>Клиент:</strong> ${caseData.client}</p>
            <p class="case-result"><strong>Результат:</strong> ${caseData.result}</p>
            <p class="case-description">${caseData.description}</p>
            ${caseData.link ? `<a href="${caseData.link}" class="btn btn-outline small">Подробнее</a>` : ''}
        </div>
    `;
    
    if (casesContainer) {
        casesContainer.insertAdjacentHTML('beforeend', caseHTML);
    }
}

// Пример добавления кейса (раскомментирован)
addCase({
    icon: 'fa-gavel',
    title: 'Бот для юриста',
    client: 'Юридическая консультация',
    result: '+40% заявок, освобождено 20 часов в неделю',
    description: 'Автоматизировали ответы на типовые вопросы и запись на консультации.',
    link: '#'
});

// Счётчик посетителей (простой)
function updateVisitorCounter() {
    let visits = localStorage.getItem('visits') || 0;
    visits = parseInt(visits) + 1;
    localStorage.setItem('visits', visits);
    console.log(`Это ${visits}-й визит на сайт`);
}

updateVisitorCounter();

// Изменение навигации при скролле
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255,255,255,0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'var(--white)';
        navbar.style.backdropFilter = 'none';
    }
});
