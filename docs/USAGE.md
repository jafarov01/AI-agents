# Usage Guide

## Quick Commands

```bash
# Setup new project
git clone <this-repo> my-project && cd my-project
cp .env.example .env && npm install

# Create AI-planned project
npx ngen

# Develop features with TDD
node orchestrator.js "Add user authentication"
```

## Workflows

### 1. Project Bootstrap (`npx ngen`)
- AI generates comprehensive plan
- Creates GitHub repo and issues
- Scaffolds from templates
- Sets up CI/CD

### 2. TDD Feature Development (`node orchestrator.js`)
- **TesterAgent** writes failing tests
- **CoderAgent** implements code to pass tests
- **ReviewerAgent** performs code review
- Creates PR with AI comments

### 3. Manual Agent Usage
```javascript
import { generateArchitecture } from './lib/agents/architectAgent.js';
const arch = await generateArchitecture("Real-time chat system");
```

## Templates
- **node-express**: REST API with Jest testing
- **nextjs**: Full-stack React with Tailwind
- **python-flask**: Web service with Pytest

## Examples
- **[Todo Web App](TODO_WEB_APP_EXAMPLE.md)** - Complete walkthrough
- **[All Examples](EXAMPLES.md)** - More use cases

**📚 Complete Guide: [REUSABLE_PROJECT_GUIDE.md](REUSABLE_PROJECT_GUIDE.md)**