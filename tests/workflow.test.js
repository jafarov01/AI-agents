// tests/workflow.test.js - Complete workflow integration tests
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load test environment
const testEnvPath = path.join(__dirname, '..', '.env.test.local');
if (!fs.existsSync(testEnvPath)) {
  console.error(`
❌ TEST SETUP REQUIRED:
1. Copy .env.test to .env.test.local
2. Add your actual API keys to .env.test.local
3. Run tests again

cp .env.test .env.test.local
# Edit .env.test.local with your keys
`);
  process.exit(1);
}

dotenv.config({ path: testEnvPath });

// Validate required test environment
const requiredEnvVars = ['GEMINI_API_KEY', 'GITHUB_TOKEN', 'GITHUB_OWNER'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar] || process.env[envVar].includes('your_test_')) {
    console.error(`❌ Missing or invalid ${envVar} in .env.test.local`);
    process.exit(1);
  }
}

describe('Gemini Agents Workflow Integration Tests', () => {
  let testProjectDir;

  beforeAll(() => {
    testProjectDir = path.join(__dirname, '..', 'test-output');
    if (fs.existsSync(testProjectDir)) {
      fs.rmSync(testProjectDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testProjectDir, { recursive: true });
  });

  afterAll(() => {
    if (fs.existsSync(testProjectDir)) {
      fs.rmSync(testProjectDir, { recursive: true, force: true });
    }
  });

  describe('Core Agent Functions', () => {
    test('should load all agent modules without errors', async () => {
      const { generateProductPlan } = await import('../lib/agents/plannerAgent.js');
      const { generateArchitecture } = await import('../lib/agents/architectAgent.js');
      const { implementCode } = await import('../lib/agents/coderAgent.js');
      const { writeFailingTest } = await import('../lib/agents/testerAgent.js');
      const { reviewCodeAndTests } = await import('../lib/agents/reviewerAgent.js');

      expect(typeof generateProductPlan).toBe('function');
      expect(typeof generateArchitecture).toBe('function');
      expect(typeof implementCode).toBe('function');
      expect(typeof writeFailingTest).toBe('function');
      expect(typeof reviewCodeAndTests).toBe('function');
    });

    test('should validate Gemini API connection', async () => {
      const { callGemini } = await import('../lib/gemini.js');
      
      const response = await callGemini('Say "test successful"', 'gemini-1.5-flash-latest');
      expect(response.toLowerCase()).toContain('test successful');
    }, 30000);

    test('should validate GitHub API connection', async () => {
      const { octokitClient } = await import('../lib/github.js');
      
      const octokit = octokitClient();
      const { data: user } = await octokit.users.getAuthenticated();
      expect(user.login).toBe(process.env.GITHUB_OWNER);
    });
  });

  describe('AI Agent Workflow', () => {
    test('should generate project plan', async () => {
      const { generateProductPlan } = await import('../lib/agents/plannerAgent.js');
      
      const plan = await generateProductPlan('A simple calculator app', 'JavaScript');
      
      expect(plan).toHaveProperty('stack');
      expect(plan).toHaveProperty('phases');
      expect(Array.isArray(plan.phases)).toBe(true);
      expect(plan.phases.length).toBeGreaterThan(0);
      expect(plan.phases[0]).toHaveProperty('name');
      expect(plan.phases[0]).toHaveProperty('tickets');
    }, 30000);

    test('should generate architecture', async () => {
      const { generateArchitecture } = await import('../lib/agents/architectAgent.js');
      
      const arch = await generateArchitecture('User authentication system');
      
      expect(arch).toHaveProperty('file_structure');
      expect(arch).toHaveProperty('system_diagram');
      expect(arch).toHaveProperty('technical_summary');
      expect(Array.isArray(arch.file_structure)).toBe(true);
    }, 30000);

    test('should generate failing test', async () => {
      const { writeFailingTest } = await import('../lib/agents/testerAgent.js');
      
      const testResult = await writeFailingTest('Add two numbers function');
      
      expect(testResult).toHaveProperty('filename');
      expect(testResult).toHaveProperty('code');
      expect(testResult.filename).toMatch(/\.test\.js$/);
      expect(testResult.code.toLowerCase()).toMatch(/(test|it|describe)/);
    }, 30000);

    test('should implement code from test', async () => {
      const { implementCode } = await import('../lib/agents/coderAgent.js');
      
      const testCode = `
describe('Calculator', () => {
  test('should add two numbers', () => {
    const calc = require('./calculator');
    expect(calc.add(2, 3)).toBe(5);
  });
});`;
      
      const implementation = await implementCode(testCode);
      
      expect(implementation).toHaveProperty('filename');
      expect(implementation).toHaveProperty('code');
      expect(implementation.code).toContain('add');
    }, 30000);

    test('should review code and tests', async () => {
      const { reviewCodeAndTests } = await import('../lib/agents/reviewerAgent.js');
      
      const code = 'function add(a, b) { return a + b; }';
      const tests = 'test("adds numbers", () => { expect(add(1,2)).toBe(3); });';
      
      const review = await reviewCodeAndTests(code, tests);
      
      expect(review).toHaveProperty('checklist');
      expect(Array.isArray(review.checklist)).toBe(true);
    }, 30000);
  });

  describe('Template System', () => {
    test('should have all required templates', () => {
      const templatesDir = path.join(__dirname, '..', 'cli', 'templates');
      
      expect(fs.existsSync(path.join(templatesDir, 'node-express'))).toBe(true);
      expect(fs.existsSync(path.join(templatesDir, 'nextjs'))).toBe(true);
      expect(fs.existsSync(path.join(templatesDir, 'python-flask'))).toBe(true);
    });

    test('should validate template package.json files', () => {
      const templates = ['node-express', 'nextjs'];
      
      for (const template of templates) {
        const pkgPath = path.join(__dirname, '..', 'cli', 'templates', template, 'package.json');
        expect(fs.existsSync(pkgPath)).toBe(true);
        
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        expect(pkg).toHaveProperty('name');
        expect(pkg).toHaveProperty('scripts');
      }
    });
  });

  describe('CLI and Scripts', () => {
    test('should validate bootstrap CLI exists and is executable', () => {
      const bootstrapPath = path.join(__dirname, '..', 'cli', 'bootstrap.js');
      expect(fs.existsSync(bootstrapPath)).toBe(true);
      
      const content = fs.readFileSync(bootstrapPath, 'utf8');
      expect(content).toContain('#!/usr/bin/env node');
    });

    test('should validate orchestrator exists', () => {
      const orchestratorPath = path.join(__dirname, '..', 'orchestrator.js');
      expect(fs.existsSync(orchestratorPath)).toBe(true);
      
      const content = fs.readFileSync(orchestratorPath, 'utf8');
      expect(content).toContain('runFeatureFlow');
    });

    test('should validate package.json configuration', () => {
      const pkgPath = path.join(__dirname, '..', 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      
      expect(pkg.type).toBe('module');
      expect(pkg.bin.ngen).toBe('./cli/bootstrap.js');
      expect(pkg.scripts).toHaveProperty('start');
      expect(pkg.scripts).toHaveProperty('test');
      expect(pkg.scripts).toHaveProperty('orchestrator');
    });
  });

  describe('Documentation and Structure', () => {
    test('should have complete documentation', () => {
      const docsDir = path.join(__dirname, '..', 'docs');
      
      expect(fs.existsSync(path.join(docsDir, 'ARCHITECTURE.md'))).toBe(true);
      expect(fs.existsSync(path.join(docsDir, 'USAGE.md'))).toBe(true);
      expect(fs.existsSync(path.join(docsDir, 'API.md'))).toBe(true);
      expect(fs.existsSync(path.join(docsDir, 'EXAMPLES.md'))).toBe(true);
    });

    test('should have proper CI/CD configuration', () => {
      const ciPath = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
      expect(fs.existsSync(ciPath)).toBe(true);
      
      const content = fs.readFileSync(ciPath, 'utf8');
      expect(content).toContain('npm run test');
    });

    test('should have environment configuration', () => {
      expect(fs.existsSync(path.join(__dirname, '..', '.env.example'))).toBe(true);
      expect(fs.existsSync(path.join(__dirname, '..', '.env.template'))).toBe(true);
      expect(fs.existsSync(path.join(__dirname, '..', 'SETUP.md'))).toBe(true);
    });
  });
});