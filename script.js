// Events data
const calendarEvents = {
    "2024-12-01": ["Project Due"],
    "2024-12-03": ["Math Exam", "Team Meeting"],
    "2024-11-30": ["Complete Project Draft", "Prepare Presentation"],

};

// Generate Calendar
function generateCalendar(containerId) {
    const container = document.getElementById(containerId);
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    container.innerHTML = `
        <div class="calendar-header">
            <span>${today.toLocaleString('default', { month: 'long' })} ${currentYear}</span>
        </div>
        <div class="calendar-days">
            ${daysOfWeek.map(day => `<div class="calendar-day">${day}</div>`).join('')}
        </div>
    `;

    const daysContainer = document.createElement('div');
    daysContainer.className = 'calendar-days';

    for (let i = 0; i < firstDay; i++) {
        daysContainer.innerHTML += `<div class="calendar-day empty"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const events = calendarEvents[dateKey] || [];
        daysContainer.innerHTML += `
            <div class="calendar-day" data-date="${dateKey}">
                ${day}
                ${events.length ? `<div class="event-indicator"></div>` : ""}
            </div>
        `;
    }

    container.appendChild(daysContainer);

    const dayElements = daysContainer.querySelectorAll('.calendar-day:not(.empty)');
    dayElements.forEach(day => {
        day.addEventListener('click', () => openDateDetails(day.dataset.date));
    });
}

const goals = [];

function addGoal() {
    const goalInput = document.getElementById('goal-input').value.trim();
    if (!goalInput) return;

    goals.push({ text: goalInput, completed: false });
    document.getElementById('goal-input').value = '';
    renderGoals();
}

function toggleGoalCompletion(index) {
    goals[index].completed = !goals[index].completed;
    renderGoals();
}

function renderGoals() {
    const goalList = document.getElementById('goal-list');
    goalList.innerHTML = goals
        .map(
            (goal, index) => `
            <div class="goal-item">
                <input type="checkbox" onclick="toggleGoalCompletion(${index})" ${
                goal.completed ? 'checked' : ''
            }>
                <span class="${goal.completed ? 'completed' : ''}">${goal.text}</span>
            </div>
        `
        )
        .join('');
}

// Toggle Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Add Event Listener for Dark Mode Toggle
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
});


// Function to toggle between sections
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
        section.classList.add('hidden'); // Ensure all sections are hidden
    });

    const selectedSection = document.getElementById(sectionId);
    selectedSection.classList.add('active'); // Show the selected section
    selectedSection.classList.remove('hidden'); // Remove hidden class
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Ensure the Dashboard section is shown by default
    showSection('dashboard');
});

function initializeProgressChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Remaining'],
            datasets: [
                {
                    data: [75, 25],
                    backgroundColor: ['#1abc9c', '#ecf0f1'],
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                },
            },
        },
    });
}

// Ensure the chart is initialized on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeProgressChart();
});


// Placeholder StudyBot responses
function getBotResponse(input) {
    const lowerCaseInput = input.toLowerCase();

    // Simulate responses for common inputs
    if (lowerCaseInput.includes('task')) {
        return "You can manage your tasks in the Tasks section!";
    } else if (lowerCaseInput.includes('goal')) {
        return "Goals help you stay on track. Set one in the Goals section.";
    } else if (lowerCaseInput.includes('search')) {
        return `
        Here are some suggested articles:
        <ul>
            <li><a href="https://example.com/study-tips" target="_blank">Study Tips</a></li>
            <li><a href="https://example.com/productivity" target="_blank">Productivity Hacks</a></li>
            <li><a href="https://example.com/time-management" target="_blank">Time Management</a></li>
        </ul>
    `;
    } else if (lowerCaseInput.includes('event')) {
        return "You can view your events in the Calendar section.";
    } else {
        return "I'm here to help! Try asking about tasks, goals, or events.";
    }
}

// Simulate typing delay for more realistic interaction
function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim();
    if (!userInput) return;

    const chatDisplay = document.getElementById('chat-display');

    // Append user's message
    chatDisplay.innerHTML += `<div class="chat-bubble user">${userInput}</div>`;

    // Simulate bot typing
    chatDisplay.innerHTML += `<div class="chat-bubble bot typing">...</div>`;
    document.getElementById('user-input').value = '';
    chatDisplay.scrollTop = chatDisplay.scrollHeight;

    setTimeout(() => {
        // Replace typing indicator with bot's response
        const typingBubble = chatDisplay.querySelector('.typing');
        if (typingBubble) typingBubble.remove();

        const botResponse = getBotResponse(userInput);
        chatDisplay.innerHTML += `<div class="chat-bubble bot">${botResponse}</div>`;
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }, 1000); // Simulated delay
}


// Function to open the event details modal
function openDateDetails(date) {
    const modal = document.getElementById('date-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalEvents = document.getElementById('modal-events');
    const addEventInput = document.getElementById('add-event-input');

    modalTitle.textContent = `Events on ${date}`;
    const events = calendarEvents[date] || [];
    
    // Populate the modal with events
    modalEvents.innerHTML = events.length
        ? events.map((event, index) => `
            <li>
                ${event}
                <button class="edit-event-btn" data-date="${date}" data-index="${index}">Edit</button>
                <button class="delete-event-btn" data-date="${date}" data-index="${index}">Delete</button>
            </li>
        `).join('')
        : "<p>No events for this day.</p>";

    modal.style.display = 'block';

    // Handle addiang a new event
    document.getElementById('add-event-btn').onclick = () => {
        const newEvent = addEventInput.value.trim();
        if (newEvent) {
            if (!calendarEvents[date]) calendarEvents[date] = [];
            calendarEvents[date].push(newEvent);
            addEventInput.value = '';
            openDateDetails(date); // Refresh modal
            generateCalendar('dashboard-calendar'); // Update dashboard calendar
            generateCalendar('calendar-tab'); // Update calendar tab
        }
    };

    // Handle editing an event
    modalEvents.querySelectorAll('.edit-event-btn').forEach(button => {
        button.addEventListener('click', () => {
            const eventDate = button.dataset.date;
            const eventIndex = button.dataset.index;
            const updatedEvent = prompt("Edit your event:", calendarEvents[eventDate][eventIndex]);
            if (updatedEvent) {
                calendarEvents[eventDate][eventIndex] = updatedEvent;
                openDateDetails(date); // Refresh modal
                generateCalendar('dashboard-calendar');
                generateCalendar('calendar-tab');
            }
        });
    });

    // Handle deleting an event
    modalEvents.querySelectorAll('.delete-event-btn').forEach(button => {
        button.addEventListener('click', () => {
            const eventDate = button.dataset.date;
            const eventIndex = button.dataset.index;
            calendarEvents[eventDate].splice(eventIndex, 1); // Remove event
            if (calendarEvents[eventDate].length === 0) delete calendarEvents[eventDate]; // Clean up
            openDateDetails(date); // Refresh modal
            generateCalendar('dashboard-calendar');
            generateCalendar('calendar-tab');
        });
    });

    // Close modal
    document.getElementById('close-modal').onclick = () => {
        modal.style.display = 'none';
    };
}

document.addEventListener('DOMContentLoaded', () => {
    generateCalendar('dashboard-calendar');
    generateCalendar('calendar-tab');
});

// Add a new goal
function addGoal() {
    const goalInput = document.getElementById('goal-input').value.trim();
    if (!goalInput) return;

    goals.push({ text: goalInput, completed: false });
    document.getElementById('goal-input').value = '';
    renderGoals();
}

// Toggle goal completion
function toggleGoalCompletion(index) {
    goals[index].completed = !goals[index].completed;
    renderGoals();
}

// Delete a goal
function deleteGoal(index) {
    goals.splice(index, 1);
    renderGoals();
}

// Render the goals and update progress
function renderGoals() {
    const goalList = document.getElementById('goal-list');
    const completedGoals = goals.filter(goal => goal.completed).length;
    const totalGoals = goals.length;
    const progressPercentage = totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);

    // Update progress bar
    document.getElementById('goal-progress').style.width = `${progressPercentage}%`;

    // Render goal cards
    goalList.innerHTML = goals
        .map(
            (goal, index) => `
            <div class="goal-card ${goal.completed ? 'completed' : ''}">
                <div class="goal-text">${goal.text}</div>
                <div class="goal-actions">
                    <button onclick="toggleGoalCompletion(${index})">${goal.completed ? 'Mark Incomplete' : 'Mark Complete'}</button>
                    <button onclick="deleteGoal(${index})">Delete</button>
                </div>
            </div>
        `
        )
        .join('');
}

// Initialize page with no goals
document.addEventListener('DOMContentLoaded', () => {
    renderGoals();
});

const uploadedFiles = [];

function uploadFiles() {
    const fileInput = document.getElementById('file-upload');
    const files = Array.from(fileInput.files);

    if (files.length === 0) {
        alert("No files selected!");
        return;
    }

    // Simulate file upload by adding to the `uploadedFiles` array
    files.forEach(file => uploadedFiles.push(file.name));

    // Clear file input and render the uploaded files
fileInput.value = '';
    renderFileList();
}

function renderFileList() {
    const fileListContainer = document.querySelector('#file-list ul');
    fileListContainer.innerHTML = uploadedFiles
        .map(
            (fileName, index) => `
            <li>
                ${fileName}
                <button onclick="deleteFile(${index})">Delete</button>
            </li>
        `
        )
        .join('');
}

function deleteFile(index) {
    uploadedFiles.splice(index, 1); // Remove the file from the array
    renderFileList(); // Re-render the list
}

// Function to render reminders on the dashboard
function renderReminders() {
    const reminderList = document.getElementById('reminder-list');
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const reminders = calendarEvents[todayKey] || [];
    reminderList.innerHTML = reminders.length
        ? reminders.map(reminder => `<li>${reminder}</li>`).join('')
        : "<li>No reminders for today.</li>";
}

// Refresh reminders whenever the page loads
document.addEventListener('DOMContentLoaded', () => {
    renderReminders();
});

// Translation data for supported languages
const translations = {
    en: {
        dashboard: "Welcome to StudyMate!",
        tasks: "Tasks",
        documents: "Manage Your Documents",
        calendar: "Calendar",
        settings: "Settings",
        chatbot: "Chat with StudyBot",
        reminders: "Reminders",
        uploadButton: "Upload",
        toggleDarkMode: "Toggle Dark Mode",
        addGoal: "Add Goal",
    },
    es: {
        dashboard: "¡Bienvenido a StudyMate!",
        tasks: "Tareas",
        documents: "Gestiona tus Documentos",
        calendar: "Calendario",
        settings: "Configuración",
        chatbot: "Habla con StudyBot",
        reminders: "Recordatorios",
        uploadButton: "Subir",
        toggleDarkMode: "Cambiar Modo Oscuro",
        addGoal: "Añadir Meta",
    },
    fr: {
        dashboard: "Bienvenue sur StudyMate!",
        tasks: "Tâches",
        documents: "Gérez vos Documents",
        calendar: "Calendrier",
        settings: "Paramètres",
        chatbot: "Discutez avec StudyBot",
        reminders: "Rappels",
        uploadButton: "Téléverser",
        toggleDarkMode: "Activer le Mode Sombre",
        addGoal: "Ajouter un Objectif",
    },
    de: {
        dashboard: "Willkommen bei StudyMate!",
        tasks: "Aufgaben",
        documents: "Verwalte deine Dokumente",
        calendar: "Kalender",
        settings: "Einstellungen",
        chatbot: "Mit StudyBot chatten",
        reminders: "Erinnerungen",
        uploadButton: "Hochladen",
        toggleDarkMode: "Dunkelmodus Umschalten",
        addGoal: "Ziel Hinzufügen",
    },
};

// Change language function
function changeLanguage() {
    const selectedLanguage = document.getElementById("language-select").value;
    const elementsToTranslate = [
        { id: "dashboard", key: "dashboard" },
        { id: "tasks", key: "tasks" },
        { id: "documents", key: "documents" },
        { id: "calendar", key: "calendar" },
        { id: "settings", key: "settings" },
        { id: "chatbot", key: "chatbot" },
        { id: "reminders", key: "reminders" },
        { id: "addGoalButton", key: "addGoal" }, // Example for buttons
    ];

    elementsToTranslate.forEach(({ id, key }) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = translations[selectedLanguage][key];
        }
    });

    // Update button labels
    const uploadButton = document.querySelector("button[onclick='uploadFiles()']");
    if (uploadButton) {
        uploadButton.textContent = translations[selectedLanguage].uploadButton;
    }

    const darkModeButton = document.getElementById("darkModeToggle");
    if (darkModeButton) {
        darkModeButton.textContent = translations[selectedLanguage].toggleDarkMode;
    }
}

// Array to store tasks
const tasks = [];

// Function to add a new task
function addTask() {
    const taskInput = document.getElementById('new-task-input').value.trim();
    const taskDeadline = document.getElementById('new-task-deadline').value;
    const taskPriority = document.getElementById('new-task-priority').value;

    if (!taskInput || !taskDeadline || !taskPriority) {
        alert("Please fill in all fields to add a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskInput,
        deadline: taskDeadline,
        priority: taskPriority,
        completed: false,
    };

    tasks.push(newTask);
    document.getElementById('new-task-input').value = '';
    document.getElementById('new-task-deadline').value = '';
    document.getElementById('new-task-priority').value = 'low';
    renderTasks();
}

// Function to render the task list
function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = tasks
        .map((task, index) => `
            <li class="task-item ${task.completed ? 'completed' : ''}">
                <div>
                    <strong>${task.text}</strong> - ${task.deadline} 
                    (<span class="priority-${task.priority}">${task.priority}</span>)
                </div>
                <div class="task-actions">
                    <button onclick="toggleTaskCompletion(${index})">
                        ${task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                    </button>
                    <button onclick="deleteTask(${index})">Delete</button>
                </div>
            </li>
        `)
        .join('');
}

// Function to toggle task completion
function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

// Function to delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

// Initialize Tasks on Page Load
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
});


