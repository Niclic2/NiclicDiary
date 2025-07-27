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
                // Он будет opacity:1 и scale(1) по правилу .slide.active
            } else {
                // Все остальные слайды неактивны и будут opacity:0 и scale(0.8) по правилу :not(.active)
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

        // 1. Анимация уходящего слайда (prevSlide)
        if (animate && prevSlide && prevSlide !== nextSlide) {
            prevSlide.classList.remove('active'); // Убираем активный класс
            // CSS :not(.active) правило позаботится об исчезновении
        }

        // 2. Подготовка приходящего слайда (nextSlide)
        // Сначала устанавливаем его в начальное положение для появления
        if (animate && prevSlide !== nextSlide) {
            if (direction === 'down') {
                nextSlide.classList.add('from-bottom'); // Приходит снизу
            } else {
                nextSlide.classList.add('from-top'); // Приходит сверху
            }
            // Здесь не нужно устанавливать opacity/transform через style,
            // так как это сделают классы from-top/from-bottom
        }

        // 3. Обновляем позицию контейнера (это запускает его CSS transition)
        const targetTranslateY = -currentSlideIndex * window.innerHeight;
        slidesContainer.style.transform = `translateY(${targetTranslateY}px)`;

        // 4. Запускаем анимацию появления приходящего слайда с небольшой задержкой
        // после того, как slidesContainer начал двигаться.
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

            // После завершения анимации, убедимся, что ушедший слайд
            // не имеет никаких классов, которые могут помешать ему
            // быть неактивным (opacity:0, scale:0.8)
            if (prevSlide && prevSlide !== nextSlide) {
                // prevSlide.classList.remove('active'); // Уже сделано
                // prevSlide.classList.remove('from-top', 'from-bottom'); // На всякий случай
            }
        }, { once: true });
    }

    // --- Генерация и обновление индикаторов (без изменений) ---
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

    // --- Обработчик события прокрутки колесика мыши (без изменений) ---
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