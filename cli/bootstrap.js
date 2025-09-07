#!/usr/bin/env node
import 'dotenv/config';
import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import simpleGit from "simple-git";
import { generateProductPlan } from "../lib/plannerAgent.js";
import { createRepoIfNotExists, createIssue } from "../lib/github.js";
import { sanitizeForLog, sanitizePath } from "../lib/utils/security.js";

const git = simpleGit();

function copyTemplate(templateName, targetDir) {
  const templatePath = sanitizePath(path.join(__dirname, '..', 'templates', templateName));
  if (!existsSync(templatePath)) {
    console.log('Template not found:', sanitizeForLog(templateName));
    return;
  }
  // naive recursive copy
  function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      const srcPath = sanitizePath(path.join(src, entry.name));
      const destPath = sanitizePath(path.join(dest, entry.name));
      if (entry.isDirectory()) copyDir(srcPath, destPath);
      else fs.copyFileSync(srcPath, destPath);
    }
  }
  copyDir(templatePath, targetDir);
}

function safeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9\-]+/g, '-').replace(/^\-+|\-+$/g,'');
}

function writeFile(filepath, content) {
  const safePath = sanitizePath(filepath);
  fs.mkdirSync(path.dirname(safePath), { recursive: true });
  fs.writeFileSync(safePath, content, 'utf8');
}

async function initLocalGit(dir) {
  try {
    await git.init();
    await git.add('.');
    await git.commit("chore: initial scaffold from gemini-agents template");
  } catch (error) {
    console.error('Failed to initialize git:', sanitizeForLog(error.message));
    throw error;
  }
}

async function pushToRemote(owner, repoName, remoteUrl) {
  try {
    await git.remote(['add', 'origin', remoteUrl]);
    await git.branch(['-M', 'main']);
    await git.add('.');
    await git.commit("chore: initial commit");
    await git.push(['-u', 'origin', 'main']);
  } catch (error) {
    console.error('Failed to push to remote:', sanitizeForLog(error.message));
    throw error;
  }
}

async function main() {
  console.log("Welcome to gemini-agents project bootstrapper");
  const answers = await inquirer.prompt([
    { name: "idea", message: "Describe your product / feature (one paragraph):", type: "input" },
    { name: "projectName", message: "Project repo name (short):", type: "input", default: (answers) => safeName(answers.idea.split(' ').slice(0,4).join('-')) },
    { name: "stackHint", message: "Optional: preferred stack (node/python/java/react/next/express/fastify):", type: "input", default: "" },
    { type: "confirm", name: "createRemote", message: "Create GitHub repo and issues for plan?", default: true },
  ]);

  const idea = answers.idea;
  const projectName = safeName(answers.projectName);
  const ghOwner = process.env.GITHUB_OWNER;
  if (!ghOwner) {
    throw new Error('GITHUB_OWNER environment variable is required');
  }

  console.log("Asking Gemini for plan...");
  const plan = await generateProductPlan(idea, answers.stackHint);
  console.log("Suggested stack:", sanitizeForLog(plan.stack || 'Unknown'));
  console.log("Phases:", plan.phases?.map(p=>sanitizeForLog(p.name || '')).join(", ") || 'None');

  // create skeleton files
  writeFile(`${projectName}/README.md`, `# ${projectName}\n\n${idea}\n\nSuggested stack: ${plan.stack}\n`);
  writeFile(`${projectName}/.gitignore`, "node_modules\n.env\n");
  writeFile(`${projectName}/.github/ISSUE_TEMPLATE.md`, "Auto-generated template");

  // write a top-level plan file
  writeFile(`${projectName}/PRODUCT_PLAN.json`, JSON.stringify(plan, null, 2));

  console.log(`Project skeleton written to ./${sanitizeForLog(projectName)}`);

  // init git inside that folder and optionally create remote
  const originalDir = process.cwd();
  try {
    process.chdir(projectName);
  await git.init();
  await git.add('.');
  await git.commit("chore: scaffold initial project");
  console.log("Local git repo initialized.");

  if (answers.createRemote) {
    console.log("Creating remote repo via GitHub API...");
    const repoResult = await createRepoIfNotExists(ghOwner, projectName, false);
    const repo = repoResult.data;
    // remote URL selection: prefer ssh
    const remoteUrl = repo.ssh_url || repo.clone_url;
    try {
      await git.addRemote('origin', remoteUrl);
      await git.branch(['-M', 'main']);
      await git.push('origin', 'main');
    } catch (error) {
      console.error('Failed to setup remote:', sanitizeForLog(error.message));
      throw error;
    }
    console.log("Pushed to remote:", sanitizeForLog(remoteUrl || 'Unknown'));

    // create issues for plan
    if (plan.phases && Array.isArray(plan.phases)) {
    for (const phase of plan.phases) {
      // create a phase issue as epic
      const phaseIssue = await createIssue(ghOwner, projectName, `[Phase] ${phase.name}`, phase.description);
      for (const t of phase.tickets) {
        await createIssue(ghOwner, projectName, `[${phase.name}] ${t.title}`, t.desc + `\n\nLinked to phase issue #${phaseIssue.number}`);
      }
    }
    console.log("Created issues for plan in GitHub.");
    }
  }

  console.log("Done. Clone the new repo and run your usual dev setup.");
  } catch (error) {
    console.error('Bootstrap failed:', sanitizeForLog(error.message));
    throw error;
  } finally {
    process.chdir(originalDir);
  }
}

main().catch(err=>{ console.error(err); process.exit(1); });
