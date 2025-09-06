// orchestrator.js
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import simpleGit from 'simple-git';
import { writeFailingTest } from './lib/agents/testerAgent.js';
import { implementCode } from './lib/agents/coderAgent.js';
import { reviewCodeAndTests } from './lib/agents/reviewerAgent.js';
import { Octokit } from "@octokit/rest";

const git = simpleGit();
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const REPO_PATH = process.env.GITHUB_REPO || 'example-project';

async function createBranch(branchName) {
  try {
    await git.fetch();
    await git.checkoutLocalBranch(branchName);
  } catch (error) {
    console.error(`Failed to create branch ${branchName}:`, error.message);
    throw error;
  }
}

function writeFileRel(relPath, content) {
  const p = path.resolve(process.cwd(), relPath);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, 'utf8');
  console.log("Wrote", relPath);
}

function runTests(testPath) {
  try {
    // Adjust this command for your test runner (jest, pytest, etc.)
    console.log("Running tests for:", testPath.replace(/[\r\n]/g, ''));
    execSync(`npx jest ${testPath} --runInBand`, { stdio: 'inherit' });
    return true;
  } catch (e) {
    console.log("Tests failed (as expected sometimes).");
    return false;
  }
}

async function commitAndPush(branchName, message) {
  try {
    await git.add('.');
    await git.commit(message);
    await git.push('origin', branchName, { '--set-upstream': null });
  } catch (error) {
    console.error(`Failed to commit and push:`, error.message);
    throw error;
  }
}

async function openPR(branchName, title, body) {
  const { data: repo } = await octokit.repos.get({
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
  });

  const base = repo.default_branch || 'main';
  const { data } = await octokit.pulls.create({
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
    head: branchName,
    base,
    title,
    body,
  });
  console.log("PR created:", data.html_url.replace(/[\r\n]/g, ''));
  return data.html_url;
}

export async function runFeatureFlow(featureName, maxIterations = 3) {
  const branch = `feature/${featureName.replace(/\s+/g, '-').toLowerCase()}`;
  await createBranch(branch);

  // 1) Tester writes failing test
  const { filename: testFile, code: testCode } = await writeFailingTest(featureName);
  const testPath = path.join(REPO_PATH, testFile);
  writeFileRel(testPath, testCode);
  await commitAndPush(branch, `test: Add failing test for ${featureName.replace(/[\r\n]/g, '')}`);

  // 2) Run tests -> should fail
  let passed = runTests(testPath);
  if (passed) {
    console.log("Tests passed unexpectedly. Skipping coding phase.");
  } else {
    // 3) Try coder until pass or max iterations
    let iter = 0;
    while (!passed && iter < maxIterations) {
      iter++;
      const existingFiles = ""; // read any existing files if needed
      const { filename: implFile, code: implCode } = await implementCode(testCode, existingFiles);
      const implPath = path.join(REPO_PATH, implFile);
      writeFileRel(implPath, implCode);
      await commitAndPush(branch, `feat: Implement ${implFile.replace(/[\r\n]/g, '')} for ${featureName.replace(/[\r\n]/g, '')} (iter ${iter})`);
      passed = runTests(testPath);
    }
  }


  // 4) If tests passed -> reviewer run
  if (passed) {
    const code = fs.readFileSync(path.resolve(REPO_PATH, 'add.js'), 'utf8');
    const tests = fs.readFileSync(path.resolve(testPath), 'utf8');
    const review = await reviewCodeAndTests(code, tests);
    const reviewPath = path.join(REPO_PATH, 'AI_REVIEW.md');
    writeFileRel(reviewPath, `## AI Review for ${featureName}\n\n${JSON.stringify(review, null, 2)}`);
    await commitAndPush(branch, `docs: Add AI review for ${featureName.replace(/[\r\n]/g, '')}`);

    // 5) Open PR (human to merge)
    const prUrl = await openPR(branch, `Feature: ${featureName}`, `Automated PR created by agent flow for ${featureName}.\n\nAI Review:\n${JSON.stringify(review, null, 2)}`);
    return prUrl;
  } else {
    console.error("Tests did not pass after max iterations. Please review manually.");
    return null;
  }
}

// CLI entry
if (import.meta.url === `file://${process.argv[1]}`) {
  const fn = process.argv[2];
  if (!fn) {
    console.log("Usage: node orchestrator.js \"Feature description\"");
    process.exit(1);
  }
  runFeatureFlow(fn).catch(err => { console.error(err); process.exit(2); });
}