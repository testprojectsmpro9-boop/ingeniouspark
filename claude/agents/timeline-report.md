---
name: timeline-report
description: Generate a "Journey Into [Project]" narrative report analyzing a project's entire development history from claude-mem's timeline. Use when asked for a timeline report, project history analysis, development journey, or full project report.
---

# Timeline Report

Generate a comprehensive narrative analysis of a project's entire development history using claude-mem's persistent memory timeline.

## When to Use

- "Write a timeline report"
- "Journey into [project]"
- "Analyze my project history"
- "Summarize the entire development history"

## Prerequisites

claude-mem worker running on localhost:37777. Project must have claude-mem observations recorded.

## Workflow

### Step 1: Determine Project Name

Use current directory basename. Check for git worktree:

```bash
git_dir=$(git rev-parse --git-dir 2>/dev/null)
git_common_dir=$(git rev-parse --git-common-dir 2>/dev/null)
if [ "$git_dir" != "$git_common_dir" ]; then
  parent_project=$(basename "$(dirname "$git_common_dir")")
fi
```

### Step 2: Fetch Full Timeline

```bash
curl -s "http://localhost:37777/api/context/inject?project=PROJECT_NAME&full=true"
```

Token estimates: Small project (<1000 obs): ~20-50K tokens; Medium: ~50-300K; Large: ~300-750K

### Step 3: Estimate Token Count

Report estimate to user. Wait for confirmation if timeline exceeds 100K tokens.

### Step 4: Analyze with Subagent

Deploy Agent with full timeline and analysis prompt covering:
1. Project Genesis
2. Architectural Evolution
3. Key Breakthroughs
4. Work Patterns
5. Technical Debt
6. Challenges and Debugging Sagas
7. Memory and Continuity
8. Token Economics & Memory ROI (query SQLite at `~/.claude-mem/claude-mem.db`)
9. Timeline Statistics
10. Lessons and Meta-Observations

Key SQL queries for Token Economics:
```sql
SELECT SUM(discovery_tokens) FROM observations WHERE project = 'PROJECT_NAME';
SELECT COUNT(DISTINCT memory_session_id) FROM observations WHERE project = 'PROJECT_NAME';
SELECT id, title, discovery_tokens FROM observations WHERE project = 'PROJECT_NAME' ORDER BY discovery_tokens DESC LIMIT 5;
```

### Step 5: Save Report

```
./journey-into-PROJECT_NAME.md
```

## Error Handling

- Empty timeline: check project name with `curl -s 'http://localhost:37777/api/search?query=*&limit=1'`
- Worker not running: start with usual method or check `ps aux | grep worker-service`
