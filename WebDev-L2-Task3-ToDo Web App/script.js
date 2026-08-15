const taskInput =
    document.getElementById("taskInput");
const prioritySelect =
    document.getElementById("prioritySelect");
const categorySelect =
    document.getElementById("categorySelect");
const addTaskBtn =
    document.getElementById("addTaskBtn");
const pendingList =
    document.getElementById("pendingList");
const completedList =
    document.getElementById("completedList");
const pendingCount =
    document.getElementById("pendingCount");
const completedCount =
    document.getElementById("completedCount");
const themeToggle =
    document.getElementById("themeToggle");
const filterButtons =
    document.querySelectorAll(".filter-btn");

let tasks =
    JSON.parse(localStorage.getItem("taskflowTasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );
}
function generateId() {
    return Date.now().toString()
        + Math.random().toString(16).slice(2);
}
function formatTime(dateString) {
    const date =
        new Date(dateString);
    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}
function addTask() {
    const text =
        taskInput.value.trim();
    if (text === "") {
        taskInput.focus();
        return;
    }
    const task = {
        id: generateId(),
        text: text,
        priority:
            prioritySelect.value,
        category:
            categorySelect.value,
        completed: false,
        createdAt:
            new Date().toISOString(),
        completedAt: null
    };
    tasks.unshift(task);
    saveTasks();
    renderTasks();
    taskInput.value = "";
    prioritySelect.value = "medium";
    categorySelect.value = "work";
    taskInput.focus();
}
addTaskBtn.addEventListener(
    "click",
    addTask
);
taskInput.addEventListener(
    "keydown",
    (event) => {
        if (event.key === "Enter") {
            addTask();
        }
    }
);
function renderTasks() {
    pendingList.innerHTML = "";
    completedList.innerHTML = "";
    const filteredTasks =
        tasks.filter(task => {
            if (currentFilter === "all") {
                return true;
            }
            return task.category === currentFilter;
        });
    const pendingTasks =
        filteredTasks.filter(
            task => !task.completed
        );
    const completedTasks =
        filteredTasks.filter(
            task => task.completed
        );
    
    pendingCount.textContent =
        `${pendingTasks.length} pending`;
    completedCount.textContent =
        `${completedTasks.length} completed`;
    
    if (pendingTasks.length === 0) {
        pendingList.innerHTML =
            createEmptyState(
                "🌱",
                "No pending tasks",
                "You're all caught up!"
            );
    }
    if (completedTasks.length === 0) {
        completedList.innerHTML =
            createEmptyState(
                "✨",
                "No completed tasks",
                "Complete a task and it will appear here."
            );
    }
    
    pendingTasks.forEach(task => {
        pendingList.appendChild(
            createTaskElement(task)
        );
    });
    
    completedTasks.forEach(task => {
        completedList.appendChild(
            createTaskElement(task)
        );
    });
}
function createEmptyState(
    icon,
    title,
    message
) {
    const div =
        document.createElement("div");
    div.className = "empty-state";
    div.innerHTML = `
        <div class="empty-icon">
            ${icon}
        </div>
        <p>${title}</p>
        <small>
            ${message}
        </small>
    `;
    return div;
}
function createTaskElement(task) {
    const article =
        document.createElement("article");
    article.className =
        `task-card ${
            task.completed
                ? "completed"
                : ""
        }`;
    article.dataset.id = task.id;
    const priorityName =
        task.priority;
    const categoryName =
        task.category;
    article.innerHTML = `
        <div class="task-top">
            <button
                class="complete-btn"
                title="Mark complete"
                aria-label="Complete task">
                ${
                    task.completed
                        ? "✓"
                        : ""
                }
            </button>
            <div class="task-content">
                <div class="task-text">
                    ${escapeHTML(task.text)}
                </div>
                <div class="task-meta">
                    <span
                        class="priority priority-${priorityName}">
                        ${priorityName}
                    </span>
                    <span class="category">
                        ${getCategoryIcon(
                            categoryName
                        )}
                        ${capitalize(
                            categoryName
                        )}
                    </span>
                    <span class="time">
                        Added:
                        ${formatTime(
                            task.createdAt
                        )}
                    </span>
                    ${
                        task.completedAt
                            ? `
                                <span class="time">
                                    Completed:
                                    ${formatTime(
                                        task.completedAt
                                    )}
                                </span>
                              `
                            : ""
                    }
                </div>
            </div>
        </div>
        <div class="task-actions">
            <button
                class="action-btn edit-btn">
                ✏️ Edit
            </button>
            <button
                class="action-btn delete-btn">
                🗑️ Delete
            </button>
        </div>
    `;
    
    const completeBtn =
        article.querySelector(
            ".complete-btn"
        );
    completeBtn.addEventListener(
        "click",
        () => {
            toggleComplete(task.id);
        }
    );
    
    const editBtn =
        article.querySelector(
            ".edit-btn"
        );
    editBtn.addEventListener(
        "click",
        () => {
            editTask(
                task.id,
                article
            );
        }
    );

    const deleteBtn =
        article.querySelector(
            ".delete-btn"
        );
    deleteBtn.addEventListener(
        "click",
        () => {
            deleteTask(task.id);
        }
    );
    return article;
}
function toggleComplete(id) {
    tasks =
        tasks.map(task => {
            if (task.id === id) {
                const completed =
                    !task.completed;
                return {
                    ...task,
                    completed,
                    completedAt:
                        completed
                            ? new Date().toISOString()
                            : null
                };
            }
            return task;
        });
    saveTasks();
    renderTasks();
}
function editTask(
    id,
    article
) {
    const task =
        tasks.find(
            task => task.id === id
        );
    if (!task) {
        return;
    }
    const textElement =
        article.querySelector(
            ".task-text"
        );
    const oldText =
        task.text;
    const input =
        document.createElement("input");
    input.className =
        "edit-input";
    input.value =
        oldText;
    textElement.replaceWith(input);
    input.focus();
    input.select();
    function saveEdit() {
        const newText =
            input.value.trim();
        if (newText !== "") {
            task.text =
                newText;
            saveTasks();
        }
        renderTasks();
    }
    input.addEventListener(
        "keydown",
        event => {
            if (event.key === "Enter") {
                saveEdit();
            }
            if (event.key === "Escape") {
                renderTasks();
            }
        }
    );
    input.addEventListener(
        "blur",
        saveEdit
    );
}
function deleteTask(id) {
    tasks =
        tasks.filter(
            task => task.id !== id
        );
    saveTasks();
    renderTasks();
}
filterButtons.forEach(button => {
    button.addEventListener(
        "click",
        () => {
            filterButtons.forEach(btn => {
                btn.classList.remove(
                    "active"
                );
            });
            button.classList.add(
                "active"
            );
            currentFilter =
                button.dataset.filter;
            renderTasks();
        }
    );
});
function getCategoryIcon(
    category
) {
    switch (category) {
        case "work":
            return "💼";
        case "personal":
            return "🏠";
        case "shopping":
            return "🛒";
        case "study":
            return "🎓";
        default:
            return "📌";
    }
}
function capitalize(text) {
    return text.charAt(0)
        .toUpperCase()
        + text.slice(1);
}
function escapeHTML(text) {
    const div =
        document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
function loadTheme() {
    const savedTheme =
        localStorage.getItem(
            "taskflowTheme"
        );
    if (savedTheme === "dark") {
        document.body.classList.add(
            "dark"
        );
        themeToggle.textContent = "☀️";
    } else {
        themeToggle.textContent = "🌙";
    }
}
themeToggle.addEventListener(
    "click",
    () => {
        document.body.classList.toggle(
            "dark"
        );
        const isDark =
            document.body.classList.contains(
                "dark"
            );
        localStorage.setItem(
            "taskflowTheme",
            isDark
                ? "dark"
                : "light"
        );
        themeToggle.textContent =
            isDark
                ? "☀️"
                : "🌙";
    }
);
loadTheme();
renderTasks();