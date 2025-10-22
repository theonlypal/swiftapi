/**
 * GitHub Operations - Handle git and GitHub API interactions
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface GitConfig {
  repoPath: string;
  authorName: string;
  authorEmail: string;
  token: string;
  branch: string;
  defaultBranch: string;
  prMode: boolean;
  repoOwner?: string;
  repoName?: string;
}

export interface GitResult {
  commitSha?: string;
  commitUrl?: string;
  prUrl?: string;
  error?: string;
}

/**
 * Execute git commands with proper error handling
 */
async function execGit(
  command: string,
  cwd: string,
  logFn?: (message: string) => void
): Promise<{ stdout: string; stderr: string }> {
  logFn?.(`$ git ${command}`);
  try {
    const result = await execAsync(`git ${command}`, { cwd, maxBuffer: 10 * 1024 * 1024 });
    if (result.stdout) logFn?.(result.stdout.trim());
    if (result.stderr) logFn?.(result.stderr.trim());
    return result;
  } catch (error: any) {
    logFn?.(`ERROR: ${error.message}`);
    throw error;
  }
}

/**
 * Configure git user for commits
 */
export async function configureGit(
  config: GitConfig,
  logFn?: (message: string) => void
): Promise<void> {
  await execGit(`config user.name "${config.authorName}"`, config.repoPath, logFn);
  await execGit(`config user.email "${config.authorEmail}"`, config.repoPath, logFn);
}

/**
 * Check if working directory is clean
 */
export async function isWorkingDirectoryClean(
  repoPath: string,
  logFn?: (message: string) => void
): Promise<boolean> {
  const { stdout } = await execGit('status --porcelain', repoPath, logFn);
  return stdout.trim() === '';
}

/**
 * Create and checkout a new branch
 */
export async function createBranch(
  repoPath: string,
  branchName: string,
  baseBranch: string,
  logFn?: (message: string) => void
): Promise<void> {
  // Ensure we're on the base branch
  await execGit(`checkout ${baseBranch}`, repoPath, logFn);

  // Pull latest changes
  await execGit(`pull origin ${baseBranch}`, repoPath, logFn);

  // Create and checkout new branch
  await execGit(`checkout -b ${branchName}`, repoPath, logFn);
}

/**
 * Stage all changes
 */
export async function stageChanges(
  repoPath: string,
  logFn?: (message: string) => void
): Promise<void> {
  await execGit('add -A', repoPath, logFn);
}

/**
 * Create a commit
 */
export async function createCommit(
  repoPath: string,
  message: string,
  logFn?: (message: string) => void
): Promise<string> {
  await execGit(`commit -m "${message.replace(/"/g, '\\"')}"`, repoPath, logFn);

  // Get the commit SHA
  const { stdout } = await execGit('rev-parse HEAD', repoPath, logFn);
  return stdout.trim();
}

/**
 * Push changes to remote
 */
export async function pushChanges(
  config: GitConfig,
  branchName: string,
  logFn?: (message: string) => void
): Promise<void> {
  // Get remote URL
  const { stdout: remoteUrl } = await execGit('config --get remote.origin.url', config.repoPath);
  const cleanUrl = remoteUrl.trim();

  // Inject token into HTTPS URL
  let authenticatedUrl: string;
  if (cleanUrl.startsWith('https://')) {
    authenticatedUrl = cleanUrl.replace('https://', `https://x-access-token:${config.token}@`);
  } else if (cleanUrl.startsWith('git@')) {
    // Convert SSH to HTTPS
    const match = cleanUrl.match(/git@github\.com:(.+)\.git/);
    if (match) {
      authenticatedUrl = `https://x-access-token:${config.token}@github.com/${match[1]}.git`;
    } else {
      throw new Error('Unable to parse git remote URL');
    }
  } else {
    throw new Error('Unsupported git remote URL format');
  }

  // Push using authenticated URL
  await execGit(`push ${authenticatedUrl} ${branchName}`, config.repoPath, logFn);
}

/**
 * Create a pull request using GitHub API
 */
export async function createPullRequest(
  config: GitConfig,
  branchName: string,
  title: string,
  description: string,
  logFn?: (message: string) => void
): Promise<string> {
  if (!config.repoOwner || !config.repoName) {
    throw new Error('repoOwner and repoName required for PR creation');
  }

  logFn?.(`Creating PR: ${title}`);

  const response = await fetch(
    `https://api.github.com/repos/${config.repoOwner}/${config.repoName}/pulls`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        title,
        body: description,
        head: branchName,
        base: config.defaultBranch,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create PR: ${response.status} ${error}`);
  }

  const pr = await response.json();
  logFn?.(`PR created: ${pr.html_url}`);

  return pr.html_url;
}

/**
 * Get commit URL
 */
export function getCommitUrl(
  repoOwner: string,
  repoName: string,
  commitSha: string
): string {
  return `https://github.com/${repoOwner}/${repoName}/commit/${commitSha}`;
}

/**
 * Complete git workflow: stage, commit, push, optionally create PR
 */
export async function executeGitWorkflow(
  config: GitConfig,
  commitMessage: string,
  prTitle?: string,
  prDescription?: string,
  logFn?: (message: string) => void
): Promise<GitResult> {
  try {
    // Configure git
    await configureGit(config, logFn);

    // Check if there are changes
    const isClean = await isWorkingDirectoryClean(config.repoPath, logFn);
    if (isClean) {
      logFn?.('No changes to commit');
      return { error: 'No changes to commit' };
    }

    const branchName = config.branch;
    let commitUrl: string | undefined;
    let prUrl: string | undefined;

    if (config.prMode && prTitle) {
      // PR mode: create branch, commit, push, create PR
      logFn?.('PR mode enabled - creating new branch');
      await createBranch(config.repoPath, branchName, config.defaultBranch, logFn);
    } else {
      // Direct push mode
      logFn?.(`Direct push mode - pushing to ${branchName}`);
      await execGit(`checkout ${branchName}`, config.repoPath, logFn);
    }

    // Stage changes
    await stageChanges(config.repoPath, logFn);

    // Commit
    const commitSha = await createCommit(config.repoPath, commitMessage, logFn);
    logFn?.(`Commit created: ${commitSha}`);

    // Generate commit URL
    if (config.repoOwner && config.repoName) {
      commitUrl = getCommitUrl(config.repoOwner, config.repoName, commitSha);
    }

    // Push
    await pushChanges(config, branchName, logFn);

    // Create PR if in PR mode
    if (config.prMode && prTitle && prDescription) {
      prUrl = await createPullRequest(
        config,
        branchName,
        prTitle,
        prDescription,
        logFn
      );
    }

    return {
      commitSha,
      commitUrl,
      prUrl,
    };
  } catch (error: any) {
    logFn?.(`Git workflow error: ${error.message}`);
    return {
      error: error.message,
    };
  }
}
