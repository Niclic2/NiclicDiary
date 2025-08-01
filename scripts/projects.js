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

function createLinkButton(url, text, className) {
    if (!url) return null; // Если URL нет, не создаем кнопку

    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.classList.add('link-button', className);
    link.textContent = text;
    // Важно: event.stopPropagation() должен быть добавлен как обработчик события,
    // а не как inline-атрибут в HTML-строке.
    link.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    return link;
}

// Функция для создания всей карточки проекта
function createProjectCardElement(project) {
    const projectCard = document.createElement('div');
    projectCard.classList.add('project-card'); // Основной контейнер карточки
    projectCard.setAttribute('data-id', project.id);

    const projectCardInner = document.createElement('div');
    projectCardInner.classList.add('project-card-inner');

    // --- FRONT SIDE ---
    const projectCardFront = document.createElement('div');
    projectCardFront.classList.add('project-card-front');

    const image = document.createElement('img');
    image.src = project.imageUrl;
    image.alt = project.title; // alt-текст также должен быть очищен, если приходит извне
    image.classList.add('project-image');
    projectCardFront.appendChild(image);

    const titleFront = document.createElement('h2');
    titleFront.classList.add('project-title');
    titleFront.textContent = project.title; // textContent автоматически экранирует
    projectCardFront.appendChild(titleFront);

    const linksFront = document.createElement('div');
    linksFront.classList.add('project-links');

    const githubButtonFront = createLinkButton(project.githubUrl, 'GitHub', 'github-button');
    if (githubButtonFront) {
        linksFront.appendChild(githubButtonFront);
    }

    const demoButtonFront = createLinkButton(project.demoUrl, 'Демо', 'demo-button');
    if (demoButtonFront) {
        linksFront.appendChild(demoButtonFront);
    }
    projectCardFront.appendChild(linksFront);

    projectCardInner.appendChild(projectCardFront);

    // --- BACK SIDE ---
    const projectCardBack = document.createElement('div');
    projectCardBack.classList.add('project-card-back');

    const titleBack = document.createElement('h3');
    titleBack.classList.add('project-back-title');
    titleBack.textContent = project.title;
    projectCardBack.appendChild(titleBack);

    const description = document.createElement('p');
    description.classList.add('project-description');
    description.textContent = project.description;
    projectCardBack.appendChild(description);

    const technologiesDiv = document.createElement('div');
    technologiesDiv.classList.add('project-technologies');
    project.technologies.forEach(tech => {
        const techSpan = document.createElement('span');
        techSpan.classList.add('tech-tag');
        techSpan.textContent = tech;
        technologiesDiv.appendChild(techSpan);
    });
    projectCardBack.appendChild(technologiesDiv);

    const linksBack = document.createElement('div');
    linksBack.classList.add('project-links');

    const githubButtonBack = createLinkButton(project.githubUrl, 'GitHub', 'github-button');
    if (githubButtonBack) {
        linksBack.appendChild(githubButtonBack);
    }

    const demoButtonBack = createLinkButton(project.demoUrl, 'Демо', 'demo-button');
    if (demoButtonBack) {
        linksBack.appendChild(demoButtonBack);
    }
    projectCardBack.appendChild(linksBack);

    projectCardInner.appendChild(projectCardBack);

    projectCard.appendChild(projectCardInner);

    projectCard.classList.add('clickable'); 

    // Добавляем обработчик клика для переключения вида
    projectCard.addEventListener('click', () => {
        projectCard.classList.toggle('is-flipped'); // Переключаем класс для анимации
    });

    return projectCard;
}

// --- Логика для отображения проектов ---
document.addEventListener('DOMContentLoaded', () => {
    const projectsListContainer = document.getElementById('projects-list');
    const loadingMessage = document.querySelector('.loading-message');
    const errorMessage = document.querySelector('.error-message');
    const projectsIntro = document.querySelector('.projects-intro');

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
                    const projectCard = createProjectCardElement(project);
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