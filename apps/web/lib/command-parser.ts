/**
 * Command Parser - Parses natural language commands into structured actions
 */

export interface FileEdit {
  path: string;
  operation: 'create' | 'update' | 'delete';
  content?: string;
  oldContent?: string;
  newContent?: string;
}

export interface ParsedCommand {
  intent: string;
  files: FileEdit[];
  commitMessage: string;
  branchName?: string;
  prTitle?: string;
  prDescription?: string;
}

/**
 * Parse command text into structured actions
 * This is a rule-based parser. In production, you'd integrate with an LLM.
 */
export function parseCommand(commandText: string): ParsedCommand {
  const lowerCommand = commandText.toLowerCase();

  // Example patterns - extend these based on your needs
  if (lowerCommand.includes('add') && lowerCommand.includes('api')) {
    return parseAddApiCommand(commandText);
  }

  if (lowerCommand.includes('update') || lowerCommand.includes('modify')) {
    return parseUpdateCommand(commandText);
  }

  if (lowerCommand.includes('create') && lowerCommand.includes('component')) {
    return parseCreateComponentCommand(commandText);
  }

  if (lowerCommand.includes('fix') || lowerCommand.includes('bug')) {
    return parseFixCommand(commandText);
  }

  // Default: generic file edit
  return {
    intent: commandText,
    files: [],
    commitMessage: `Execute command: ${commandText}`,
    branchName: `auto/${generateBranchName(commandText)}`,
    prTitle: commandText,
    prDescription: `Automated changes requested via command:\n\n> ${commandText}`,
  };
}

function parseAddApiCommand(commandText: string): ParsedCommand {
  // Example: "Add API endpoint /api/users/profile that returns user data"
  const endpointMatch = commandText.match(/\/api\/[\w\/\-]+/);
  const endpoint = endpointMatch ? endpointMatch[0] : '/api/example';

  const routePath = `app${endpoint}/route.ts`;

  return {
    intent: 'add_api_endpoint',
    files: [
      {
        path: routePath,
        operation: 'create',
        content: generateApiTemplate(endpoint, commandText),
      },
    ],
    commitMessage: `Add ${endpoint} API endpoint`,
    branchName: `feature/${endpoint.replace(/\//g, '-').substring(1)}`,
    prTitle: `Add ${endpoint} endpoint`,
    prDescription: `Creates new API endpoint ${endpoint}\n\nRequested via: ${commandText}`,
  };
}

function parseUpdateCommand(commandText: string): ParsedCommand {
  return {
    intent: 'update_file',
    files: [], // Would need AI to determine specific edits
    commitMessage: `Update based on: ${commandText}`,
    branchName: `update/${generateBranchName(commandText)}`,
    prTitle: `Update: ${commandText.substring(0, 50)}`,
    prDescription: `Update requested:\n\n> ${commandText}`,
  };
}

function parseCreateComponentCommand(commandText: string): ParsedCommand {
  const componentNameMatch = commandText.match(/component\s+(\w+)/i);
  const componentName = componentNameMatch ? componentNameMatch[1] : 'NewComponent';

  return {
    intent: 'create_component',
    files: [
      {
        path: `components/${componentName}.tsx`,
        operation: 'create',
        content: generateComponentTemplate(componentName),
      },
    ],
    commitMessage: `Create ${componentName} component`,
    branchName: `feature/${componentName.toLowerCase()}`,
    prTitle: `Add ${componentName} component`,
    prDescription: `Creates new ${componentName} component\n\nRequested via: ${commandText}`,
  };
}

function parseFixCommand(commandText: string): ParsedCommand {
  return {
    intent: 'fix',
    files: [],
    commitMessage: `Fix: ${commandText}`,
    branchName: `fix/${generateBranchName(commandText)}`,
    prTitle: `Fix: ${commandText.substring(0, 50)}`,
    prDescription: `Bug fix:\n\n> ${commandText}`,
  };
}

function generateBranchName(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .join('-');
}

function generateApiTemplate(endpoint: string, description: string): string {
  return `import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * ${endpoint}
 * ${description}
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Implement endpoint logic
    const data = { message: 'Endpoint created successfully' };

    return NextResponse.json(data);
  } catch (error) {
    console.error('${endpoint} error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
`;
}

function generateComponentTemplate(name: string): string {
  return `import React from 'react';

interface ${name}Props {
  // Add props here
}

export function ${name}({}: ${name}Props) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">${name}</h2>
      {/* Add component content */}
    </div>
  );
}
`;
}
