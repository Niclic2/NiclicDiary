// js/slideshow.js

document.addEventListener('DOMContentLoaded', () => {
    const slidesContainer = document.querySelector('.slides-container');
    const slides = document.querySelectorAll('.slide');
    const slideIndicators = document.querySelector('.slide-indicators');
    const numSlides = slides.length;

    let currentSlideIndex = 0;
    let isAnimating = false; // Флаг для предотвращения множественных анимаций

    // --- Переменные для обработки свайпов ---
    let touchStartY = 0;
    let touchEndY = 0;
    const touchThreshold = 50; // Минимальное расстояние свайпа для срабатывания (в пикселях)

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
        // Проверяем, не выходим ли за границы слайдов
        if (index < 0 || index >= numSlides) {
            return;
        }
        // Проверяем, не идет ли уже анимация
        if (isAnimating && index !== currentSlideIndex) { // Разрешаем повторный вызов для текущего слайда, если он уже активен
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
            // Сначала убираем все классы направления, чтобы избежать конфликтов
            nextSlide.classList.remove('from-top', 'from-bottom');
            if (direction === 'down') {
                nextSlide.classList.add('from-bottom'); // Приходит снизу
            } else {
                nextSlide.classList.add('from-top'); // Приходит сверху
            }
        }

        // Обновляем позицию контейнера (это запускает его CSS transition)
        // ИСПОЛЬЗУЕМ window.innerHeight для высоты слайда
        const targetTranslateY = -currentSlideIndex * window.innerHeight;
        slidesContainer.style.transform = `translateY(${targetTranslateY}px)`;

        // Запускаем анимацию появления приходящего слайда с небольшой задержкой
        // Эта задержка нужна, чтобы браузер успел применить начальное положение (from-top/from-bottom)
        // до того, как мы снимем эти классы и запустим переход.
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
        // Используем 'transitionend' на slidesContainer, так как он перемещается
        slidesContainer.addEventListener('transitionend', function handler() {
            isAnimating = false;
            slidesContainer.removeEventListener('transitionend', handler);
            // После завершения анимации, убедимся, что только текущий слайд имеет класс 'active'
            slides.forEach((slide, i) => {
                if (i !== currentSlideIndex) {
                    slide.classList.remove('active');
                }
            });
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
        event.preventDefault(); // Предотвращаем стандартную прокрутку страницы

        if (isAnimating) {
            return;
        }

        const delta = event.deltaY;

        if (delta > 0) { // Прокрутка вниз
            goToSlide(currentSlideIndex + 1);
        } else if (delta < 0) { // Прокрутка вверх
            goToSlide(currentSlideIndex - 1);
        }
    }, { passive: false }); // { passive: false } для возможности event.preventDefault()

    // --- Обработчики событий касания (свайпы) ---
    slidesWrapper.addEventListener('touchstart', (event) => {
        touchStartY = event.touches[0].clientY; // Запоминаем начальную Y-координату касания
    }, { passive: true }); // { passive: true } для лучшей производительности на мобильных

    slidesWrapper.addEventListener('touchmove', (event) => {
        // Можно добавить логику для "перетаскивания" слайда во время движения пальца,
        // но это усложнит код. Для простого свайпа достаточно touchend.
    }, { passive: true });

    slidesWrapper.addEventListener('touchend', (event) => {
        touchEndY = event.changedTouches[0].clientY; // Запоминаем конечную Y-координату касания

        if (isAnimating) {
            return;
        }

        const deltaY = touchEndY - touchStartY; // Разница между началом и концом касания

        if (Math.abs(deltaY) > touchThreshold) { // Если свайп достаточно длинный
            if (deltaY < 0) { // Свайп вверх (палец движется вверх, слайд должен идти вниз)
                goToSlide(currentSlideIndex + 1);
            } else { // Свайп вниз (палец движется вниз, слайд должен идти вверх)
                goToSlide(currentSlideIndex - 1);
            }
        }
    });


    // --- Обработка изменения размера окна (для корректной высоты слайдов) ---
    // Это критично для того, чтобы slidesContainer.style.transform = `translateY(${targetTranslateY}px)`
    // всегда использовал актуальную высоту окна.
    window.addEventListener('resize', () => {
        // При изменении размера окна, пересчитываем позицию текущего слайда
        // и сразу применяем ее, чтобы избежать "прыжков"
        const targetTranslateY = -currentSlideIndex * window.innerHeight;
        slidesContainer.style.transform = `translateY(${targetTranslateY}px)`;
    });


    // --- Запуск ---
    init();
});