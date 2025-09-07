# Todo Web App Example

Complete walkthrough of building a todo web app using Gemini Agents.

## Overview

This example shows how to use the AI agents to build a modern todo web application from scratch, including:
- Beautiful UI with React and Tailwind CSS
- Local storage for persistence
- Task management (add, edit, delete, complete)
- Responsive design

## Step-by-Step Walkthrough

### 1. Initial Setup

**Dependencies Required:**
- ✅ Node.js 18+ installed
- ✅ Git configured with your credentials
- ✅ GitHub personal access token with `repo` and `workflow` scopes
- ✅ Gemini API key from Google AI Studio

```bash
# Clone gemini-agents as your project base
git clone <your-gemini-agents-repo> todo-web-app
cd todo-web-app
rm -rf .git && git init

# Setup environment
cp .env.example .env
# Edit .env with your API keys:
# GEMINI_API_KEY=your_key_from_google_ai_studio
# GITHUB_TOKEN=your_token_with_repo_workflow_scopes  
# GITHUB_OWNER=your_github_username

npm install
npm test  # Verify setup works
```

**⚠️ Common Setup Issues:**
- **403 GitHub Error**: Token needs `repo` and `workflow` scopes
- **API Key Error**: Verify GEMINI_API_KEY is correct
- **Missing GITHUB_OWNER**: Must match your exact GitHub username

### 2. AI Project Planning & GitHub Integration

```bash
npx ngen
```

**Prompts and Responses:**
```
? Describe your product: "A beautiful todo web app with modern UI, task management, and local storage persistence"
? Project name: todo-web-app
? Preferred stack: react, tailwind
? Create GitHub repo? Yes
```

**What happens automatically:**
1. 🤖 AI generates comprehensive project plan
2. 📁 Creates GitHub repository: `github.com/your-username/todo-web-app`
3. 🔗 Sets up remote origin connection
4. 📋 Creates GitHub Issues with detailed tickets
5. 🏗️ Scaffolds React project with Tailwind
6. ⚙️ Sets up CI/CD pipeline

**Generated GitHub Issues (with proper SDLC):**
- **Issue #1**: [Setup] Initialize React project with Tailwind CSS
- **Issue #2**: [Component] Create TodoItem component with tests
- **Issue #3**: [Component] Create TodoList component with tests
- **Issue #4**: [Feature] Add task creation functionality
- **Issue #5**: [Feature] Implement task editing capability
- **Issue #6**: [Feature] Add task deletion functionality
- **Issue #7**: [Feature] Implement task completion toggle
- **Issue #8**: [Integration] Add local storage persistence
- **Issue #9**: [UI/UX] Create responsive layout design
- **Issue #10**: [Feature] Add task filtering (all/active/completed)

### 3. Ticket-Based Development (Proper SDLC)

Now you work through tickets systematically:

#### Ticket #1: Project Setup

**Dependencies Check:**
- ✅ GITHUB_REPO environment variable set
- ✅ Current directory is the project root
- ✅ GitHub issue #1 exists in the repository

```bash
node orchestrator.js "#1"
```

**What happens:**
- 🔍 Fetches GitHub Issue #1 via API
- 🏷️ Updates issue label to "in-progress"
- 🌿 Creates feature branch: `feature/issue-1-setup-react-tailwind`
- 🧪 Generates comprehensive setup tests
- 💻 Implements React + Tailwind configuration
- ✅ Runs tests until passing (max 3 iterations)
- 👀 AI code review with suggestions
- 🔀 Creates PR that closes Issue #1
- 🏷️ Updates issue label to "ready-for-review"

#### Ticket #2: TodoItem Component

```bash
node orchestrator.js "#2"
```

**Each ticket generates:**
- ✅ Feature branch: `feature/issue-2-todoitem-component`
- ✅ Comprehensive tests that initially fail
- ✅ Implementation code to pass tests
- ✅ AI code review with suggestions
- ✅ PR linked to GitHub Issue #2
- ✅ CI/CD pipeline execution

**TodoItem.jsx (AI Generated):**
```jsx
import React from 'react';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-2">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
      />
      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
        {todo.text}
      </span>
      <button
        onClick={() => onEdit(todo.id)}
        className="mr-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(todo.id)}
        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
      >
        Delete
      </button>
    </div>
  );
};

export default TodoItem;
```

**AI Code Review:**
```
✓ Component follows React best practices
✓ Tailwind classes properly applied
✓ Accessibility considerations included
✓ Props validation could be added
⚠ Missing PropTypes for type checking
```

#### Ticket #3: TodoList Component

```bash
node orchestrator.js "#3"
```

#### Ticket #4: Task Creation

```bash
node orchestrator.js "#4"
```

**Generated Files:**
```
src/
├── hooks/
│   └── useTodos.js
├── components/
│   ├── AddTodoForm.jsx
│   └── EditTodoModal.jsx
└── tests/
    ├── useTodos.test.js
    └── AddTodoForm.test.js
```

**useTodos.js (AI Generated):**
```javascript
import { useState, useCallback } from 'react';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const addTodo = useCallback((text) => {
    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTodos(prev => [...prev, newTodo]);
  }, []);

  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const editTodo = useCallback((id, newText) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, text: newText.trim() } : todo
    ));
    setEditingId(null);
  }, []);

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    editingId,
    setEditingId
  };
};
```

#### Tickets #5-7: CRUD Operations

```bash
node orchestrator.js "#5"  # Task editing
node orchestrator.js "#6"  # Task deletion  
node orchestrator.js "#7"  # Task completion
```

#### Ticket #8: Local Storage

```bash
node orchestrator.js "#8"
```

**Enhanced useTodos.js:**
```javascript
import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'todos-app-data';

export const useTodos = () => {
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever todos change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Failed to save todos:', error);
    }
  }, [todos]);

  // ... rest of the hook remains the same
};
```

#### Tickets #9-10: UI Polish

```bash
node orchestrator.js "#9"   # Responsive design
node orchestrator.js "#10"  # Task filtering
```

**Generated TodoApp.jsx:**
```jsx
import React, { useState } from 'react';
import { useTodos } from '../hooks/useTodos';
import TodoList from './TodoList';
import AddTodoForm from './AddTodoForm';

const TodoApp = () => {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo } = useTodos();
  const [filter, setFilter] = useState('all');

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Todo App
        </h1>
        
        <AddTodoForm onAdd={addTodo} />
        
        <div className="flex justify-center space-x-4 mb-6">
          {['all', 'active', 'completed'].map(filterType => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg capitalize ${
                filter === filterType
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {filterType} ({filterType === 'all' ? todos.length : 
                filterType === 'active' ? activeCount : completedCount})
            </button>
          ))}
        </div>

        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />

        {todos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No todos yet. Add one above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoApp;
```

### 4. Final Project Structure

After all AI-generated development:

```
todo-web-app/
├── src/
│   ├── components/
│   │   ├── TodoApp.jsx
│   │   ├── TodoList.jsx
│   │   ├── TodoItem.jsx
│   │   ├── AddTodoForm.jsx
│   │   └── EditTodoModal.jsx
│   ├── hooks/
│   │   └── useTodos.js
│   ├── styles/
│   │   └── globals.css
│   └── App.js
├── tests/
│   ├── TodoApp.test.js
│   ├── TodoList.test.js
│   ├── TodoItem.test.js
│   ├── AddTodoForm.test.js
│   └── useTodos.test.js
├── public/
├── package.json
└── README.md
```

### 5. Testing Results

All AI-generated tests pass:
```bash
npm test

PASS tests/useTodos.test.js
PASS tests/TodoItem.test.js  
PASS tests/TodoList.test.js
PASS tests/AddTodoForm.test.js
PASS tests/TodoApp.test.js

Test Suites: 5 passed, 5 total
Tests: 23 passed, 23 total
Coverage: 95.2% statements, 91.8% branches
```

### 6. Deployment

The AI also generated deployment configuration:

```bash
# Vercel deployment (included in template)
npm run build
npx vercel --prod

# Or Netlify
npm run build
npx netlify deploy --prod --dir=build
```

## Key Features Delivered

✅ **Beautiful UI**: Modern design with Tailwind CSS
✅ **Task Management**: Add, edit, delete, complete todos
✅ **Local Storage**: Persistent data across browser sessions  
✅ **Filtering**: View all, active, or completed tasks
✅ **Responsive**: Works on desktop and mobile
✅ **Tested**: 95%+ test coverage with comprehensive test suite
✅ **Deployed**: Ready for production deployment

## Proper SDLC Workflow

### Phase 1: Planning & Setup
1. **PlannerAgent** generates roadmap and creates GitHub issues
2. **GitHub Integration** creates repo and sets remote origin
3. **Template System** scaffolds initial project structure

### Phase 2: Ticket-Based Development
```bash
# Work through tickets systematically
node orchestrator.js "#1"  # Setup
node orchestrator.js "#2"  # TodoItem component
node orchestrator.js "#3"  # TodoList component
# ... continue through all tickets
```

### Phase 3: Each Ticket Follows TDD
For every ticket:
1. **TesterAgent** writes failing tests based on GitHub issue
2. **CoderAgent** implements minimal code to pass tests
3. **ReviewerAgent** performs code review
4. **GitHub Integration** creates PR linked to issue
5. **CI/CD Pipeline** runs automated tests
6. **Issue Management** updates ticket status

## How GitHub Integration Works

**The `npx ngen` command:**
1. Creates GitHub repo via API
2. Sets up `git remote add origin <repo-url>`
3. Creates detailed GitHub issues with acceptance criteria
4. Links local project to remote repository

**The `orchestrator.js "#N"` command:**
1. Fetches GitHub issue details via API
2. Uses issue description as development context
3. Creates feature branch: `feature/issue-N-description`
4. Implements TDD workflow
5. Creates PR that closes the issue
6. Updates issue with progress/completion

## Complete Development Flow

**Prerequisites:**
- ✅ All environment variables set in `.env`
- ✅ GitHub repo created with issues
- ✅ Working directory is project root
- ✅ Git remote origin configured

```bash
# 1. Planning Phase
npx ngen
# ✓ Validates: GEMINI_API_KEY, GITHUB_TOKEN, GITHUB_OWNER
# ✓ Creates GitHub repo with remote origin (HTTPS)
# ✓ Generates 10 detailed GitHub issues with acceptance criteria
# ✓ Scaffolds React project with proper structure
# ✓ Creates .env file with GITHUB_REPO variable

# 2. Development Phase (work through tickets systematically)
node orchestrator.js "#1"   # ✓ Setup & configuration
# Dependencies: GITHUB_REPO, issue #1 exists

node orchestrator.js "#2"   # ✓ TodoItem component + tests
# Dependencies: Previous ticket merged, clean working directory

node orchestrator.js "#3"   # ✓ TodoList component + tests
node orchestrator.js "#4"   # ✓ Add task functionality
node orchestrator.js "#5"   # ✓ Edit task functionality
node orchestrator.js "#6"   # ✓ Delete task functionality
node orchestrator.js "#7"   # ✓ Toggle completion
node orchestrator.js "#8"   # ✓ Local storage persistence
node orchestrator.js "#9"   # ✓ Responsive design
node orchestrator.js "#10"  # ✓ Task filtering

# 3. Each ticket automatically:
# ✓ Fetches GitHub issue details via API
# ✓ Creates feature branch: feature/issue-N-description
# ✓ Updates issue label to "in-progress"
# ✓ Writes comprehensive tests based on issue description
# ✓ Implements code to pass tests (max 3 iterations)
# ✓ Performs AI code review with checklist
# ✓ Creates PR that references and closes the issue
# ✓ Updates issue label to "ready-for-review"
# ✓ Ready for CI/CD pipeline and manual review
```

## Dependency Validation

The agents now include comprehensive dependency checking:

**Bootstrap (`npx ngen`) validates:**
- ✅ GEMINI_API_KEY (from Google AI Studio)
- ✅ GITHUB_TOKEN (with repo + workflow scopes)
- ✅ GITHUB_OWNER (your GitHub username)

**Orchestrator (`node orchestrator.js "#N"`) validates:**
- ✅ All bootstrap dependencies
- ✅ GITHUB_REPO (set automatically by bootstrap)
- ✅ GitHub issue #N exists
- ✅ Working directory is project root
- ✅ Git remote origin configured

**Error Messages Guide:**
- `Missing GITHUB_TOKEN`: Create token at https://github.com/settings/tokens
- `403 Forbidden`: Token needs `repo` and `workflow` scopes
- `Issue #N not found`: Run `npx ngen` first to create issues
- `GITHUB_REPO missing`: Ensure you're in the project directory with `.env` file

## Benefits of This Approach

✅ **Proper SDLC**: Each feature is a tracked GitHub issue
✅ **Test-Driven**: Every ticket starts with failing tests
✅ **Code Review**: AI reviews every implementation
✅ **Traceability**: Clear link between issues, PRs, and code
✅ **CI/CD Ready**: Automated testing and deployment
✅ **Team Collaboration**: GitHub issues enable team coordination

**Time Saved**: Traditional 20-30 hours → AI-assisted 2-3 hours

This demonstrates how Gemini Agents implement proper software development lifecycle with AI automation while maintaining professional development practices.