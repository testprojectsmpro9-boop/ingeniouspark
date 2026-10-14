---
name: mem-search
description: Search claude-mem's persistent cross-session memory database. Use when user asks "did we already solve this?", "how did we do X last time?", or needs work from previous sessions.
---

# Memory Search

Search past work across all sessions. Simple workflow: search → filter → fetch.

## When to Use

Use when users ask about PREVIOUS sessions (not current conversation):
- "Did we already fix this?"
- "How did we solve X last time?"
- "What happened last week?"

## 3-Layer Workflow (ALWAYS Follow)

**NEVER fetch full details without filtering first. 10x token savings.**

### Step 1: Search — Get Index with IDs

```
search(query="authentication", limit=20, project="my-project")
```

Returns: Table with IDs, timestamps, types, titles (~50-100 tokens/result)

Parameters: `query`, `limit` (max 100), `project`, `type` (observations/sessions/prompts), `obs_type` (bugfix/feature/decision/discovery/change), `dateStart`/`dateEnd` (YYYY-MM-DD), `offset`, `orderBy` (date_desc/date_asc/relevance)

### Step 2: Timeline — Get Context Around Results

```
timeline(anchor=11131, depth_before=3, depth_after=3, project="my-project")
```

Or find anchor from query:
```
timeline(query="authentication", depth_before=3, depth_after=3)
```

Parameters: `anchor` (ID), `query` (auto-find anchor), `depth_before` (max 20), `depth_after` (max 20), `project`

### Step 3: Fetch — Full Details for Filtered IDs

```
get_observations(ids=[11131, 10942])
```

Always use `get_observations` for 2+ — single request vs N requests.

Parameters: `ids` (array), `orderBy`, `limit`, `project`

Returns: Complete observation with title, subtitle, narrative, facts, concepts, files (~500-1000 tokens each)

## Examples

```
# Recent bug fixes
search(query="bug", obs_type="bugfix", limit=20, project="my-project")

# Last week
search(type="observations", dateStart="2025-11-11", limit=20, project="my-project")

# Context around a discovery
timeline(anchor=11131, depth_before=5, depth_after=5, project="my-project")

# Batch fetch details
get_observations(ids=[11131, 10942, 10855], orderBy="date_desc")
```

## Token Economics

- Search index: ~50-100 tokens/result
- Full observation: ~500-1000 tokens each
- **10x savings** by filtering before fetching

## Knowledge Agents

For synthesized answers use `/knowledge-agent` to build a queryable corpus from observation history.
