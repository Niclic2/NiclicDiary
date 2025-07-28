const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3000; 

const projectsFilePath = path.join(__dirname, 'projects.json');

const API_SECRET_KEY = process.env.API_SECRET_KEY; 
if (!API_SECRET_KEY) {
    console.error('FATAL ERROR: API_SECRET_KEY is not defined. Please set it in your environment variables or .env file.');
    process.exit(1); // Завершаем процесс, если ключ не найден
}

// Middleware
app.use(cors()); // Разрешаем CORS для всех запросов
app.use(express.json()); // Позволяет Express парсить JSON-тела запросов

// --- Middleware для аутентификации по API Key ---
function authenticateApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key']; 

    if (!apiKey) {
        return res.status(401).json({ message: 'Unauthorized: API Key is missing.' });
    }

    if (apiKey === API_SECRET_KEY) { // Сравниваем с ключом из переменных окружения
        next(); 
    } else {
        return res.status(403).json({ message: 'Forbidden: Invalid API Key.' });
    }
}

// --- Вспомогательные функции для работы с файлом ---
function readProjects() {
    try {
        const data = fs.readFileSync(projectsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Если файл не существует или пуст, возвращаем пустой массив
        return [];
    }
}

function writeProjects(projects) {
    fs.writeFileSync(projectsFilePath, JSON.stringify(projects, null, 2), 'utf8');
}

// --- API-маршруты ---

// 1. Получить все проекты
app.get('/api/projects', (req, res) => {
    const projects = readProjects();
    res.json(projects);
});

// 2. Добавить новый проект
app.post('/api/projects', (req, res) => {
    const newProject = req.body;
    if (!newProject.title || !newProject.githubLink || !newProject.description) {
        return res.status(400).json({ message: 'Missing required fields: title, githubLink, description' });
    }
    const projects = readProjects();
    newProject.id = Date.now().toString(); // Простой уникальный ID
    projects.push(newProject);
    writeProjects(projects);
    res.status(201).json(newProject); // 201 Created
});

// 3. Обновить проект по ID (опционально, для полного CRUD)
app.put('/api/projects/:id', (req, res) => {
    const projectId = req.params.id;
    const updatedFields = req.body;
    let projects = readProjects();
    const index = projects.findIndex(p => p.id === projectId);

    if (index === -1) {
        return res.status(404).json({ message: 'Project not found' });
    }

    projects[index] = { ...projects[index], ...updatedFields };
    writeProjects(projects);
    res.json(projects[index]);
});

// 4. Удалить проект по ID (опционально)
app.delete('/api/projects/:id', (req, res) => {
    const projectId = req.params.id;
    let projects = readProjects();
    const initialLength = projects.length;
    projects = projects.filter(p => p.id !== projectId);

    if (projects.length === initialLength) {
        return res.status(404).json({ message: 'Project not found' });
    }

    writeProjects(projects);
    res.status(204).send(); // 204 No Content
});


// Запуск сервера
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});