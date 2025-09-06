# API Reference

## Core Functions

### Gemini Client (`lib/gemini.js`)

#### `callGemini(prompt, model)`
Makes API call to Gemini AI model.

**Parameters:**
- `prompt` (string): The prompt to send to Gemini
- `model` (string, optional): Model name (default: "gemini-2.5-flash")

**Returns:** Promise<string> - AI response text

**Example:**
```javascript
import { callGemini } from './lib/gemini.js';
const response = await callGemini("Explain async/await", "gemini-1.5-pro-latest");
```

### GitHub Integration (`lib/github.js`)

#### `createRepoIfNotExists(owner, name, isPrivate)`
Creates GitHub repository if it doesn't exist.

**Parameters:**
- `owner` (string): GitHub username
- `name` (string): Repository name  
- `isPrivate` (boolean): Whether repo should be private

**Returns:** Promise<object> - Repository data or true if exists

#### `createIssue(owner, repo, title, body)`
Creates a GitHub issue.

**Parameters:**
- `owner` (string): Repository owner
- `repo` (string): Repository name
- `title` (string): Issue title
- `body` (string): Issue description

**Returns:** Promise<object> - Issue data

## AI Agents

### PlannerAgent (`lib/agents/plannerAgent.js`)

#### `generateProductPlan(productIdea, stackHints)`
Generates comprehensive project plan with phases and tickets.

**Parameters:**
- `productIdea` (string): Description of the product
- `stackHints` (string, optional): Preferred technologies

**Returns:** Promise<object>
```javascript
{
  stack: "Node.js, React, PostgreSQL",
  phases: [
    {
      name: "Discovery",
      description: "Research and planning phase",
      duration_weeks: 2,
      tickets: [
        {
          title: "User research",
          desc: "Conduct user interviews",
          priority: "high",
          type: "task"
        }
      ]
    }
  ],
  architecture_notes: "Microservices with API gateway"
}
```

#### `breakdownFeature(featureDescription)`
Breaks large feature into smaller tickets.

**Parameters:**
- `featureDescription` (string): Feature to break down

**Returns:** Promise<Array<object>>
```javascript
[
  {
    title: "Create user model",
    desc: "Define user schema and validation",
    acceptance_criteria: ["Schema defined", "Validation rules"],
    estimated_hours: 4,
    dependencies: [],
    type: "feature"
  }
]
```

### ArchitectAgent (`lib/agents/architectAgent.js`)

#### `generateArchitecture(featureDescription)`
Creates technical architecture plan.

**Parameters:**
- `featureDescription` (string): Feature to architect

**Returns:** Promise<object>
```javascript
{
  file_structure: [
    "src/controllers/userController.js",
    "src/services/userService.js"
  ],
  system_diagram: "graph TD; A[Client] --> B[API]",
  technical_summary: "RESTful API with service layer"
}
```

### TesterAgent (`lib/agents/testerAgent.js`)

#### `writeFailingTest(featureDescription)`
Generates comprehensive test suite.

**Parameters:**
- `featureDescription` (string): Feature to test

**Returns:** Promise<object>
```javascript
{
  filename: "tests/user.test.js",
  code: "describe('User', () => { test('should create user', () => { ... }) })"
}
```

### CoderAgent (`lib/agents/coderAgent.js`)

#### `implementCode(testContent, existingFiles)`
Implements code to make tests pass.

**Parameters:**
- `testContent` (string): Test code that should pass
- `existingFiles` (string, optional): Existing codebase context

**Returns:** Promise<object>
```javascript
{
  filename: "src/user.js",
  code: "class User { constructor(name) { this.name = name; } }"
}
```

### ReviewerAgent (`lib/agents/reviewerAgent.js`)

#### `reviewCodeAndTests(code, tests)`
Performs AI code review.

**Parameters:**
- `code` (string): Implementation code
- `tests` (string): Test code

**Returns:** Promise<object>
```javascript
{
  checklist: [
    "✓ Code follows naming conventions",
    "⚠ Missing error handling for edge cases"
  ],
  suggested_fixes: "Add try-catch blocks for async operations"
}
```

## Orchestrator (`orchestrator.js`)

#### `runFeatureFlow(featureName, maxIterations)`
Runs complete TDD workflow for a feature.

**Parameters:**
- `featureName` (string): Feature description
- `maxIterations` (number, optional): Max coding attempts (default: 3)

**Returns:** Promise<string> - PR URL

**Example:**
```javascript
import { runFeatureFlow } from './orchestrator.js';
const prUrl = await runFeatureFlow("User authentication", 5);
console.log(`PR created: ${prUrl}`);
```