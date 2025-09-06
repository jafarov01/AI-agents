# Test Suite Documentation

## Overview

This test suite validates the complete gemini-agents workflow and ensures all components work together correctly.

## Test Files

### `agents.test.js` - Unit Tests
- **Purpose**: Validate module structure and basic functionality
- **Requirements**: No API keys needed (uses mocks)
- **Coverage**: Module imports, input validation, configuration

### `workflow.test.js` - Integration Tests  
- **Purpose**: Validate complete workflow with real APIs
- **Requirements**: Real API keys in `.env.test.local`
- **Coverage**: AI agents, GitHub integration, templates, documentation

## Running Tests

```bash
# Setup (one time)
cp .env.test .env.test.local
# Edit .env.test.local with your API keys

# Run all tests
npm test

# Run specific tests
npx jest tests/agents.test.js      # Unit tests only
npx jest tests/workflow.test.js    # Integration tests only
```

## Test Categories

### 🔧 **Core Agent Functions**
- Validates all AI agents can be imported
- Tests API connectivity (Gemini, GitHub)
- Verifies input validation and error handling

### 🤖 **AI Agent Workflow**
- Project planning with real Gemini API
- Architecture generation
- Test generation (TDD)
- Code implementation
- Code review process

### 📁 **Template System**
- Validates all templates exist
- Checks template package.json files
- Verifies template structure

### 🛠️ **CLI and Scripts**
- Bootstrap CLI validation
- Orchestrator script validation
- Package.json configuration

### 📚 **Documentation and Structure**
- Complete documentation exists
- CI/CD configuration is valid
- Environment setup is correct

## Success Criteria

All tests passing indicates:
- ✅ Complete workflow is functional
- ✅ All APIs are accessible and working
- ✅ Project structure is complete and valid
- ✅ Ready for use as universal base project

## Test Environment

Tests use `.env.test.local` for configuration:
- Isolated from development environment
- Requires real API keys for integration tests
- Safe cleanup after test completion