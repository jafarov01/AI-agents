// lib/github.js
import { Octokit } from "@octokit/rest";
import { sanitizeForLog } from "./utils/security.js";

// Dependency validation
function validateDependencies() {
  const missing = [];
  if (!process.env.GITHUB_TOKEN) missing.push('GITHUB_TOKEN');
  if (!process.env.GITHUB_OWNER) missing.push('GITHUB_OWNER');
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}\n\nPlease check your .env file and ensure you have:\n- GITHUB_TOKEN: Personal access token with 'repo' and 'workflow' scopes\n- GITHUB_OWNER: Your GitHub username`);
  }
}

export function octokitClient() {
  validateDependencies();
  return new Octokit({ auth: process.env.GITHUB_TOKEN });
}

let cachedOwner = null;

export async function createRepoIfNotExists(owner, name, isPrivate = false) {
  const octo = octokitClient();
  try {
    const { data } = await octo.repos.get({ owner, repo: name });
    return { exists: true, data };
  } catch (e) {
    if (e.status === 404) {
      const res = await octo.repos.createForAuthenticatedUser({
        name,
        private: isPrivate
      });
      return { exists: false, data: res.data };
    }
    throw e; // Re-throw non-404 errors
  }
}

export async function createIssue(owner, repo, title, body) {
  const octo = octokitClient();
  try {
    const res = await octo.issues.create({ owner, repo, title, body });
    return res.data;
  } catch (error) {
    console.error(`Failed to create issue "${sanitizeForLog(title)}":`, error.message);
    throw error;
  }
}

export async function getIssue(owner, repo, issueNumber) {
  const octo = octokitClient();
  try {
    const res = await octo.issues.get({ owner, repo, issue_number: issueNumber });
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch issue #${issueNumber}:`, error.message);
    throw error;
  }
}

export async function updateIssue(owner, repo, issueNumber, updates) {
  const octo = octokitClient();
  try {
    const res = await octo.issues.update({ owner, repo, issue_number: issueNumber, ...updates });
    return res.data;
  } catch (error) {
    console.error(`Failed to update issue #${issueNumber}:`, error.message);
    throw error;
  }
}
