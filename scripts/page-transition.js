// js/page-transition.js

document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-button, .main-menu-button');
    const mainContentWrapper = document.querySelector('.page-content-wrapper') || document.querySelector('.diary-content-wrapper') || document.querySelector('.projects-content-wrapper');

    // --- Функция для запуска анимации схлопывания и перехода ---
    function startPageTransition(targetPageUrl) {
        if (!mainContentWrapper) {
            window.location.href = targetPageUrl;
            return;
        }

        mainContentWrapper.classList.add('collapsing-out');

        mainContentWrapper.addEventListener('transitionend', function handleCollapseEnd() {
            mainContentWrapper.removeEventListener('transitionend', handleCollapseEnd);
            window.location.href = targetPageUrl;
        }, { once: true });
    }

    // --- Функция для запуска анимации расширения при загрузке страницы ---
    function animatePageIn() {
        if (!mainContentWrapper) {
            return;
        }

        mainContentWrapper.classList.add('expanding-in');

        setTimeout(() => {
            mainContentWrapper.classList.add('active');
        }, 50);

        mainContentWrapper.addEventListener('transitionend', function handleExpandEnd() {
            mainContentWrapper.removeEventListener('transitionend', handleExpandEnd);
            mainContentWrapper.classList.remove('expanding-in', 'active');
        }, { once: true });
    }

    // --- Добавляем слушатели для кнопок навигации ---
    navButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const targetPageUrl = button.dataset.page;
            if (targetPageUrl && window.location.pathname.split('/').pop() !== targetPageUrl) {
                event.preventDefault();
                startPageTransition(targetPageUrl);
            }
        });
    });

    // --- Запускаем анимацию расширения при загрузке страницы ---
    animatePageIn();
});