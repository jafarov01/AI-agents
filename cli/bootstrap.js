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

const git = simpleGit();

function copyTemplate(templateName, targetDir) {
  const templatePath = path.join(__dirname, '..', 'templates', templateName);
  if (!fs.existsSync(templatePath)) {
    console.log('Template not found:', templateName.replace(/[\r\n]/g, ''));
    return;
  }
  // naive recursive copy
  function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      const srcPath = join(src, entry.name);
      const destPath = join(dest, entry.name);
      if (entry.isDirectory()) copyDir(srcPath, destPath);
      else fs.copyFileSync(srcPath, destPath);
    }
  }
  copyDir(templatePath, targetDir);
}

function safeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9\-]+/g, '-').replace(/^\-+|\-+$/g,'');
}

async function writeFile(filepath, content) {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, content, 'utf8');
}

async function initLocalGit(dir) {
  try {
    await git.init();
    await git.add('.');
    await git.commit("chore: initial scaffold from gemini-agents template");
  } catch (error) {
    console.error('Failed to initialize git:', error.message);
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
    console.error('Failed to push to remote:', error.message);
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
  console.log("Suggested stack:", plan.stack?.replace(/[\r\n]/g, '') || 'Unknown');
  console.log("Phases:", plan.phases?.map(p=>p.name?.replace(/[\r\n]/g, '')).join(", ") || 'None');

  // create skeleton files
  writeFile(`${projectName}/README.md`, `# ${projectName}\n\n${idea}\n\nSuggested stack: ${plan.stack}\n`);
  writeFile(`${projectName}/.gitignore`, "node_modules\n.env\n");
  writeFile(`${projectName}/.github/ISSUE_TEMPLATE.md`, "Auto-generated template");

  // write a top-level plan file
  writeFile(`${projectName}/PRODUCT_PLAN.json`, JSON.stringify(plan, null, 2));

  console.log(`Project skeleton written to ./${projectName.replace(/[\r\n]/g, '')}`);

  // init git inside that folder and optionally create remote
  const originalDir = process.cwd();
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
      console.error('Failed to setup remote:', error.message);
      throw error;
    }
    console.log("Pushed to remote:", remoteUrl?.replace(/[\r\n]/g, '') || 'Unknown');

    // create issues for plan
    for (const phase of plan.phases) {
      // create a phase issue as epic
      const phaseIssue = await createIssue(ghOwner, projectName, `[Phase] ${phase.name}`, phase.description);
      for (const t of phase.tickets) {
        await createIssue(ghOwner, projectName, `[${phase.name}] ${t.title}`, t.desc + `\n\nLinked to phase issue #${phaseIssue.number}`);
      }
    }
    console.log("Created issues for plan in GitHub.");
  }

  console.log("Done. Clone the new repo and run your usual dev setup.");
}

main().catch(err=>{ console.error(err); process.exit(1); });
