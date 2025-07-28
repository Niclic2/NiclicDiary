// js/slideshow.js

document.addEventListener('DOMContentLoaded', () => {
    const slidesContainer = document.querySelector('.slides-container');
    const slides = document.querySelectorAll('.slide');
    const slideIndicators = document.querySelector('.slide-indicators');
    const numSlides = slides.length;

    let currentSlideIndex = 0;
    let isAnimating = false; // Флаг для предотвращения множественных анимаций

    // --- Инициализация ---
    function init() {
        createIndicators();
        // Устанавливаем начальное состояние для всех слайдов
        slides.forEach((slide, i) => {
            if (i === 0) {
                slide.classList.add('active'); // Первый слайд активен и виден
            } else {
                slide.classList.remove('active'); 
            }
        });
        // Устанавливаем начальную позицию контейнера
        slidesContainer.style.transform = `translateY(0px)`;
        updateIndicators();
    }

    // --- Переход к конкретному слайду ---
    function goToSlide(index, animate = true) {
        if (isAnimating || index < 0 || index >= numSlides) {
            return;
        }

        isAnimating = true;

        const prevSlideIndex = currentSlideIndex;
        currentSlideIndex = index;

        const prevSlide = slides[prevSlideIndex];
        const nextSlide = slides[currentSlideIndex];

        // Определяем направление прокрутки
        const direction = index > prevSlideIndex ? 'down' : 'up';

        // Анимация уходящего слайда (prevSlide)
        if (animate && prevSlide && prevSlide !== nextSlide) {
            prevSlide.classList.remove('active'); // Убираем активный класс
        }

        // Подготовка приходящего слайда (nextSlide)
        if (animate && prevSlide !== nextSlide) {
            if (direction === 'down') {
                nextSlide.classList.add('from-bottom'); // Приходит снизу
            } else {
                nextSlide.classList.add('from-top'); // Приходит сверху
            }
        }

        // Обновляем позицию контейнера (это запускает его CSS transition)
        const targetTranslateY = -currentSlideIndex * window.innerHeight;
        slidesContainer.style.transform = `translateY(${targetTranslateY}px)`;

        // Запускаем анимацию появления приходящего слайда с небольшой задержкой
        setTimeout(() => {
            if (animate && prevSlide !== nextSlide) {
                // Убираем классы from-top/from-bottom, чтобы слайд "прилетел"
                nextSlide.classList.remove('from-top', 'from-bottom');
            }
            nextSlide.classList.add('active'); // Активируем слайд, чтобы он появился
        }, 50); // Небольшая задержка, чтобы transition на slidesContainer успел начаться

        // Обновляем индикаторы
        updateIndicators();

        // Ждем завершения анимации перемещения контейнера
        slidesContainer.addEventListener('transitionend', function handler() {
            isAnimating = false;
            slidesContainer.removeEventListener('transitionend', handler);
        }, { once: true });
    }

    // --- Генерация и обновление индикаторов ---
    function createIndicators() {
        slideIndicators.innerHTML = '';
        for (let i = 0; i < numSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('indicator-dot');
            dot.dataset.index = i;
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
            slideIndicators.appendChild(dot);
        }
        updateIndicators();
    }

    function updateIndicators() {
        const dots = document.querySelectorAll('.indicator-dot');
        dots.forEach((dot, i) => {
            if (i === currentSlideIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // --- Обработчик события прокрутки колесика мыши ---
    const slidesWrapper = document.querySelector('.slides-wrapper');
    slidesWrapper.addEventListener('wheel', (event) => {
        event.preventDefault();

        if (isAnimating) {
            return;
        }

        const delta = event.deltaY;

        if (delta > 0) { // Прокрутка вниз
            goToSlide(currentSlideIndex + 1);
        } else if (delta < 0) { // Прокрутка вверх
            goToSlide(currentSlideIndex - 1);
        }
    }, { passive: false });

    // --- Запуск ---
    init();
});