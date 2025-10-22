/**
 * Command Executor - Executes parsed commands and manages workflow
 */

import { prisma } from './prisma';
import { parseCommand, FileEdit } from './command-parser';
import { executeGitWorkflow, GitConfig } from './github';
import { broadcastLog, closeSSEConnections } from './sse';
import { promises as fs } from 'fs';
import path from 'path';

export interface ExecutorConfig {
  repoPath: string;
  gitAuthorName: string;
  gitAuthorEmail: string;
  githubToken: string;
  githubBranch: string;
  defaultBranch: string;
  prMode: boolean;
  repoOwner?: string;
  repoName?: string;
  vercelToken?: string;
  vercelProjectId?: string;
}

export interface ExecutionResult {
  success: boolean;
  commitUrl?: string;
  prUrl?: string;
  deployUrl?: string;
  error?: string;
}

/**
 * Execute a command with full workflow
 */
export async function executeCommand(
  commandId: string,
  commandText: string,
  dryRun: boolean,
  config: ExecutorConfig
): Promise<ExecutionResult> {
  const log = (message: string) => {
    console.log(`[${commandId}] ${message}`);
    broadcastLog(commandId, { type: 'log', message });
  };

  try {
    // Update command status to running
    await prisma.command.update({
      where: { id: commandId },
      data: { status: 'running' },
    });

    // Phase 1: Parse command
    await createPhase(commandId, 'parse', 'running');
    log('Parsing command...');
    const parsed = parseCommand(commandText);
    log(`Intent: ${parsed.intent}`);
    log(`Files to modify: ${parsed.files.length}`);
    await updatePhase(commandId, 'parse', 'complete', `Parsed: ${parsed.intent}`);

    if (dryRun) {
      log('Dry run mode - skipping file modifications');
      await prisma.command.update({
        where: { id: commandId },
        data: { status: 'complete', completedAt: new Date() },
      });
      closeSSEConnections(commandId);
      return { success: true };
    }

    // Phase 2: Apply file changes
    await createPhase(commandId, 'apply_changes', 'running');
    log('Applying file changes...');
    await applyFileEdits(parsed.files, config.repoPath, log);
    await updatePhase(commandId, 'apply_changes', 'complete', `Modified ${parsed.files.length} files`);

    // Phase 3: Git operations
    await createPhase(commandId, 'git_operations', 'running');
    log('Executing git workflow...');

    const gitConfig: GitConfig = {
      repoPath: config.repoPath,
      authorName: config.gitAuthorName,
      authorEmail: config.gitAuthorEmail,
      token: config.githubToken,
      branch: parsed.branchName || config.githubBranch,
      defaultBranch: config.defaultBranch,
      prMode: config.prMode,
      repoOwner: config.repoOwner,
      repoName: config.repoName,
    };

    const gitResult = await executeGitWorkflow(
      gitConfig,
      parsed.commitMessage,
      config.prMode ? parsed.prTitle : undefined,
      config.prMode ? parsed.prDescription : undefined,
      log
    );

    if (gitResult.error) {
      throw new Error(`Git workflow failed: ${gitResult.error}`);
    }

    await updatePhase(
      commandId,
      'git_operations',
      'complete',
      `Commit: ${gitResult.commitSha?.substring(0, 7)}`
    );

    // Phase 4: Deploy (optional)
    let deployUrl: string | undefined;
    if (config.vercelToken && config.vercelProjectId) {
      await createPhase(commandId, 'deploy', 'running');
      log('Triggering deployment...');
      try {
        deployUrl = await triggerVercelDeploy(config.vercelToken, config.vercelProjectId, log);
        await updatePhase(commandId, 'deploy', 'complete', 'Deployment triggered');
      } catch (error: any) {
        log(`Deploy error: ${error.message}`);
        await updatePhase(commandId, 'deploy', 'failed', error.message);
      }
    }

    // Mark command as complete with links
    await prisma.command.update({
      where: { id: commandId },
      data: {
        status: 'complete',
        completedAt: new Date(),
        commitUrl: gitResult.commitUrl,
        prUrl: gitResult.prUrl,
        deployUrl,
      },
    });

    log('Command execution complete');
    broadcastLog(commandId, {
      type: 'complete',
      message: 'Execution complete',
    });
    closeSSEConnections(commandId);

    return {
      success: true,
      commitUrl: gitResult.commitUrl,
      prUrl: gitResult.prUrl,
      deployUrl,
    };
  } catch (error: any) {
    log(`ERROR: ${error.message}`);

    // Mark command as failed
    await prisma.command.update({
      where: { id: commandId },
      data: {
        status: 'failed',
        completedAt: new Date(),
      },
    });

    // Mark current phase as failed
    const phases = await prisma.commandPhase.findMany({
      where: { commandId, status: 'running' },
    });
    for (const phase of phases) {
      await prisma.commandPhase.update({
        where: { id: phase.id },
        data: { status: 'failed', completedAt: new Date() },
      });
    }

    broadcastLog(commandId, {
      type: 'error',
      message: error.message,
    });
    closeSSEConnections(commandId);

    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Apply file edits to the filesystem
 */
async function applyFileEdits(
  files: FileEdit[],
  repoPath: string,
  log: (message: string) => void
): Promise<void> {
  for (const file of files) {
    const fullPath = path.join(repoPath, file.path);
    log(`${file.operation}: ${file.path}`);

    try {
      if (file.operation === 'create') {
        // Ensure directory exists
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, file.content || '', 'utf-8');
      } else if (file.operation === 'update') {
        if (file.oldContent && file.newContent) {
          // Replace specific content
          const currentContent = await fs.readFile(fullPath, 'utf-8');
          const updatedContent = currentContent.replace(file.oldContent, file.newContent);
          await fs.writeFile(fullPath, updatedContent, 'utf-8');
        } else if (file.content) {
          // Replace entire file
          await fs.writeFile(fullPath, file.content, 'utf-8');
        }
      } else if (file.operation === 'delete') {
        await fs.unlink(fullPath);
      }
    } catch (error: any) {
      throw new Error(`Failed to ${file.operation} ${file.path}: ${error.message}`);
    }
  }
}

/**
 * Create a new phase
 */
async function createPhase(
  commandId: string,
  name: string,
  status: string
): Promise<void> {
  await prisma.commandPhase.create({
    data: {
      commandId,
      name,
      status,
      startedAt: new Date(),
    },
  });

  broadcastLog(commandId, {
    type: 'phase',
    phase: name,
    status,
  });
}

/**
 * Update a phase
 */
async function updatePhase(
  commandId: string,
  name: string,
  status: string,
  logs?: string
): Promise<void> {
  const phase = await prisma.commandPhase.findFirst({
    where: { commandId, name },
    orderBy: { startedAt: 'desc' },
  });

  if (phase) {
    await prisma.commandPhase.update({
      where: { id: phase.id },
      data: {
        status,
        completedAt: status !== 'running' ? new Date() : undefined,
        logs: logs || phase.logs,
      },
    });

    broadcastLog(commandId, {
      type: 'phase',
      phase: name,
      status,
      message: logs,
    });
  }
}

/**
 * Trigger Vercel deployment
 */
async function triggerVercelDeploy(
  token: string,
  projectId: string,
  log: (message: string) => void
): Promise<string> {
  log('Triggering Vercel deployment...');

  const response = await fetch(
    `https://api.vercel.com/v13/deployments`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: projectId,
        gitSource: {
          type: 'github',
          repoId: projectId,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Vercel deployment failed: ${response.status} ${error}`);
  }

  const deployment = await response.json();
  const deployUrl = `https://${deployment.url}`;
  log(`Deployment URL: ${deployUrl}`);

  return deployUrl;
}

/**
 * Check if GitHub environment variables are configured for command execution
 */
export function isGitHubConfigured(): boolean {
  return !!(
    process.env.GITHUB_TOKEN &&
    process.env.GITHUB_OWNER &&
    process.env.GITHUB_REPO &&
    process.env.GITHUB_BRANCH
  );
}

/**
 * Get executor config from environment variables
 */
export function getExecutorConfigFromEnv(): ExecutorConfig {
  return {
    repoPath: process.env.REPO_PATH || process.cwd(),
    gitAuthorName: process.env.GIT_COMMIT_AUTHOR_NAME || 'SwiftAPI Bot',
    gitAuthorEmail: process.env.GIT_COMMIT_AUTHOR_EMAIL || 'bot@swiftapi.dev',
    githubToken: process.env.GITHUB_TOKEN || '',
    githubBranch: process.env.GITHUB_BRANCH || 'main',
    defaultBranch: process.env.GITHUB_DEFAULT_BRANCH || 'main',
    prMode: process.env.PR_MODE === 'true',
    repoOwner: process.env.GITHUB_REPO_OWNER,
    repoName: process.env.GITHUB_REPO_NAME,
    vercelToken: process.env.VERCEL_TOKEN,
    vercelProjectId: process.env.VERCEL_PROJECT_ID,
  };
}
