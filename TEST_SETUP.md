# Test Setup Guide

## Prerequisites

Before running tests, you need to set up your test environment with actual API keys.

## Setup Steps

1. **Copy the test environment template:**
```bash
cp .env.test .env.test.local
```

2. **Edit `.env.test.local` with your actual API keys:**
```bash
# Required: Get from https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_actual_gemini_api_key

# Required: Get from https://github.com/settings/tokens
# Needs scopes: repo, workflow, write:packages
GITHUB_TOKEN=your_actual_github_token

# Required: Your GitHub username
GITHUB_OWNER=your_github_username

# Optional: Test repository name (will be created if doesn't exist)
GITHUB_REPO=test-gemini-agents-project
```

3. **Install dependencies:**
```bash
npm install
```

4. **Run tests:**
```bash
# Run all tests
npm test

# Run specific test suites
npx jest tests/agents.test.js
npx jest tests/workflow.test.js
```

## Test Suites

### Unit Tests (`tests/agents.test.js`)
- Module imports and structure validation
- Input parameter validation
- Package configuration checks
- **No API calls** - uses mocked environment

### Integration Tests (`tests/workflow.test.js`)
- **Requires real API keys** in `.env.test.local`
- Tests complete AI agent workflow
- Validates Gemini API connectivity
- Validates GitHub API connectivity
- Tests all agent functions with real API calls
- Validates template system
- Validates CLI and scripts
- Validates documentation structure

## What Tests Validate

✅ **Agent Functionality:**
- All AI agents can generate valid responses
- Input validation works correctly
- Error handling is proper

✅ **API Connectivity:**
- Gemini API connection and responses
- GitHub API authentication and operations

✅ **Project Structure:**
- All required files and directories exist
- Templates are valid and complete
- Documentation is comprehensive
- CI/CD configuration is correct

✅ **Workflow Integration:**
- Complete TDD workflow (test → code → review)
- Project planning and architecture generation
- GitHub integration (repos, issues, PRs)

## Test Output

Successful tests indicate:
- The entire gemini-agents workflow is functional
- All agents can communicate with external APIs
- The project is ready for use as a universal base
- All templates and documentation are complete

## Troubleshooting

**API Key Issues:**
- Verify keys are correct in `.env.test.local`
- Check GitHub token has required scopes
- Ensure Gemini API key is active

**Test Failures:**
- Check network connectivity
- Verify API rate limits aren't exceeded
- Review error messages for specific issues

**File Not Found:**
- Ensure you copied `.env.test` to `.env.test.local`
- Verify all required files exist in the project