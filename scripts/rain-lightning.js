document.addEventListener('DOMContentLoaded', () => {
    const rainContainer = document.querySelector('.rain-container');
    const lightningSvg = document.querySelector('.lightning-svg');
    const numDrops = 150; // Количество капель дождя
    const maxDropHeight = 40; // Максимальная длина капли
    const minDropHeight = 20; // Минимальная длина капли
    const maxDropWidth = 3; // Максимальная толщина капли
    const minDropWidth = 1; // Минимальная толщина капли

    // --- Генерация капель дождя ---
    function createRainDrop() {
        const drop = document.createElement('div');
        drop.classList.add('rain-drop');

        // Случайные параметры для каждой капли
        const width = Math.random() * (maxDropWidth - minDropWidth) + minDropWidth;
        const height = Math.random() * (maxDropHeight - minDropHeight) + minDropHeight;
        const left = Math.random() * 100; // Позиция по горизонтали в %
        const animationDuration = Math.random() * (10 - 3) + 2; // Длительность анимации
        const animationDelay = Math.random() * 5; // Задержка перед началом анимации

        drop.style.width = `${width}px`;
        drop.style.height = `${height}px`;
        drop.style.left = `${left}vw`;
        drop.style.animationDuration = `${animationDuration}s`;
        drop.style.animationDelay = `${animationDelay}s`;
        drop.style.animationTimingFunction = 'linear'; // Для равномерного падения

        rainContainer.appendChild(drop);
    }

    for (let i = 0; i < numDrops; i++) {
        createRainDrop();
    }

    // --- Анимация молний ---
    function generateLightningPath(startX, endX) {
        const pathData = [];
        let currentY = 0;
        let currentX = startX;

        pathData.push(`M ${currentX} ${currentY}`); // Начальная точка (Move To)

        const segmentHeight = 50; // Примерная высота одного сегмента зигзага
        const maxOffset = 20;    // Максимальное отклонение по X для зигзага

        while (currentY < window.innerHeight) {
            currentY += segmentHeight * (0.8 + Math.random() * 0.4); // Случайная высота сегмента
            currentX += (Math.random() - 0.5) * maxOffset * 2; // Случайное отклонение влево/вправо

            // Ограничиваем X, чтобы молния не уходила слишком далеко за края
            currentX = Math.max(0, Math.min(window.innerWidth, currentX));

            pathData.push(`L ${currentX} ${currentY}`); // Линия до следующей точки (Line To)
        }

        return pathData.join(' ');
    }

    function triggerLightning() {
        // Удаляем старые молнии, если они есть
        while (lightningSvg.firstChild) {
            lightningSvg.removeChild(lightningSvg.firstChild);
        }

        // Создаем новую молнию
        const lightningPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        lightningPath.classList.add('lightning-path');

        // Случайная начальная позиция по X
        const startX = Math.random() * window.innerWidth;
        lightningPath.setAttribute('d', generateLightningPath(startX, startX)); // Генерируем путь

        lightningSvg.appendChild(lightningPath);

        // Показываем молнию
        setTimeout(() => {
            lightningPath.style.opacity = 1;
        }, 10); // Небольшая задержка для применения начальных стилей

        // Скрываем молнию через короткое время
        setTimeout(() => {
            lightningPath.style.opacity = 0;
        }, 150); // Длительность вспышки

        // Изменение цвета дождя на время молнии
        const rainDrops = document.querySelectorAll('.rain-drop');
        rainDrops.forEach(drop => {
            drop.style.transition = 'background-color 0.1s ease-out';
            drop.style.backgroundColor = 'rgba(255, 100, 100, 0.8)'; // Более яркий красный
        });

        setTimeout(() => {
            rainDrops.forEach(drop => {
                drop.style.backgroundColor = 'rgba(139, 0, 0, 0.6)'; // Возвращаем исходный цвет
            });
        }, 200); // Чуть дольше, чем вспышка молнии
    }

    // Запускаем молнии с случайным интервалом
    function startLightningCycle() {
        const minDelay = 3000;
        const maxDelay = 8000; // Немного уменьшил максимальную задержку
        const delay = Math.random() * (maxDelay - minDelay) + minDelay;
        setTimeout(() => {
            triggerLightning();
            startLightningCycle();
        }, delay);
    }

    startLightningCycle();
});