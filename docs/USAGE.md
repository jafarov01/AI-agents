# Usage Guide

> **📖 For complete reusable project setup, see [REUSABLE_PROJECT_GUIDE.md](REUSABLE_PROJECT_GUIDE.md)**

## Quick Start

### As Reusable Project Base
```bash
# Clone this repo as your new project foundation
git clone <your-gemini-agents-repo> my-new-project
cd my-new-project
rm -rf .git && git init

# Setup environment
cp .env.example .env  # Add your API keys
npm install
npm test  # Verify setup
```

### Create AI-Planned Project
```bash
npx ngen  # Interactive project creator
```

### Develop Features with TDD
```bash
node orchestrator.js "Add user authentication"
```

## Detailed Workflows

### Project Bootstrap Workflow

The bootstrap CLI will:
1. Ask for your product idea and preferences
2. Generate a comprehensive plan via Gemini AI
3. Create GitHub repository and issues
4. Scaffold project from templates
5. Set up CI/CD pipeline

**Example Session:**
```
? Describe your product: "A task management app for remote teams"
? Project name: team-tasks
? Preferred stack: node, react
? Create GitHub repo? Yes

✓ Generated 5-phase plan with 23 tickets
✓ Created GitHub repo: github.com/yourname/team-tasks
✓ Generated 23 GitHub issues
✓ Scaffolded NextJS project
✓ Set up CI/CD pipeline
```

### TDD Feature Development

The orchestrator implements Test-Driven Development:

1. **TesterAgent** writes failing tests
2. **CoderAgent** implements minimal code to pass tests
3. **ReviewerAgent** performs code review
4. Creates PR with AI review comments

**Example:**
```bash
node orchestrator.js "Add password reset functionality"
```

This will:
- Create feature branch `feature/add-password-reset-functionality`
- Generate comprehensive test suite
- Implement the feature code
- Run tests until passing
- Generate AI code review
- Create PR with review comments

### Manual Agent Usage

You can use individual agents programmatically:

```javascript
// Generate project architecture
import { generateArchitecture } from './lib/agents/architect.js';
const arch = await generateArchitecture("Real-time chat system");

// Break down large features
import { breakdownFeature } from './lib/agents/plannerAgent.js';
const tickets = await breakdownFeature("User authentication system");

// Write tests for existing code
import { writeFailingTest } from './lib/testerAgent.js';
const test = await writeFailingTest("Email validation function");
```

## Templates

### Node.js + Express
- REST API structure
- Jest testing setup
- Basic middleware
- Docker configuration

### Next.js
- Full-stack React app
- API routes
- Tailwind CSS
- Vercel deployment ready

### Python + Flask
- Web service structure
- Pytest testing
- Requirements management
- Docker configuration

## Environment Variables

Required in `.env`:
```bash
GEMINI_API_KEY=your_gemini_api_key
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=your_github_username

# Optional model configuration
BIG_MODEL=gemini-1.5-pro-latest
SMALL_MODEL=gemini-1.5-flash-latest
```

## Reusable Project Workflows

### 1. Clone as Project Base
```bash
git clone <your-repo-url> new-project-name
cd new-project-name
rm -rf .git && git init
cp .env.example .env  # Add your API keys
```

### 2. AI Project Planning
```bash
npx ngen  # Creates full project with GitHub issues
```

### 3. Feature Development
```bash
node orchestrator.js "Feature description"  # TDD workflow
```

### 4. Manual Agent Usage
```javascript
// Use individual agents programmatically
import { generateArchitecture } from './lib/agents/architectAgent.js';
const arch = await generateArchitecture("System description");
```

## Best Practices

1. **Start Small**: Begin with MVP features, let AI plan the roadmap
2. **Review AI Output**: Always review generated code and tests
3. **Iterate**: Use the orchestrator for incremental feature development
4. **Customize Templates**: Modify templates for your specific needs
5. **Monitor Costs**: Gemini API usage scales with project complexity
6. **Version Control**: Commit after each orchestrator run
7. **Team Setup**: Share .env.example and setup instructions