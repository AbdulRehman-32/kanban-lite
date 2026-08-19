# Task Flow - Interactive Task Board ("Kanban Lite")

A responsive, feature-rich interactive Kanban task board built using vanilla **HTML5**, **CSS3**, and **JavaScript (ES6+)**.

---

## 🚀 Features

### 1. Core Functionality
- **Add Tasks**: Form allowing users to enter a task title, description, category (*Development*, *Design*, *Marketing*, *Research*, *General*), and priority (*Low*, *Medium*, *High*).
- **Move Tasks**: Update task progress across three stages: **To Do**, **In Progress**, and **Completed** using either:
  - The intuitive status dropdown on each card.
  - Native **HTML5 Drag and Drop** between columns.
- **Delete Tasks**: Instantly remove any task from the board.
- **LocalStorage Persistence**: All tasks, status updates, and theme preferences persist seamlessly across page refreshes.

### 2. User Interface & Search
- **Responsive Layout**: Mobile-first design that adapts across mobile, tablet, and multi-column desktop screens.
- **Color-Coded Priority Indicators**:
  - 🔴 **High Priority**: Red / Coral accent and badge
  - 🟡 **Medium Priority**: Amber accent and badge
  - 🟢 **Low Priority**: Green / Emerald accent and badge
- **Live Search**: Instant keyword filtering across task titles and descriptions.
- **Category & Priority Filters**: Quick filtering dropdowns with a single-click reset button.
- **Empty States**: Clear visual feedback when a column contains no matching tasks.

### 3. Stretch / Bonus Features
- **Drag & Drop**: Native HTML5 Drag and Drop API with drop zone hover feedback.
- **Dark Mode**: Smooth light/dark theme switch with saved preference.
- **Dynamic Task Counters**: Real-time counter per column and global active vs. completed task stats.

---

## 🛠️ Tech Stack & Structure

- **HTML5**: Semantic elements (`<header>`, `<main>`, `<section>`, `<article>`), accessible forms and ARIA attributes.
- **CSS3**: Custom properties (CSS variables) for light/dark theming, CSS Grid & Flexbox, smooth transitions.
- **JavaScript (ES6+)**: Pure vanilla JS with DOM manipulation, state management, event delegation, and XSS sanitization.

### Project Files
```text
task 4/
├── index.html        # Markup and structure
├── styles.css        # Responsive styling and themes (Light & Dark)
├── script.js         # State management, drag & drop, and DOM handling
└── README.md         # Documentation & deployment guide
```

---

## 🌐 Live Deployment Guide (GitHub Pages)

To publish this project live using **GitHub Pages**:

1. **Create / Fork a Repository on GitHub**:
   - Create a new public repository on [GitHub](https://github.com/) (e.g., `interactive-task-board`).
2. **Push the Project Files**:
   - Initialize git and push `index.html`, `styles.css`, `script.js`, and `README.md` to the `main` branch.
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Interactive Task Board"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
3. **Enable GitHub Pages**:
   - Open your repository on GitHub.
   - Go to **Settings** > **Pages** (in the left sidebar).
   - Under **Build and deployment** > **Branch**, select `main` branch and `/ (root)` folder.
   - Click **Save**.
4. **Access Your Live Application**:
   - Your site will be published at: `https://<your-username>.github.io/<your-repo-name>/`
