// Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCrLG7-H-SMy2hoQyDJK86wrzQrQ_jcOFE",
  authDomain: "niclicdiarybackend-1.firebaseapp.com",
  projectId: "niclicdiarybackend-1",
  storageBucket: "niclicdiarybackend-1.firebasestorage.app",
  messagingSenderId: "971006371938",
  appId: "1:971006371938:web:08f09fe5b6f2052f2d493b",
  measurementId: "G-3FTTCGGY94"
};

const app = firebase.initializeApp(firebaseConfig); // Используем глобальный объект firebase
const db = firebase.firestore(); // Используем глобальный объект firebase.firestore


// --- Логика для отображения проектов ---
function createProjectCard(project) {
    const projectCard = document.createElement('div');
    projectCard.classList.add('project-card'); // Основной контейнер карточки
    projectCard.setAttribute('data-id', project.id);

    // Добавляем класс 'clickable' для стилизации курсора и индикации интерактивности
    projectCard.classList.add('clickable'); 

    // Создаем внутреннюю разметку карточки
    projectCard.innerHTML = `
        <div class="project-card-inner">
            <div class="project-card-front">
                <img src="${project.imageUrl}" alt="${project.title}" class="project-image">
                <h2 class="project-title">${project.title}</h2>
                <div class="project-links">
                    ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="link-button github-button" onclick="event.stopPropagation()">GitHub</a>` : ''}
                    ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="link-button demo-button" onclick="event.stopPropagation()">Демо</a>` : ''}
                </div>
            </div>
            <div class="project-card-back">
                <h3 class="project-back-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-technologies">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <button class="close-details-button">Закрыть</button>
            </div>
        </div>
    `;

    // Добавляем обработчик клика для переключения вида
    projectCard.addEventListener('click', () => {
        projectCard.classList.toggle('is-flipped'); // Переключаем класс для анимации
    });

    // Добавляем обработчик клика для кнопки "Закрыть" на обратной стороне
    const closeButton = projectCard.querySelector('.close-details-button');
    if (closeButton) {
        closeButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Предотвращаем всплытие события, чтобы не сработал клик по всей карточке
            projectCard.classList.remove('is-flipped');
        });
    }

    return projectCard;
}

    // Функция для загрузки и отображения проектов из Firestore
    async function loadProjectsFromFirestore() {
        loadingMessage.textContent = 'Загрузка проектов...';
        errorMessage.style.display = 'none';

        try {
            // Используем метод .collection() на экземпляре базы данных 'db'
            const projectsCol = db.collection('projects');

            // Используем метод .get() на объекте QuerySnapshot
            const projectsSnapshot = await projectsCol.get();

            const projects = [];
            projectsSnapshot.forEach(doc => {
                projects.push({ id: doc.id, ...doc.data() });
            });

            if (projects.length > 0) {
                projectsIntro.style.display = 'none';
                projectsListContainer.innerHTML = '';
                projects.forEach(project => {
                    const projectCard = createProjectCard(project);
                    projectsListContainer.appendChild(projectCard);
                });
            } else {
                projectsIntro.style.display = 'block';
            }
            
        } catch (error) {
            console.error('Ошибка при загрузке проектов из Firestore:', error);
            errorMessage.style.display = 'block';
            projectsIntro.style.display = 'block';
            projectsListContainer.innerHTML = '';
        } finally {
            loadingMessage.textContent = '';
        }
    }

    // Вызываем функцию загрузки проектов из Firestore при загрузке страницы
    loadProjectsFromFirestore();
});