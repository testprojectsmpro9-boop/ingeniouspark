---
name: knowledge-agent
description: Build and query AI-powered knowledge bases from claude-mem observations. Use when users want to create focused "brains" from their observation history, ask questions about past work patterns, or compile expertise on specific topics.
---

# Knowledge Agent

Build and query AI-powered knowledge bases from claude-mem observations. Think of them as custom "brains": "everything about hooks", "all decisions from last month".

## Workflow

### Step 1: Build a corpus

```
build_corpus name="hooks-expertise" description="Everything about the hooks lifecycle" project="claude-mem" concepts="hooks" limit=500
```

Filter options: `project`, `types` (decision/bugfix/feature/refactor/discovery/change), `concepts`, `files` (path prefix), `query` (semantic), `dateStart`/`dateEnd`, `limit`

### Step 2: Prime the corpus

```
prime_corpus name="hooks-expertise"
```

Creates AI session loaded with all corpus knowledge.

### Step 3: Query

```
query_corpus name="hooks-expertise" question="What are the 5 lifecycle hooks and when does each fire?"
```

Follow-up questions maintain context.

### Step 4: List corpora

```
list_corpora
```

## Maintenance

```
rebuild_corpus name="hooks-expertise"  # refresh with new observations
reprime_corpus name="hooks-expertise"  # fresh session (clears prior Q&A)
```

## Tips

- **Focused corpora work best** — "hooks architecture" beats "everything ever"
- **Prime once, query many times** — session persists across queries
- **Reprime for fresh context** — if conversation drifts
- **Rebuild to update** — when new observations are added
