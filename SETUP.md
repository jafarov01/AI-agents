# Setup Guide for Gemini Agents

## Quick Setup for New Projects

1. **Clone this repository as your project base:**
```bash
git clone <your-gemini-agents-repo-url> my-new-project
cd my-new-project
rm -rf .git  # Remove existing git history
git init     # Start fresh
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your actual API keys and settings
```

4. **Required API Keys:**
- **GEMINI_API_KEY**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **GITHUB_TOKEN**: Create at [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
  - Required scopes: `repo`, `workflow`, `write:packages`
- **GITHUB_OWNER**: Your GitHub username

5. **Test the setup:**
```bash
npm test
```

6. **Start using the agents:**
```bash
# Bootstrap a new project
npx ngen

# Or develop features with TDD
node orchestrator.js "Add user authentication"
```

## Project Structure

```
your-project/
├── cli/                 # Project bootstrapping
├── lib/agents/          # AI agents for development
├── docs/               # Documentation
├── templates/          # Project templates
└── .github/workflows/  # CI/CD pipelines
```

## Usage Patterns

### 1. New Project Creation
Use the CLI to create a new project with AI planning and GitHub integration.

### 2. Feature Development
Use the orchestrator for Test-Driven Development with AI assistance.

### 3. Manual Agent Usage
Import and use individual agents programmatically in your own scripts.

## Security Notes

- Never commit `.env` files
- Use environment variables in production
- Regularly update dependencies
- Review AI-generated code before deployment

## Troubleshooting

**Common Issues:**
- API key errors: Verify keys in `.env`
- Git errors: Check GitHub token permissions
- Template errors: Ensure templates exist in `cli/templates/`

For more details, see `docs/USAGE.md`