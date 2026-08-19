/**
 * Interactive Task Board
 * Plain JavaScript (ES6+) State Management & Interactivity
 */

// Default tasks for first-time load
const DEFAULT_TASKS = [
  {
    id: '1',
    title: 'Design UI Mockups',
    description: 'Create clean wireframes and responsive layout for the dashboard.',
    category: 'Design',
    priority: 'High',
    status: 'todo'
  },
  {
    id: '2',
    title: 'Implement Kanban Drag and Drop',
    description: 'Use native HTML5 Drag and Drop API to move tasks between columns.',
    category: 'Development',
    priority: 'High',
    status: 'in-progress'
  },
  {
    id: '3',
    title: 'Setup GitHub Pages Deployment',
    description: 'Configure repository settings and publish live static site.',
    category: 'General',
    priority: 'Medium',
    status: 'completed'
  }
];

// Application state
let tasks = [];
const STORAGE_KEY = 'tasks_data';
const THEME_KEY = 'site_theme';

// DOM elements
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

const lists = {
  'todo': document.getElementById('list-todo'),
  'in-progress': document.getElementById('list-in-progress'),
  'completed': document.getElementById('list-completed')
};

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

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      tasks = JSON.parse(saved);
    } else {
      tasks = [...DEFAULT_TASKS];
      saveTasks();
    }
  } catch (err) {
    console.error('Error loading tasks:', err);
    tasks = [...DEFAULT_TASKS];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Error saving tasks:', err);
  }
}

function setupEventListeners() {
  taskForm.addEventListener('submit', handleAddTask);

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

  categoryFilter.addEventListener('change', renderTasks);
  priorityFilter.addEventListener('change', renderTasks);

  resetFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.classList.remove('visible');
    categoryFilter.value = 'All';
    priorityFilter.value = 'All';
    renderTasks();
  });

  themeToggleBtn.addEventListener('click', toggleTheme);
}

// ==========================================================================
// Theme
// ==========================================================================
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
}

// ==========================================================================
// Task CRUD
// ==========================================================================
function handleAddTask(e) {
  e.preventDefault();

  const title = taskTitle.value.trim();
  const description = taskDescription.value.trim();
  const category = taskCategory.value;
  const priority = taskPriority.value;

  if (!title || !category || !priority) return;

  const newTask = {
    id: 't_' + Date.now(),
    title,
    description,
    category,
    priority,
    status: 'todo'
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();

  taskForm.reset();
  taskTitle.focus();
}

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

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// ==========================================================================
// Rendering
// ==========================================================================
function renderTasks() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedPriority = priorityFilter.value;

  // Clear lists
  Object.values(lists).forEach(list => {
    if (list) list.innerHTML = '';
  });

  const counts = { 'todo': 0, 'in-progress': 0, 'completed': 0 };

  // Filter
  const filtered = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm) || 
      (task.description && task.description.toLowerCase().includes(searchTerm));
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Render cards
  filtered.forEach(task => {
    if (counts[task.status] !== undefined) {
      counts[task.status]++;
    }
    const card = createTaskCard(task);
    if (lists[task.status]) {
      lists[task.status].appendChild(card);
    }
  });

  // Update counts
  document.getElementById('count-todo').textContent = counts['todo'];
  document.getElementById('count-in-progress').textContent = counts['in-progress'];
  document.getElementById('count-completed').textContent = counts['completed'];

  // Empty state messages
  ['todo', 'in-progress', 'completed'].forEach(status => {
    if (emptyMessages[status]) {
      emptyMessages[status].classList.toggle('visible', counts[status] === 0);
    }
  });

  // Stats in header
  const totalActive = counts['todo'] + counts['in-progress'];
  const totalCompleted = counts['completed'];
  document.getElementById('stat-active').textContent = totalActive;
  document.getElementById('stat-completed').textContent = totalCompleted;
}

function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.setAttribute('data-id', task.id);
  card.setAttribute('data-priority', task.priority);
  card.setAttribute('draggable', 'true');

  card.addEventListener('dragstart', handleDragStart);
  card.addEventListener('dragend', handleDragEnd);

  const priorityClass = `tag-priority-${task.priority.toLowerCase()}`;

  card.innerHTML = `
    <div class="card-top">
      <span class="tag ${priorityClass}">${escapeHtml(task.priority)}</span>
      <span class="tag tag-category">${escapeHtml(task.category)}</span>
    </div>
    
    <div class="task-title">${escapeHtml(task.title)}</div>
    
    ${task.description ? `<div class="task-desc">${escapeHtml(task.description)}</div>` : ''}
    
    <div class="card-bottom">
      <select class="status-select" aria-label="Change status" data-id="${task.id}">
        <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>To Do</option>
        <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
        <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
      </select>
      
      <button type="button" class="btn-delete" data-id="${task.id}">Delete</button>
    </div>
  `;

  const statusSelect = card.querySelector('.status-select');
  statusSelect.addEventListener('change', (e) => {
    updateTaskStatus(task.id, e.target.value);
  });

  const deleteBtn = card.querySelector('.btn-delete');
  deleteBtn.addEventListener('click', () => {
    deleteTask(task.id);
  });

  return card;
}

// ==========================================================================
// Drag and Drop
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

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
