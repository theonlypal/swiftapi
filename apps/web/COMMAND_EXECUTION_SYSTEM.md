# Command Execution and GitHub Automation System

Complete implementation of the command execution system for SwiftAPI with GitHub automation, live log streaming, and Vercel deployment integration.

## 📋 Implementation Summary

### PHASE A - Command API ✅

#### 1. POST /api/command
**File:** `app/api/command/route.ts`

Creates and executes commands asynchronously.

**Request:**
```json
{
  "commandText": "Add API endpoint /api/users/profile that returns user data",
  "dryRun": false
}
```

**Response:**
```json
{
  "jobId": "clx1234567890",
  "remaining": 45,
  "plan": "Pro"
}
```

**Features:**
- Authentication required (NextAuth session)
- Rate limiting with subscription checks
- Asynchronous execution (returns immediately)
- Dry run mode for testing without applying changes

#### 2. GET /api/status/[jobId]
**File:** `app/api/status/[jobId]/route.ts`

Returns current status and execution details.

**Response:**
```json
{
  "status": "complete",
  "phases": [
    {
      "name": "parse",
      "status": "complete",
      "startedAt": "2025-10-21T23:20:00Z",
      "completedAt": "2025-10-21T23:20:01Z",
      "logs": "Parsed: add_api_endpoint"
    },
    {
      "name": "apply_changes",
      "status": "complete",
      "startedAt": "2025-10-21T23:20:01Z",
      "completedAt": "2025-10-21T23:20:05Z",
      "logs": "Modified 1 files"
    },
    {
      "name": "git_operations",
      "status": "complete",
      "startedAt": "2025-10-21T23:20:05Z",
      "completedAt": "2025-10-21T23:20:15Z",
      "logs": "Commit: abc1234"
    }
  ],
  "links": {
    "commitUrl": "https://github.com/owner/repo/commit/abc1234567890",
    "prUrl": "https://github.com/owner/repo/pull/42",
    "deployUrl": "https://your-app.vercel.app"
  },
  "createdAt": "2025-10-21T23:20:00Z",
  "completedAt": "2025-10-21T23:20:15Z",
  "commandText": "Add API endpoint /api/users/profile",
  "dryRun": false
}
```

#### 3. GET /api/logs/[jobId]/stream
**File:** `app/api/logs/[jobId]/stream/route.ts`

Server-Sent Events (SSE) endpoint for live log streaming.

**Event Format:**
```javascript
// Connection established
data: {"type":"connected","timestamp":1729551600000}

// Log messages
data: {"type":"log","message":"Parsing command...","timestamp":1729551601000}

// Phase updates
data: {"type":"phase","phase":"parse","status":"complete","timestamp":1729551602000}

// Completion
data: {"type":"complete","message":"Execution complete","timestamp":1729551615000}

// Errors
data: {"type":"error","message":"Git workflow failed","timestamp":1729551610000}
```

**Client Usage Example:**
```javascript
const eventSource = new EventSource(`/api/logs/${jobId}/stream`);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type, data.message);
};

eventSource.onerror = () => {
  console.error('Connection lost');
  eventSource.close();
};
```

---

### PHASE B - Worker/Executor ✅

#### Core Files

**1. lib/executor.ts**
Main command execution orchestrator.

**Key Functions:**
- `executeCommand(commandId, commandText, dryRun, config)` - Main execution flow
- `applyFileEdits(files, repoPath, log)` - Apply file system changes
- `createPhase(commandId, name, status)` - Track execution phases
- `updatePhase(commandId, name, status, logs)` - Update phase status
- `triggerVercelDeploy(token, projectId, log)` - Trigger Vercel deployment
- `getExecutorConfigFromEnv()` - Load configuration from environment

**Execution Flow:**
1. **Parse Phase** - Parse command into structured actions
2. **Apply Changes Phase** - Modify files on disk
3. **Git Operations Phase** - Stage, commit, push, create PR
4. **Deploy Phase** (optional) - Trigger Vercel deployment

**2. lib/command-parser.ts**
Parses natural language commands into file operations.

**Supported Command Patterns:**
- `"Add API endpoint /api/users/profile"` → Creates new API route
- `"Create component UserProfile"` → Creates new React component
- `"Update authentication flow"` → Updates existing files
- `"Fix login bug in auth.ts"` → Applies targeted fixes

**ParsedCommand Interface:**
```typescript
interface ParsedCommand {
  intent: string;
  files: FileEdit[];
  commitMessage: string;
  branchName?: string;
  prTitle?: string;
  prDescription?: string;
}

interface FileEdit {
  path: string;
  operation: 'create' | 'update' | 'delete';
  content?: string;
  oldContent?: string;
  newContent?: string;
}
```

**3. lib/github.ts**
GitHub and git operations handler.

**Key Functions:**
- `configureGit(config, logFn)` - Set git user.name and user.email
- `createBranch(repoPath, branchName, baseBranch, logFn)` - Create new branch
- `stageChanges(repoPath, logFn)` - git add -A
- `createCommit(repoPath, message, logFn)` - Create commit, return SHA
- `pushChanges(config, branchName, logFn)` - Push with token authentication
- `createPullRequest(config, branchName, title, description, logFn)` - GitHub API PR creation
- `executeGitWorkflow(config, commitMessage, prTitle, prDescription, logFn)` - Complete workflow

**GitConfig Interface:**
```typescript
interface GitConfig {
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
```

**4. lib/sse.ts**
Server-Sent Events utilities for live log streaming.

**Key Functions:**
- `createSSEStream(commandId)` - Create new SSE stream
- `broadcastLog(commandId, log)` - Send log to all connected clients
- `closeSSEConnections(commandId)` - Close all connections for a command
- `getActiveConnectionCount(commandId?)` - Monitor active connections

**Features:**
- Multiple simultaneous client connections
- Keep-alive pings every 30 seconds
- Automatic cleanup on disconnect
- JSON-encoded event data

---

### PHASE C - Database Schema ✅

#### Updated Models

**1. JobRun (Enhanced)**
```prisma
model JobRun {
  id         String   @id @default(cuid())
  jobId      String
  startedAt  DateTime @default(now())
  durationMs Int
  statusCode Int
  ok         Boolean
  errorMsg   String?
  sampleBody String?
  commitUrl  String?  // ✨ NEW
  prUrl      String?  // ✨ NEW
  deployUrl  String?  // ✨ NEW
  job        Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
}
```

**2. Command (New)**
```prisma
model Command {
  id          String         @id @default(cuid())
  userId      String
  commandText String
  dryRun      Boolean        @default(false)
  status      String         @default("pending")
  commitUrl   String?
  prUrl       String?
  deployUrl   String?
  createdAt   DateTime       @default(now())
  completedAt DateTime?
  user        User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  phases      CommandPhase[]

  @@index([userId])
  @@index([status])
}
```

**Status Values:**
- `pending` - Created, waiting to execute
- `running` - Currently executing
- `complete` - Successfully completed
- `failed` - Execution failed

**3. CommandPhase (New)**
```prisma
model CommandPhase {
  id          String    @id @default(cuid())
  commandId   String
  name        String
  status      String    @default("pending")
  startedAt   DateTime?
  completedAt DateTime?
  logs        String?
  command     Command   @relation(fields: [commandId], references: [id], onDelete: Cascade)

  @@index([commandId])
}
```

**Phase Names:**
- `parse` - Command parsing
- `apply_changes` - File modifications
- `git_operations` - Git commit and push
- `deploy` - Deployment trigger (optional)

**Migration File:**
`prisma/migrations/20251021232007_add_command_execution_system/migration.sql`

To apply the migration:
```bash
npx prisma migrate deploy
# or
npx prisma migrate dev
```

---

## 🔧 Configuration

### Environment Variables

Copy `.env.command-execution` to your `.env.local` and configure:

```bash
# Git Configuration
GIT_COMMIT_AUTHOR_NAME="SwiftAPI Bot"
GIT_COMMIT_AUTHOR_EMAIL="bot@swiftapi.dev"

# GitHub Configuration (REQUIRED)
GITHUB_TOKEN="ghp_your_personal_access_token"
GITHUB_BRANCH="main"
GITHUB_DEFAULT_BRANCH="main"
GITHUB_REPO_OWNER="your-username"
GITHUB_REPO_NAME="your-repo"

# PR Mode
PR_MODE="true"  # true = create PRs, false = push directly

# Repository Path
REPO_PATH="/path/to/your/repo"  # Default: current directory

# Vercel Deployment (Optional)
VERCEL_TOKEN="your_vercel_token"
VERCEL_PROJECT_ID="prj_your_project_id"
```

### GitHub Token Setup

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic) with scopes:
   - `repo` - Full control of repositories
   - `workflow` - Update GitHub Action workflows
3. Copy token to `GITHUB_TOKEN` environment variable

**Note:** Never commit tokens to version control!

---

## 🚀 Usage Examples

### Example 1: Create New API Endpoint

```bash
curl -X POST http://localhost:3000/api/command \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "commandText": "Add API endpoint /api/users/profile that returns user profile data"
  }'
```

**Response:**
```json
{
  "jobId": "clx123abc456",
  "remaining": 45,
  "plan": "Pro"
}
```

**What Happens:**
1. Parses command → Intent: `add_api_endpoint`
2. Creates `app/api/users/profile/route.ts` with template
3. Git: stages, commits, pushes
4. Creates PR: "Add /api/users/profile endpoint"
5. Returns PR URL in status endpoint

### Example 2: Create React Component

```bash
curl -X POST http://localhost:3000/api/command \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "commandText": "Create component UserAvatar"
  }'
```

**Result:**
- Creates `components/UserAvatar.tsx`
- Commits: "Create UserAvatar component"
- Creates PR with component template

### Example 3: Dry Run (No Changes)

```bash
curl -X POST http://localhost:3000/api/command \
  -H "Content-Type: application/json" \
  -d '{
    "commandText": "Update pricing page with new tiers",
    "dryRun": true
  }'
```

**Result:**
- Parses command
- Logs planned changes
- No files modified
- No git operations

### Example 4: Live Log Streaming

```javascript
// Frontend implementation
const jobId = 'clx123abc456';
const eventSource = new EventSource(`/api/logs/${jobId}/stream`);

eventSource.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);

  switch (data.type) {
    case 'connected':
      console.log('Stream connected');
      break;

    case 'log':
      console.log(`[LOG] ${data.message}`);
      break;

    case 'phase':
      console.log(`[PHASE] ${data.phase}: ${data.status}`);
      break;

    case 'complete':
      console.log('Execution complete!');
      eventSource.close();
      break;

    case 'error':
      console.error(`[ERROR] ${data.message}`);
      eventSource.close();
      break;
  }
});

eventSource.addEventListener('error', () => {
  console.error('Connection lost');
  eventSource.close();
});
```

---

## 📊 Architecture Overview

```
┌─────────────────┐
│   POST /command │  Create command, return jobId
└────────┬────────┘
         │
         ├──────────────────────────────┐
         │                              │
         ▼                              ▼
┌────────────────┐           ┌──────────────────┐
│ Command Record │           │ Background Worker│
│  (DB: pending) │           │   (executor.ts)  │
└────────────────┘           └────────┬─────────┘
                                      │
                             ┌────────┴─────────┐
                             │                  │
                    ┌────────▼────────┐  ┌──────▼──────┐
                    │ command-parser  │  │     SSE     │
                    │   (parse intent)│  │  (broadcast)│
                    └────────┬────────┘  └──────▲──────┘
                             │                  │
                    ┌────────▼────────┐         │
                    │  Apply Edits    │─────────┤
                    │  (filesystem)   │   logs  │
                    └────────┬────────┘         │
                             │                  │
                    ┌────────▼────────┐         │
                    │  github.ts      │─────────┤
                    │  (git workflow) │   logs  │
                    └────────┬────────┘         │
                             │                  │
                    ┌────────▼────────┐         │
                    │ Vercel Deploy   │─────────┘
                    │   (optional)    │   logs
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Update Command  │
                    │  (status: done) │
                    │  + links        │
                    └─────────────────┘
```

**Client Interactions:**
```
GET /api/status/[jobId]      →  Current status + phases + links
GET /api/logs/[jobId]/stream →  Live SSE stream
```

---

## 🔐 Security Considerations

1. **Authentication Required**
   - All endpoints require NextAuth session
   - User ownership verified for all operations

2. **Rate Limiting**
   - Integrated with existing subscription system
   - Free tier: Limited commands per month
   - Pro tier: Unlimited commands

3. **Token Security**
   - GitHub tokens stored in environment only
   - Never exposed to client
   - Used only in server-side operations

4. **Input Validation**
   - Zod schema validation on all inputs
   - Command text limited to 1000 characters
   - File paths validated before operations

5. **Repository Isolation**
   - Commands execute in configured REPO_PATH only
   - No access to system files outside repo

---

## 🧪 Testing

### Manual Testing

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Set up environment variables** in `.env.local`

3. **Test command endpoint:**
   ```bash
   # Get session cookie from browser DevTools
   curl -X POST http://localhost:3000/api/command \
     -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"commandText":"Add API endpoint /api/test","dryRun":true}'
   ```

4. **Check status:**
   ```bash
   curl http://localhost:3000/api/status/JOB_ID \
     -H "Cookie: next-auth.session-token=YOUR_TOKEN"
   ```

5. **Stream logs:**
   Open in browser: `http://localhost:3000/api/logs/JOB_ID/stream`

### Integration Testing

Test the full workflow:
```bash
# 1. Create command
RESPONSE=$(curl -s -X POST http://localhost:3000/api/command \
  -H "Cookie: $SESSION_COOKIE" \
  -H "Content-Type: application/json" \
  -d '{"commandText":"Create component TestComponent"}')

JOB_ID=$(echo $RESPONSE | jq -r '.jobId')
echo "Job ID: $JOB_ID"

# 2. Wait and poll status
sleep 5
curl "http://localhost:3000/api/status/$JOB_ID" \
  -H "Cookie: $SESSION_COOKIE"

# 3. Check git history
cd $REPO_PATH
git log --oneline -1
git show
```

---

## 📝 Extending the System

### Add New Command Patterns

Edit `lib/command-parser.ts`:

```typescript
export function parseCommand(commandText: string): ParsedCommand {
  const lowerCommand = commandText.toLowerCase();

  // Add your custom pattern
  if (lowerCommand.includes('deploy') && lowerCommand.includes('staging')) {
    return parseDeployCommand(commandText, 'staging');
  }

  // ... existing patterns
}

function parseDeployCommand(commandText: string, environment: string): ParsedCommand {
  return {
    intent: 'deploy',
    files: [],
    commitMessage: `Deploy to ${environment}`,
    branchName: `deploy/${environment}`,
    prTitle: `Deploy to ${environment}`,
    prDescription: `Deployment to ${environment} environment`,
  };
}
```

### Add Custom Execution Phases

Edit `lib/executor.ts`:

```typescript
// Add after git operations
await createPhase(commandId, 'run_tests', 'running');
log('Running tests...');
try {
  await runTests(config.repoPath, log);
  await updatePhase(commandId, 'run_tests', 'complete', 'All tests passed');
} catch (error: any) {
  await updatePhase(commandId, 'run_tests', 'failed', error.message);
  throw error;
}
```

### Integrate with LLM for Better Parsing

Replace rule-based parser with OpenAI/Anthropic:

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function parseCommandWithAI(commandText: string): Promise<ParsedCommand> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a code generation assistant. Parse commands into structured file operations.',
      },
      {
        role: 'user',
        content: `Parse this command: "${commandText}"\n\nReturn JSON with: intent, files[], commitMessage, branchName, prTitle, prDescription`,
      },
    ],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content);
}
```

---

## 🎯 Implementation Checklist

- ✅ Database schema updated (Command, CommandPhase, JobRun links)
- ✅ POST /api/command endpoint created
- ✅ GET /api/status/[jobId] endpoint created
- ✅ GET /api/logs/[jobId]/stream SSE endpoint created
- ✅ Command parser (lib/command-parser.ts)
- ✅ GitHub operations (lib/github.ts)
- ✅ SSE utilities (lib/sse.ts)
- ✅ Main executor (lib/executor.ts)
- ✅ Migration file created
- ✅ Environment configuration template
- ✅ Documentation complete

---

## 📚 Additional Resources

**Files Created:**
- `app/api/command/route.ts` - Command execution API
- `app/api/status/[jobId]/route.ts` - Status check API
- `app/api/logs/[jobId]/stream/route.ts` - SSE logs API
- `lib/executor.ts` - Main execution orchestrator
- `lib/command-parser.ts` - Command intent parser
- `lib/github.ts` - Git operations handler
- `lib/sse.ts` - Server-Sent Events utilities
- `prisma/schema.prisma` - Updated database schema
- `prisma/migrations/.../migration.sql` - Migration file
- `.env.command-execution` - Environment template

**Environment Setup:**
1. Copy `.env.command-execution` to `.env.local`
2. Configure GitHub token and repository details
3. Run `npx prisma migrate deploy` to apply schema
4. Restart development server

**Next Steps:**
1. Apply database migration
2. Configure environment variables
3. Test with dry run commands
4. Set up GitHub repository access
5. Configure Vercel deployment (optional)
6. Build frontend UI for command execution
7. Add LLM integration for smarter parsing (optional)

---

**System Status:** ✅ Complete and ready for deployment
**Documentation:** Comprehensive implementation guide included
**Testing:** Manual testing procedures documented
