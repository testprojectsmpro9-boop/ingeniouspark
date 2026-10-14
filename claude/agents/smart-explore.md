---
name: smart-explore
description: Token-optimized structural code search using tree-sitter AST parsing. Use instead of reading full files when you need to understand code structure, find functions, or explore a codebase efficiently. Overrides default Read/Grep/Glob exploration behavior.
---

# Smart Explore

Structural code exploration using AST parsing. **While this skill is active, use smart_search/smart_outline/smart_unfold as primary tools instead of Read, Grep, and Glob.**

**Core principle:** Index first, fetch on demand. Get a map before loading implementation details.

## 3-Layer Workflow

### Step 1: Search — Discover Files and Symbols

```
smart_search(query="shutdown", path="./src", max_results=15)
```

Returns: Ranked symbols with signatures, line numbers, match reasons + folded file views (~2-6k tokens)

Parameters: `query`, `path` (default cwd), `max_results` (default 20, max 50), `file_pattern`

**This replaces Glob → Grep → Read discovery cycle.**

### Step 2: Outline — Get File Structure

```
smart_outline(file_path="services/worker-service.ts")
```

Returns: Complete structural skeleton — all functions, classes, methods, imports (~1-2k tokens)

Skip when Step 1's folded views already provide enough structure.

### Step 3: Unfold — See Implementation

```
smart_unfold(file_path="services/worker-service.ts", symbol_name="shutdown")
```

Returns: Full source of specified symbol including JSDoc and implementation (~400-2,100 tokens)

## When to Use Standard Tools Instead

- **Grep:** Exact string/regex search
- **Read:** Small files under ~100 lines, non-code files (JSON, markdown, config)
- **Glob:** File path patterns
- **Explore agent:** Cross-file synthesis, architecture narratives (smart-explore is a scalpel)

## Token Economics

| Approach | Tokens |
|----------|--------|
| smart_outline | ~1,000-2,000 |
| smart_unfold | ~400-2,100 |
| smart_search | ~2,000-6,000 |
| search + unfold | ~3,000-8,000 |
| Read (full file) | ~12,000+ |
| Explore agent | ~39,000-59,000 |

**4-8x savings** on file understanding. **11-18x savings** on codebase exploration.

## Supported Languages

JS, TS, TSX/JSX, Python, Go, Rust, Ruby, Java, C, C++. Other file types fall back to text search.

## Markdown Support

- `smart_outline` — extracts headings as symbol tree
- `smart_unfold` — expands heading sections
- Frontmatter included under synthetic `frontmatter` symbol

## Custom Grammars (.claude-mem.json)

```json
{
  "grammars": {
    ".sol": "tree-sitter-solidity",
    ".graphql": "tree-sitter-graphql"
  }
}
```
