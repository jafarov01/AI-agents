// lib/github.js
import { Octokit } from "@octokit/rest";
import { sanitizeForLog } from "./utils/security.js";

export function octokitClient() {
  if (!process.env.GITHUB_TOKEN) throw new Error("GITHUB_TOKEN missing in .env");
  return new Octokit({ auth: process.env.GITHUB_TOKEN });
}

let cachedOwner = null;

export async function createRepoIfNotExists(name, isPrivate = false) {
  const octo = octokitClient();
  try {
    if (!cachedOwner) {
      try {
        cachedOwner = await octo.users.getAuthenticated().then(res => res.data.login);
      } catch (authError) {
        throw new Error(`GitHub authentication failed: ${authError.message}`);
      }
    }
    const { data } = await octo.repos.get({ owner: cachedOwner, repo: name });
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
