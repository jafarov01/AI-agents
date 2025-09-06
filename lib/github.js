// lib/github.js
import { Octokit } from "@octokit/rest";

export function octokitClient() {
  if (!process.env.GITHUB_TOKEN) throw new Error("GITHUB_TOKEN missing in .env");
  return new Octokit({ auth: process.env.GITHUB_TOKEN });
}

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
    console.error(`Failed to create issue "${title}":`, error.message);
    throw error;
  }
}
