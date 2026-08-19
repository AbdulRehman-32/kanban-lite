/**
 * Interactive Task Board - Kanban Lite
 * Clean Vanilla JavaScript (ES6+) State Management & Interactivity
 */

// Initial Seed Tasks (shown when local storage is empty)
const DEFAULT_TASKS = [
  {
    id: '1',
    title: 'Design UI Mockups in Figma',
    description: 'Create high-fidelity wireframes and mobile responsive layouts for the dashboard.',
    category: 'Design',
    priority: 'High',
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Implement Kanban Drag and Drop',
    description: 'Use native HTML5 Drag and Drop API to move cards smoothly between columns.',
    category: 'Development',
    priority: 'High',
    status: 'in-progress',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Setup GitHub Pages Deployment',
    description: 'Configure repository settings and publish live static build on GitHub Pages.',
    category: 'Marketing',
    priority: 'Medium',
    status: 'completed',
    createdAt: new Date().toISOString()
  }
];

// Application State
let tasks = [];
const STORAGE_KEY = 'kanban_tasks';
const THEME_KEY = 'kanban_theme';

// DOM Element References
const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const taskDescription = document.getElementById('task-description');
const taskCategory = document.getElementById('task-category');
const taskPriority = document.getElementById('task-priority');

const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search-btn');
const categoryFilter = document.getElementById('category-filter');
const priorityFilter = document.getElementById('priority-filter');
const resetFiltersBtn = document.getElementById('reset-filters-btn');

const themeToggleBtn = document.getElementById('theme-toggle-btn');
const boardContainer = document.getElementById('kanban-board');

// Column Task Lists
const lists = {
  'todo': document.getElementById('list-todo'),
  'in-progress': document.getElementById('list-in-progress'),
  'completed': document.getElementById('list-completed')
};

// Column Empty State Indicators
const emptyMessages = {
  'todo': document.getElementById('empty-todo'),
  'in-progress': document.getElementById('empty-in-progress'),
  'completed': document.getElementById('empty-completed')
};

// ==========================================================================
// Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadTasks();
  setupEventListeners();
  setupDragAndDrop();
  renderTasks();
});

/**
 * Load tasks from LocalStorage or initialize with defaults
 */
function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      tasks = JSON.parse(saved);
    } else {
      tasks = [...DEFAULT_TASKS];
      saveTasks();
    }
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    tasks = [...DEFAULT_TASKS];
  }
}

/**
 * Save current tasks array to LocalStorage
 */
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
}

/**
 * Setup Event Listeners for Forms & Filters
 */
function setupEventListeners() {
  // Form submission
  taskForm.addEventListener('submit', handleAddTask);

  // Search input & clear button
  searchInput.addEventListener('input', () => {
    clearSearchBtn.classList.toggle('visible', searchInput.value.trim().length > 0);
    renderTasks();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.classList.remove('visible');
    searchInput.focus();
    renderTasks();
  });

  // Filter dropdowns
  categoryFilter.addEventListener('change', renderTasks);
  priorityFilter.addEventListener('change', renderTasks);

  // Reset Filters
  resetFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.classList.remove('visible');
    categoryFilter.value = 'All';
    priorityFilter.value = 'All';
    renderTasks();
  });

  // Theme Toggle Button
  themeToggleBtn.addEventListener('click', toggleTheme);
}

// ==========================================================================
// Theme Management (Light / Dark Mode)
// ==========================================================================
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    // Check user system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = prefersDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', initialTheme);
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
}

// ==========================================================================
// Task CRUD Operations
// ==========================================================================

/**
 * Handle new task submission
 */
function handleAddTask(e) {
  e.preventDefault();

  const title = taskTitle.value.trim();
  const description = taskDescription.value.trim();
  const category = taskCategory.value;
  const priority = taskPriority.value;

  if (!title || !category || !priority) {
    return;
  }

  const newTask = {
    id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    title,
    description,
    category,
    priority,
    status: 'todo',
    createdAt: new Date().toISOString()
  };

  tasks.unshift(newTask); // Add to beginning
  saveTasks();
  renderTasks();

  // Reset form
  taskForm.reset();
  taskTitle.focus();
}

/**
 * Update task status (To Do / In Progress / Completed)
 */
function updateTaskStatus(id, newStatus) {
  const validStatuses = ['todo', 'in-progress', 'completed'];
  if (!validStatuses.includes(newStatus)) return;

  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, status: newStatus };
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

/**
 * Delete a task by ID
 */
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// ==========================================================================
// Rendering & Filtering
// ==========================================================================

/**
 * Render all tasks to their respective columns based on filters
 */
function renderTasks() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedPriority = priorityFilter.value;

  // Clear all column lists
  Object.values(lists).forEach(list => {
    if (list) list.innerHTML = '';
  });

  // Track counts
  const counts = { 'todo': 0, 'in-progress': 0, 'completed': 0 };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm) || 
      (task.description && task.description.toLowerCase().includes(searchTerm));
    
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Populate columns with filtered task cards
  filteredTasks.forEach(task => {
    if (counts[task.status] !== undefined) {
      counts[task.status]++;
    }
    const card = createTaskCard(task);
    if (lists[task.status]) {
      lists[task.status].appendChild(card);
    }
  });

  // Update Column Count Badges
  document.getElementById('count-todo').textContent = counts['todo'];
  document.getElementById('count-in-progress').textContent = counts['in-progress'];
  document.getElementById('count-completed').textContent = counts['completed'];

  // Update Empty State Messages
  ['todo', 'in-progress', 'completed'].forEach(status => {
    if (emptyMessages[status]) {
      emptyMessages[status].classList.toggle('visible', counts[status] === 0);
    }
  });

  // Update Header Stats (Active vs Completed)
  const totalActive = counts['todo'] + counts['in-progress'];
  const totalCompleted = counts['completed'];
  const activeStatEl = document.getElementById('stat-active');
  const completedStatEl = document.getElementById('stat-completed');
  if (activeStatEl) activeStatEl.textContent = totalActive;
  if (completedStatEl) completedStatEl.textContent = totalCompleted;
}

/**
 * Create DOM element for a task card
 */
function createTaskCard(task) {
  const card = document.createElement('article');
  card.className = 'task-card';
  card.setAttribute('data-id', task.id);
  card.setAttribute('data-priority', task.priority);
  card.setAttribute('draggable', 'true');
  card.setAttribute('tabindex', '0');

  // Drag start & end events on card
  card.addEventListener('dragstart', handleDragStart);
  card.addEventListener('dragend', handleDragEnd);

  const priorityBadgeClass = `badge-priority-${task.priority.toLowerCase()}`;

  card.innerHTML = `
    <div class="task-card-header">
      <div class="badge-group">
        <span class="badge ${priorityBadgeClass}">${escapeHtml(task.priority)}</span>
        <span class="badge badge-category" data-category="${escapeHtml(task.category)}">${escapeHtml(task.category)}</span>
      </div>
    </div>
    
    <h3 class="task-card-title">${escapeHtml(task.title)}</h3>
    
    ${task.description ? `<p class="task-card-desc">${escapeHtml(task.description)}</p>` : ''}
    
    <div class="task-card-footer">
      <select class="status-select" aria-label="Change status of ${escapeHtml(task.title)}" data-id="${task.id}">
        <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>To Do</option>
        <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
        <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
      </select>
      
      <button type="button" class="btn-delete" data-id="${task.id}" title="Delete task" aria-label="Delete task: ${escapeHtml(task.title)}">
        Delete
      </button>
    </div>
  `;

  // Attach event listener for status select
  const statusSelect = card.querySelector('.status-select');
  statusSelect.addEventListener('change', (e) => {
    updateTaskStatus(task.id, e.target.value);
  });

  // Attach event listener for delete button
  const deleteBtn = card.querySelector('.btn-delete');
  deleteBtn.addEventListener('click', () => {
    deleteTask(task.id);
  });

  return card;
}

// ==========================================================================
// HTML5 Drag and Drop API
// ==========================================================================
let draggedTaskId = null;

function handleDragStart(e) {
  draggedTaskId = this.getAttribute('data-id');
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', draggedTaskId);
}

function handleDragEnd() {
  this.classList.remove('dragging');
  draggedTaskId = null;

  // Remove drag-over class from all columns
  document.querySelectorAll('.column').forEach(col => {
    col.classList.remove('drag-over');
  });
}

function setupDragAndDrop() {
  const columns = document.querySelectorAll('.column');

  columns.forEach(column => {
    const targetStatus = column.getAttribute('data-status');

    column.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      column.classList.add('drag-over');
    });

    column.addEventListener('dragenter', (e) => {
      e.preventDefault();
      column.classList.add('drag-over');
    });

    column.addEventListener('dragleave', (e) => {
      // Only remove if leaving the column boundary
      if (!column.contains(e.relatedTarget)) {
        column.classList.remove('drag-over');
      }
    });

    column.addEventListener('drop', (e) => {
      e.preventDefault();
      column.classList.remove('drag-over');
      
      const id = e.dataTransfer.getData('text/plain') || draggedTaskId;
      if (id && targetStatus) {
        updateTaskStatus(id, targetStatus);
      }
    });
  });
}

// ==========================================================================
// Security & Utilities
// ==========================================================================
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
