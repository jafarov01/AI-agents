// orchestrator.js
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import simpleGit from 'simple-git';
import { writeFailingTest } from './lib/agents/testerAgent.js';
import { implementCode } from './lib/agents/coderAgent.js';
import { reviewCodeAndTests } from './lib/agents/reviewerAgent.js';
import { getIssue, updateIssue, octokitClient } from './lib/github.js';
import { sanitizeForLog, sanitizePath } from './lib/utils/security.js';

const git = simpleGit();
const octokit = octokitClient();

// Validate dependencies
function validateDependencies() {
  const missing = [];
  if (!process.env.GITHUB_TOKEN) missing.push('GITHUB_TOKEN');
  if (!process.env.GITHUB_OWNER) missing.push('GITHUB_OWNER');
  if (!process.env.GITHUB_REPO) missing.push('GITHUB_REPO');
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}\n\nPlease ensure your .env file has:\n- GITHUB_TOKEN: Personal access token with 'repo' and 'workflow' scopes\n- GITHUB_OWNER: Your GitHub username\n- GITHUB_REPO: Repository name you're working on`);
  }
}

validateDependencies();
const REPO_PATH = process.cwd(); // Use current directory instead of env var

async function createBranch(branchName) {
  try {
    await git.fetch();
    await git.checkoutLocalBranch(branchName);
  } catch (error) {
    console.error(`Failed to create branch ${sanitizeForLog(branchName)}:`, error.message);
    throw error;
  }
}

function writeFileRel(relPath, content) {
  const sanitizedPath = sanitizePath(relPath);
  fs.mkdirSync(path.dirname(sanitizedPath), { recursive: true });
  fs.writeFileSync(sanitizedPath, content, 'utf8');
  console.log("Wrote", sanitizeForLog(relPath));
}

function runTests(testPath) {
  try {
    // Adjust this command for your test runner (jest, pytest, etc.)
    console.log("Running tests for:", sanitizeForLog(testPath));
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
    console.error(`Failed to commit and push:`, sanitizeForLog(error.message));
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
  console.log("PR created:", sanitizeForLog(data.html_url));
  return data.html_url;
}

export async function runFeatureFlow(featureName, maxIterations = 3) {
  let issueData = null;
  let actualFeatureName = featureName;
  
  // Check if featureName is a GitHub issue number (e.g., "#1", "#2")
  const issueMatch = featureName.match(/^#(\d+)$/);
  if (issueMatch) {
    const issueNumber = parseInt(issueMatch[1]);
    console.log(`Fetching GitHub issue #${issueNumber}...`);
    
    try {
      issueData = await getIssue(process.env.GITHUB_OWNER, process.env.GITHUB_REPO, issueNumber);
      actualFeatureName = issueData.title;
      console.log(`Working on: ${sanitizeForLog(actualFeatureName)}`);
      console.log(`Description: ${sanitizeForLog(issueData.body?.substring(0, 100) || 'No description')}...`);
      
      // Update issue to "In Progress"
      await updateIssue(process.env.GITHUB_OWNER, process.env.GITHUB_REPO, issueNumber, {
        labels: ['in-progress']
      });
    } catch (error) {
      console.error(`Failed to fetch issue #${issueNumber}:`, error.message);
      throw error;
    }
  }
  
  const safeName = actualFeatureName.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
  const branch = issueData ? `feature/issue-${issueMatch[1]}-${safeName}` : `feature/${safeName}`;
  await createBranch(branch);

  // 1) Tester writes failing test based on issue or feature description
  const testContext = issueData ? `${actualFeatureName}\n\nDetails: ${issueData.body || ''}` : actualFeatureName;
  const { filename: testFile, code: testCode } = await writeFailingTest(testContext);
  const testPath = sanitizePath(path.join(REPO_PATH, testFile));
  writeFileRel(testPath, testCode);
  await commitAndPush(branch, `test: Add failing test for ${sanitizeForLog(actualFeatureName)}`);

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
      const implPath = sanitizePath(path.join(REPO_PATH, implFile));
      writeFileRel(implPath, implCode);
      await commitAndPush(branch, `feat: Implement ${sanitizeForLog(implFile)} for ${sanitizeForLog(actualFeatureName)} (iter ${iter})`);
      passed = runTests(testPath);
    }
  }


  // 4) If tests passed -> reviewer run
  if (passed) {
    const code = fs.readFileSync(path.resolve(REPO_PATH, 'add.js'), 'utf8');
    const tests = fs.readFileSync(path.resolve(testPath), 'utf8');
    const review = await reviewCodeAndTests(code, tests);
    const reviewPath = sanitizePath(path.join(REPO_PATH, 'AI_REVIEW.md'));
    const safeReview = typeof review === 'object' ? review : { error: 'Invalid review format' };
    writeFileRel(reviewPath, `## AI Review for ${featureName}\n\n${JSON.stringify(safeReview, null, 2)}`);
    await commitAndPush(branch, `docs: Add AI review for ${sanitizeForLog(featureName)}`);

    // 5) Open PR (human to merge)
    const prTitle = issueData ? `${actualFeatureName} (closes #${issueMatch[1]})` : `Feature: ${actualFeatureName}`;
    const prBody = issueData ? 
      `Automated PR for issue #${issueMatch[1]}\n\n**Original Issue:** ${actualFeatureName}\n\n**AI Review:**\n\`\`\`json\n${JSON.stringify(review, null, 2)}\n\`\`\`\n\nCloses #${issueMatch[1]}` :
      `Automated PR created by agent flow for ${actualFeatureName}.\n\nAI Review:\n${JSON.stringify(review, null, 2)}`;
    
    const prUrl = await openPR(branch, prTitle, prBody);
    
    // Update issue status if working from GitHub issue
    if (issueData) {
      await updateIssue(process.env.GITHUB_OWNER, process.env.GITHUB_REPO, parseInt(issueMatch[1]), {
        labels: ['ready-for-review']
      });
    }
    
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
    console.log("Usage: node orchestrator.js \"Feature description\" OR node orchestrator.js \"#1\" (GitHub issue number)");
    console.log("\nExamples:");
    console.log('  node orchestrator.js "Add user authentication"');
    console.log('  node orchestrator.js "#1"  # Work on GitHub issue #1');
    console.log('  node orchestrator.js "#5"  # Work on GitHub issue #5');
    process.exit(1);
  }
  runFeatureFlow(fn).catch(err => { console.error(err); process.exit(2); });
}