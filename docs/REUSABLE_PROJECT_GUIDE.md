# Reusable Project Guide

## 🎯 Using Gemini-Agents as Your Universal Project Base

This guide shows how to use gemini-agents as a reusable foundation for any software project.

## 🚀 Quick Setup for New Projects

### 1. Clone as Project Base
```bash
# Clone this repo as your new project
git clone <your-gemini-agents-repo-url> my-awesome-project
cd my-awesome-project

# Remove existing git history and start fresh
rm -rf .git
git init
git add .
git commit -m "Initial commit from gemini-agents base"
```

### 2. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your API keys
nano .env
```

**Required API Keys:**
```bash
# Get from https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_actual_gemini_api_key

# Get from https://github.com/settings/tokens (needs repo, workflow scopes)
GITHUB_TOKEN=your_actual_github_token

# Your GitHub username
GITHUB_OWNER=your_github_username
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Test Setup
```bash
# Verify everything works
npm test
```

## 🛠️ Development Workflows

### Workflow 1: AI-Planned Project Creation
**Use Case:** Starting a completely new project with AI assistance

```bash
# Launch interactive project creator
npx ngen

# Follow prompts:
# - Describe your product idea
# - Choose tech stack preferences  
# - Decide on GitHub integration
```

**What Happens:**
1. 🤖 AI generates comprehensive project plan
2. 📋 Creates GitHub repo with organized issues
3. 🏗️ Scaffolds project from templates
4. ⚙️ Sets up CI/CD pipeline
5. 📚 Generates documentation

**Example Output:**
```
✓ Generated 5-phase roadmap with 23 tickets
✓ Created GitHub repo: github.com/you/my-awesome-project
✓ Scaffolded NextJS project structure
✓ Set up automated CI/CD pipeline
✓ Ready for development!
```

### Workflow 2: Test-Driven Feature Development
**Use Case:** Adding features to existing project with AI assistance

```bash
# Develop any feature with TDD
node orchestrator.js "Add user authentication with OAuth"
```

**What Happens:**
1. 🧪 **TesterAgent** writes comprehensive failing tests
2. 💻 **CoderAgent** implements minimal code to pass tests
3. 🔄 Iterates until all tests pass
4. 👀 **ReviewerAgent** performs code review
5. 🔀 Creates PR with AI review comments

**Generated Files:**
```
tests/auth.test.js          # Comprehensive test suite
src/auth/oauthService.js    # Implementation code
src/auth/middleware.js      # Auth middleware
AI_REVIEW.md               # Detailed code review
```

### Workflow 3: Manual Agent Usage
**Use Case:** Using individual agents for specific tasks

```javascript
// Generate project architecture
import { generateArchitecture } from './lib/agents/architectAgent.js';
const arch = await generateArchitecture("Real-time chat system");

// Break down large features
import { breakdownFeature } from './lib/agents/plannerAgent.js';
const tickets = await breakdownFeature("User dashboard with analytics");

// Write tests for existing code
import { writeFailingTest } from './lib/agents/testerAgent.js';
const test = await writeFailingTest("Email validation function");
```

## 📁 Project Templates

### Available Templates

**Node.js + Express**
```bash
# When prompted, choose: node-express
# Gets: REST API, Jest testing, Docker, middleware
```

**Next.js Full-Stack**
```bash
# When prompted, choose: nextjs  
# Gets: React app, API routes, Tailwind, Vercel-ready
```

**Python + Flask**
```bash
# When prompted, choose: python-flask
# Gets: Web service, Pytest, requirements.txt, Docker
```

### Customizing Templates

**Add Your Own Template:**
```bash
# Create new template directory
mkdir cli/templates/my-custom-stack

# Add your template files
cli/templates/my-custom-stack/
├── package.json
├── src/
├── tests/
└── README.md
```

**Modify Existing Templates:**
```bash
# Edit any template in cli/templates/
# Changes apply to all new projects using that template
```

## 🔧 Configuration Options

### Environment Variables
```bash
# Required
GEMINI_API_KEY=your_key
GITHUB_TOKEN=your_token  
GITHUB_OWNER=your_username

# Optional - Model Selection
BIG_MODEL=gemini-1.5-pro-latest      # Complex tasks
SMALL_MODEL=gemini-1.5-flash-latest  # Simple tasks

# Optional - Project Settings
GITHUB_REPO=my-project-name          # Default repo name
```

### Package.json Scripts
```json
{
  "scripts": {
    "start": "node cli/bootstrap.js",
    "orchestrator": "node orchestrator.js",
    "test": "jest --verbose",
    "validate": "node scripts/validate.js"
  }
}
```

## 🎯 Use Cases & Examples

### Use Case 1: SaaS Startup
```bash
# 1. Clone gemini-agents as base
git clone <repo> saas-analytics-platform

# 2. Generate AI-planned project
npx ngen
# Input: "Analytics dashboard for e-commerce stores"
# Output: 6-phase plan, 34 GitHub issues, NextJS scaffold

# 3. Develop features iteratively
node orchestrator.js "User onboarding flow"
node orchestrator.js "Data visualization dashboard" 
node orchestrator.js "Subscription billing system"
```

### Use Case 2: API Service
```bash
# 1. Clone as base
git clone <repo> payment-processing-api

# 2. Create API project
npx ngen
# Choose: node-express template
# Input: "Payment processing API with webhooks"

# 3. Build features with TDD
node orchestrator.js "Stripe payment integration"
node orchestrator.js "Webhook event handling"
node orchestrator.js "Transaction logging"
```

### Use Case 3: Mobile App Backend
```bash
# 1. Clone as base  
git clone <repo> mobile-app-backend

# 2. Generate architecture
node -e "
import('./lib/agents/architectAgent.js').then(async ({generateArchitecture}) => {
  const arch = await generateArchitecture('Mobile app backend with push notifications');
  console.log(JSON.stringify(arch, null, 2));
});
"

# 3. Implement planned architecture
node orchestrator.js "User authentication API"
node orchestrator.js "Push notification service"
node orchestrator.js "Real-time messaging"
```

## 🔄 Integration Patterns

### CI/CD Integration
Generated projects include:
```yaml
# .github/workflows/ci.yml
- Automated testing on PR
- Code quality checks
- Deployment pipelines
- AI code review comments
```

### Database Integration
```javascript
// Add to your project after scaffolding
npm install prisma postgresql
npx prisma init

// Use orchestrator to build data layer
node orchestrator.js "User model with Prisma ORM"
node orchestrator.js "Database migration system"
```

### Deployment Integration
```bash
# Vercel (for Next.js projects)
npm install -g vercel
vercel

# Docker (for any project)
# Dockerfile is included in templates
docker build -t my-project .
docker run -p 3000:3000 my-project
```

## 🎨 Customization Guide

### Modify AI Prompts
```javascript
// Edit lib/agents/plannerAgent.js
const prompt = `
You are a senior product manager at a ${companyType} company.
Generate a ${projectType} roadmap for: ${productIdea}
Focus on ${priorities} and include ${requirements}.
`;
```

### Add New Agents
```javascript
// Create lib/agents/deploymentAgent.js
export async function generateDeploymentPlan(architecture) {
  const prompt = `Generate deployment strategy for: ${architecture}`;
  return await callGemini(prompt);
}
```

### Extend Templates
```bash
# Add new files to any template
echo "# Custom Config" > cli/templates/nextjs/custom.config.js
```

## 🚨 Best Practices

### 1. Start Small
- Begin with MVP features
- Let AI plan the full roadmap
- Implement incrementally with orchestrator

### 2. Review AI Output
- Always review generated code
- Test thoroughly before merging
- Customize prompts for your domain

### 3. Version Control
- Commit after each orchestrator run
- Use feature branches for development
- Merge PRs after review

### 4. Cost Management
- Use SMALL_MODEL for simple tasks
- Monitor Gemini API usage
- Cache common responses

### 5. Team Collaboration
- Share .env.example with team
- Document custom workflows
- Use GitHub issues for planning

## 🔍 Troubleshooting

### Common Issues

**API Key Errors:**
```bash
# Verify keys are set
echo $GEMINI_API_KEY
echo $GITHUB_TOKEN

# Test API connectivity
npm test
```

**Template Issues:**
```bash
# Validate project structure
npm run validate

# Check template exists
ls cli/templates/
```

**Git Issues:**
```bash
# Check GitHub token permissions
# Needs: repo, workflow, write:packages scopes
```

### Getting Help

1. **Run validation:** `npm run validate`
2. **Check tests:** `npm test`
3. **Review logs:** Check console output for errors
4. **Verify setup:** Ensure all API keys are correct

## 🎉 Success Metrics

When gemini-agents is working correctly:
- ✅ Projects scaffold in under 2 minutes
- ✅ AI generates comprehensive test suites
- ✅ Code passes tests on first try 80%+ of time
- ✅ GitHub integration creates organized issues
- ✅ CI/CD pipelines work out of the box
- ✅ Development velocity increases 3-5x

**You now have a universal AI development base that can bootstrap any software project with intelligent planning, automated testing, and continuous integration!**