// tests/agents.test.js - Unit tests for individual agent modules
import { describe, test, expect, beforeAll } from '@jest/globals';

// Mock environment variables for unit testing
beforeAll(() => {
  process.env.GEMINI_API_KEY = 'mock-key';
  process.env.GITHUB_TOKEN = 'mock-token';
  process.env.GITHUB_OWNER = 'mock-owner';
});

describe('Agent Module Structure', () => {
  test('should import all agent modules without errors', async () => {
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

  test('should import utility modules', async () => {
    const { callGemini } = await import('../lib/gemini.js');
    const { createRepoIfNotExists, createIssue } = await import('../lib/github.js');
    
    expect(typeof callGemini).toBe('function');
    expect(typeof createRepoIfNotExists).toBe('function');
    expect(typeof createIssue).toBe('function');
  });

  test('should validate input parameters', async () => {
    const { generateProductPlan } = await import('../lib/agents/plannerAgent.js');
    const { writeFailingTest } = await import('../lib/agents/testerAgent.js');
    const { implementCode } = await import('../lib/agents/coderAgent.js');
    
    await expect(generateProductPlan('')).rejects.toThrow('Product idea must be a non-empty string');
    await expect(writeFailingTest('')).rejects.toThrow('Feature description must be a non-empty string');
    await expect(implementCode('')).rejects.toThrow('Test content must be a non-empty string');
  });

  test('should have valid package.json configuration', async () => {
    const pkg = await import('../package.json', { with: { type: 'json' } });
    
    expect(pkg.default.type).toBe('module');
    expect(pkg.default.bin.ngen).toBe('./cli/bootstrap.js');
    expect(pkg.default.scripts.start).toBeDefined();
    expect(pkg.default.scripts.test).toBeDefined();
    expect(pkg.default.scripts.orchestrator).toBeDefined();
  });
});