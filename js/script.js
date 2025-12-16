// ========== ПЕРЕКЛЮЧЕНИЕ ТЕМЫ ==========
document.addEventListener('DOMContentLoaded', function() {
    // Кнопка переключения темы
    const themeToggleBtn = document.getElementById('themeToggle');
    
    // Если кнопка существует
    if (themeToggleBtn) {
        const themeIcon = themeToggleBtn.querySelector('i');
        
        // Проверяем сохраненную тему
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            if (themeIcon) {
                themeIcon.className = 'fas fa-sun';
            }
            themeToggleBtn.title = 'Переключить на светлую тему (Ctrl+T)';
        }
        
        // Функция переключения темы
        function toggleTheme() {
            document.body.classList.toggle('dark-theme');
            
            if (document.body.classList.contains('dark-theme')) {
                if (themeIcon) {
                    themeIcon.className = 'fas fa-sun';
                }
                themeToggleBtn.title = 'Переключить на светлую тему (Ctrl+T)';
                localStorage.setItem('theme', 'dark');
                alert('Темная тема включена!');
            } else {
                if (themeIcon) {
                    themeIcon.className = 'fas fa-moon';
                }
                themeToggleBtn.title = 'Переключить на темную тему (Ctrl+T)';
                localStorage.setItem('theme', 'light');
                alert('Светлая тема включена!');
            }
        }
        
        // Обработчик для кнопки
        themeToggleBtn.addEventListener('click', toggleTheme);
        
        // Обработчик для горячей клавиши
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 't') {
                event.preventDefault();
                toggleTheme();
            }
        });
    }
});
// Данные оценок (имитация базы данных)
let gradesData = [
    { id: 1, subject: 'math', monday: '5', tuesday: '4', wednesday: '5', thursday: '', friday: '5', average: 4.8 },
    { id: 2, subject: 'russian', monday: '5', tuesday: '4', wednesday: '4', thursday: '5', friday: '', average: 4.5 },
    { id: 3, subject: 'physics', monday: '4', tuesday: '', wednesday: '3', thursday: '5', friday: '4', average: 4.0 },
    { id: 4, subject: 'history', monday: '5', tuesday: '5', wednesday: '4', thursday: '', friday: '5', average: 4.75 },
    { id: 5, subject: 'biology', monday: '', tuesday: '4', wednesday: '4', thursday: '3', friday: '4', average: 3.75 },
    { id: 6, subject: 'english', monday: '5', tuesday: '5', wednesday: '', thursday: '5', friday: '4', average: 4.75 },
    { id: 7, subject: 'chemistry', monday: '4', tuesday: '3', wednesday: '4', thursday: '', friday: '4', average: 3.75 },
    { id: 8, subject: 'informatics', monday: '', tuesday: '5', wednesday: '5', thursday: '5', friday: '5', average: 5.0 }
];

let currentWeek = 1;
let colorMode = true;

// DOM элементы
const gradesBody = document.getElementById('gradesBody');
const prevWeekBtn = document.getElementById('prevWeek');
const nextWeekBtn = document.getElementById('nextWeek');
const currentWeekSpan = document.getElementById('currentWeek');
const subjectFilter = document.getElementById('subjectFilter');
const toggleColorsBtn = document.getElementById('toggleColors');
const addGradeBtn = document.getElementById('addGradeBtn');
const gradeModal = document.getElementById('gradeModal');
const closeModal = document.querySelector('.close');
const addGradeForm = document.getElementById('addGradeForm');

// Навигация по неделям
prevWeekBtn.addEventListener('click', () => {
    if (currentWeek > 1) {
        currentWeek--;
        updateWeekDisplay();
        renderTable();
    }
});

nextWeekBtn.addEventListener('click', () => {
    currentWeek++;
    updateWeekDisplay();
    renderTable();
});

// Фильтрация по предметам
subjectFilter.addEventListener('change', renderTable);

// Переключение цветового режима
toggleColorsBtn.addEventListener('click', () => {
    colorMode = !colorMode;
    toggleColorsBtn.innerHTML = colorMode ? 
        '<i class="fas fa-palette"></i> Цветовые оценки' : 
        '<i class="fas fa-palette"></i> Обычные оценки';
    renderTable();
});

// Открытие модального окна
addGradeBtn.addEventListener('click', () => {
    gradeModal.style.display = 'flex';
});

// Закрытие модального окна
closeModal.addEventListener('click', () => {
    gradeModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === gradeModal) {
        gradeModal.style.display = 'none';
    }
});

// Добавление новой оценки
addGradeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const subject = document.getElementById('subject').value;
    const day = document.getElementById('day').value;
    const grade = document.getElementById('grade').value;
    
    // Находим предмет в данных
    const subjectData = gradesData.find(item => item.subject === subject);
    if (subjectData) {
        subjectData[day] = grade;
        
        // Пересчитываем средний балл
        const grades = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
            .map(d => subjectData[d])
            .filter(g => g !== '')
            .map(Number);
        
        subjectData.average = grades.length ? 
            (grades.reduce((a, b) => a + b) / grades.length).toFixed(2) : 0;
    }
    
    renderTable();
    gradeModal.style.display = 'none';
    addGradeForm.reset();
    
    // Показываем уведомление
    alert(`Оценка ${grade} по предмету добавлена успешно!`);
});

// Обновление отображения недели
function updateWeekDisplay() {
    const weekNames = ['18-24 мая', '25-31 мая', '1-7 июня', '8-14 июня'];
    const weekIndex = Math.min(currentWeek - 1, weekNames.length - 1);
    currentWeekSpan.textContent = `Неделя ${weekNames[weekIndex]}`;
}

// Генерация ячейки с оценкой
function createGradeCell(grade, day) {
    const cell = document.createElement('td');
    
    if (grade) {
        if (colorMode) {
            const gradeSpan = document.createElement('span');
            gradeSpan.className = `grade-cell grade-${grade}`;
            gradeSpan.textContent = grade;
            gradeSpan.title = getGradeDescription(grade);
            cell.appendChild(gradeSpan);
            
            // Добавляем обработчик клика для изменения оценки
            gradeSpan.addEventListener('click', (event) => {
                event.stopPropagation();
                const newGrade = prompt(`Изменить оценку (текущая: ${grade})`, grade);
                if (newGrade && ['2', '3', '4', '5'].includes(newGrade)) {
                    updateGradeInData(day, grade, newGrade);
                }
            });
        } else {
            cell.textContent = grade;
        }
    } else {
        const addBtn = document.createElement('button');
        addBtn.className = 'add-grade-btn';
        addBtn.innerHTML = '<i class="fas fa-plus"></i>';
        addBtn.title = 'Добавить оценку';
        cell.appendChild(addBtn);
    }
    
    return cell;
}

// Обновление оценки в данных
function updateGradeInData(day, oldGrade, newGrade) {
    // Здесь можно добавить логику обновления данных
    console.log(`Обновление оценки: ${oldGrade} -> ${newGrade} для дня ${day}`);
    renderTable();
}

// Получение описания оценки
function getGradeDescription(grade) {
    const descriptions = {
        '5': 'Отлично',
        '4': 'Хорошо',
        '3': 'Удовлетворительно',
        '2': 'Неудовлетворительно'
    };
    return descriptions[grade] || 'Нет оценки';
}

// Рендеринг таблицы
function renderTable() {
    const filterValue = subjectFilter.value;
    let filteredData = gradesData;
    
    if (filterValue !== 'all') {
        filteredData = gradesData.filter(item => item.subject === filterValue);
    }
    
    gradesBody.innerHTML = '';
    
    filteredData.forEach(item => {
        const row = document.createElement('tr');
        
        // Название предмета
        const subjectNames = {
            math: 'Математика',
            russian: 'Русский язык',
            physics: 'Физика',
            history: 'История',
            biology: 'Биология',
            english: 'Английский язык',
            chemistry: 'Химия',
            informatics: 'Информатика'
        };
        
        const subjectCell = document.createElement('td');
        subjectCell.textContent = subjectNames[item.subject] || item.subject;
        subjectCell.className = 'subject-cell';
        row.appendChild(subjectCell);
        
        // Оценки по дням
        row.appendChild(createGradeCell(item.monday, 'monday'));
        row.appendChild(createGradeCell(item.tuesday, 'tuesday'));
        row.appendChild(createGradeCell(item.wednesday, 'wednesday'));
        row.appendChild(createGradeCell(item.thursday, 'thursday'));
        row.appendChild(createGradeCell(item.friday, 'friday'));
        
        // Средний балл
        const avgCell = document.createElement('td');
        avgCell.textContent = item.average;
        avgCell.className = 'average-cell';
        row.appendChild(avgCell);
        
        // Действия
        const actionsCell = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'Удалить предмет';
        deleteBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            if (confirm(`Удалить предмет "${subjectNames[item.subject]}" из журнала?`)) {
                gradesData = gradesData.filter(grade => grade.id !== item.id);
                renderTable();
            }
        });
        actionsCell.appendChild(deleteBtn);
        row.appendChild(actionsCell);
        
        gradesBody.appendChild(row);
    });
}

// Инициализация
updateWeekDisplay();
renderTable();

// Добавляем обработчик для строк таблицы (ТРЕБОВАНИЕ: взаимодействие)
gradesBody.addEventListener('click', (event) => {
    if (event.target.closest('tr') && !event.target.closest('button') && !event.target.closest('.grade-cell')) {
        const row = event.target.closest('tr');
        row.classList.toggle('selected');
    }
});

// Дополнительный интерактив: изменение цвета темы
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 't') {
        document.body.classList.toggle('dark-theme');
        alert('Цветовая тема изменена!');
    }
});