// scripts/projects.js

document.addEventListener('DOMContentLoaded', () => {
    const projectsList = document.getElementById('projects-list');
    const loadingMessage = document.querySelector('.loading-message');
    const errorMessage = document.querySelector('.error-message');

    const projectModal = document.createElement('div');
    projectModal.classList.add('project-modal');
    document.body.appendChild(projectModal); // Добавляем модальное окно в body

    const API_URL = 'http://localhost:3000/api/projects'; // Адрес вашего бэкенда

    // --- Функция для получения проектов с бэкенда ---
    async function fetchProjects() {
        // Показываем сообщение о загрузке
        loadingMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        projectsList.innerHTML = ''; // Очищаем список перед загрузкой

        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const projects = await response.json();
            displayProjects(projects);
        } catch (error) {
            console.error('Error fetching projects:', error);
            errorMessage.style.display = 'block';
        } finally {
            // Скрываем сообщение о загрузке после завершения (успеха или ошибки)
            loadingMessage.style.display = 'none'; 
        }
    }

    // --- Функция для отображения проектов ---
    function displayProjects(projects) {
        if (projects.length === 0) {
            projectsList.innerHTML = '<p class="projects-intro">Пока нет проектов для отображения.</p>';
            return;
        }

        projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.classList.add('project-item');
            projectItem.dataset.projectId = project.id; // Сохраняем ID для модалки

            projectItem.innerHTML = `
                <div class="project-image-container">
                    <img src="${project.imageUrl || 'https://via.placeholder.com/300x180?text=No+Image'}" alt="${project.title}" class="project-image">
                </div>
                <div class="project-info">
                    <h3 class="project-title-card">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-links">
                        ${project.githubLink ? `<a href="${project.githubLink}" target="_blank" class="project-link">
                            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.23 1.838 1.23 1.07 1.835 2.809 1.305 3.493.998.108-.776.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.196-6.091 8.196-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            GitHub
                        </a>` : ''}
                        ${project.liveLink ? `<a href="${project.liveLink}" target="_blank" class="project-link">
                            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9v-2h2v2zm0-4H9V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                            Live Demo
                        </a>` : ''}
                    </div>
                </div>
            `;
            projectsList.appendChild(projectItem);

            // Добавляем слушатель для открытия модального окна
            projectItem.addEventListener('click', () => showProjectDetails(project));
        });
    }

    // --- Функция для отображения подробностей проекта в модальном окне ---
    function showProjectDetails(project) {
        projectModal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h2 class="modal-title">${project.title}</h2>
                ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.title}" class="modal-image">` : ''}
                
                ${project.detailedDescription ? `
                    <h3 class="modal-section-title">Подробное описание</h3>
                    <p class="modal-text">${project.detailedDescription}</p>
                ` : ''}

                ${project.features && project.features.length > 0 ? `
                    <h3 class="modal-section-title">Ключевые особенности</h3>
                    <ul class="modal-list">
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                ` : ''}

                ${project.technologies ? `
                    <h3 class="modal-section-title">Использованные технологии</h3>
                    <p class="modal-text">${project.technologies}</p>
                ` : ''}

                ${project.authors ? `
                    <h3 class="modal-section-title">Авторы</h3>
                    <p class="modal-text">${project.authors}</p>
                ` : ''}

                <div class="modal-links">
                    ${project.githubLink ? `<a href="${project.githubLink}" target="_blank" class="project-link">
                        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.23 1.838 1.23 1.07 1.835 2.809 1.305 3.493.998.108-.776.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.196-6.091 8.196-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        GitHub
                    </a>` : ''}
                    ${project.liveLink ? `<a href="${project.liveLink}" target="_blank" class="project-link">
                        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9v-2h2v2zm0-4H9V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                        Live Demo
                    </a>` : ''}
                </div>
            </div>
        `;
        projectModal.classList.add('active'); // Показываем модальное окно

        // Добавляем слушатель для кнопки закрытия модального окна
        projectModal.querySelector('.modal-close').addEventListener('click', hideProjectDetails);

        // Закрытие по клику вне модального окна
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                hideProjectDetails();
            }
        });
    }

    // --- Функция для скрытия модального окна ---
    function hideProjectDetails() {
        projectModal.classList.remove('active');
    }

    // --- Запускаем загрузку проектов при загрузке страницы ---
    fetchProjects();
});