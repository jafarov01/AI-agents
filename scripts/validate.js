#!/usr/bin/env node
// scripts/validate.js - Validates repo structure and readiness

import fs from 'fs';
import path from 'path';

const requiredFiles = [
  '.env.example',
  '.gitignore', 
  'README.md',
  'package.json',
  'orchestrator.js',
  'cli/bootstrap.js',
  'lib/gemini.js',
  'lib/github.js',

  'lib/agents/coderAgent.js',
  'lib/agents/testerAgent.js', 
  'lib/agents/reviewerAgent.js',
  'lib/agents/architectAgent.js',
  'lib/agents/plannerAgent.js',
  '.github/workflows/ci.yml',
  'docs/ARCHITECTURE.md',
  'docs/USAGE.md',
  'docs/API.md',
  'docs/EXAMPLES.md',
  'tests/agents.test.js',
  'tests/workflow.test.js',
  'TEST_SETUP.md',
  'tests/README.md',
  'docs/README.md',
  'docs/REUSABLE_PROJECT_GUIDE.md'
];

const requiredDirs = [
  'cli/templates/node-express',
  'cli/templates/nextjs', 
  'cli/templates/python-flask',
  'docs',
  'lib/agents',
  'tests'
];

console.log('🔍 Validating gemini-agents repository structure...\n');

let allValid = true;

// Check required files
console.log('📁 Checking required files:');
for (const file of requiredFiles) {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allValid = false;
}

// Check required directories
console.log('\n📂 Checking required directories:');
for (const dir of requiredDirs) {
  const exists = fs.existsSync(dir) && fs.statSync(dir).isDirectory();
  console.log(`  ${exists ? '✅' : '❌'} ${dir}/`);
  if (!exists) allValid = false;
}

// Check package.json configuration
console.log('\n⚙️  Checking package.json configuration:');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const checks = [
    ['type === "module"', pkg.type === 'module'],
    ['bin.ngen exists', pkg.bin?.ngen === './cli/bootstrap.js'],
    ['start script exists', !!pkg.scripts?.start],
    ['test script exists', !!pkg.scripts?.test],
    ['orchestrator script exists', !!pkg.scripts?.orchestrator],
    ['required dependencies', pkg.dependencies?.dotenv && pkg.dependencies?.inquirer]
  ];
  
  for (const [check, valid] of checks) {
    console.log(`  ${valid ? '✅' : '❌'} ${check}`);
    if (!valid) allValid = false;
  }
} catch (e) {
  console.log('  ❌ package.json is invalid JSON');
  allValid = false;
}

// Check .env.example
console.log('\n🔐 Checking .env.example:');
try {
  const envExample = fs.readFileSync('.env.example', 'utf8');
  const requiredVars = ['GEMINI_API_KEY', 'GITHUB_TOKEN', 'GITHUB_OWNER'];
  
  for (const envVar of requiredVars) {
    const exists = envExample.includes(envVar);
    console.log(`  ${exists ? '✅' : '❌'} ${envVar}`);
    if (!exists) allValid = false;
  }
} catch (e) {
  console.log('  ❌ .env.example not readable');
  allValid = false;
}

// Final result
console.log('\n' + '='.repeat(50));
if (allValid) {
  console.log('🎉 REPO IS READY TO PUSH as universal base project!');
  console.log('\nNext steps:');
  console.log('1. git add .');
  console.log('2. git commit -m "feat: complete universal AI project base"');
  console.log('3. git push -u origin main');
  process.exit(0);
} else {
  console.error('❌ Repository has missing components. Please fix the issues above.');
  process.exit(1);
}