// 2. Ваша конфигурация Firebase
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
// const db = getFirestore(app); // Эту строку заменить
const db = firebase.firestore(); // Используем глобальный объект firebase.firestore


// const analytics = getAnalytics(app); // Инициализация Analytics, если нужно
// const auth = getAuth(app); // Инициализация Auth, если нужно

// --- Логика для отображения проектов ---

document.addEventListener('DOMContentLoaded', () => {
    const projectsListContainer = document.getElementById('projects-list');
    const loadingMessage = document.querySelector('.loading-message');
    const errorMessage = document.querySelector('.error-message');
    const projectsIntro = document.querySelector('.projects-intro');

    // Функция для создания HTML-разметки одного проекта (без изменений)
    function createProjectCard(project) {
        const projectCard = document.createElement('div');
        projectCard.classList.add('project-card');
        projectCard.setAttribute('data-id', project.id);

        projectCard.innerHTML = `
            <img src="${project.imageUrl}" alt="${project.title}" class="project-image">
            <h2 class="project-title">${project.title}</h2>
            <p class="project-description">${project.description}</p>
            <div class="project-technologies">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="project-links">
                ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="link-button github-button">GitHub</a>` : ''}
                ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="link-button demo-button">Демо</a>` : ''}
            </div>
        `;
        return projectCard;
    }

    // Функция для загрузки и отображения проектов из Firestore
    async function loadProjectsFromFirestore() {
        loadingMessage.textContent = 'Загрузка проектов...';
        errorMessage.style.display = 'none';

        try {
            // !!! ИЗМЕНЕНИЕ ЗДЕСЬ !!!
            // Используем метод .collection() на экземпляре базы данных 'db'
            const projectsCol = db.collection('projects');

            // !!! ИЗМЕНЕНИЕ ЗДЕСЬ !!!
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