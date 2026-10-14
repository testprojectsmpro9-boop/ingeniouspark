---
name: make-plan
description: Create a detailed, phased implementation plan with documentation discovery. Use when asked to plan a feature, task, or multi-step implementation — especially before executing with do.
---

# Make Plan

You are an ORCHESTRATOR. Create an LLM-friendly plan in phases that can be executed consecutively in new chat contexts.

## Delegation Model

Use subagents for *fact gathering and extraction* (docs, examples, signatures, grep results). Keep *synthesis and plan authoring* with the orchestrator. If a subagent report lacks evidence, redeploy.

### Subagent Reporting Contract (MANDATORY)

Each subagent response must include:
1. Sources consulted (files/URLs) and what was read
2. Concrete findings (exact API names/signatures, file paths)
3. Copy-ready snippet locations
4. "Confidence" note + known gaps

Reject and redeploy if subagent reports conclusions without sources.

## Plan Structure

### Phase 0: Documentation Discovery (ALWAYS FIRST)

Deploy "Documentation Discovery" subagents to:
1. Search for and read relevant documentation, examples, and existing patterns
2. Identify actual APIs, methods, and signatures available (not assumed)
3. Create "Allowed APIs" list citing specific documentation sources
4. Note anti-patterns (methods that DON'T exist, deprecated parameters)

Orchestrator consolidates findings into single Phase 0 output.

### Each Implementation Phase Must Include

1. **What to implement** — Frame tasks to COPY from docs, not transform existing code
   - Good: "Copy the V2 session pattern from docs/examples.ts:45-60"
   - Bad: "Migrate the existing code to V2"
2. **Documentation references** — Cite specific files/lines
3. **Verification checklist** — How to prove this phase worked
4. **Anti-pattern guards** — What NOT to do

### Final Phase: Verification

1. Verify all implementations match documentation
2. Check for anti-patterns (grep for known bad patterns)
3. Run tests to confirm functionality

## Key Principles

- Documentation Availability ≠ Usage: Explicitly require reading docs
- Task Framing Matters: Direct agents to docs, not just outcomes
- Verify > Assume: Require proof, not assumptions
- Session Boundaries: Each phase self-contained with own doc references

## Anti-Patterns to Prevent

- Inventing API methods that "should" exist
- Adding parameters not in documentation
- Skipping verification steps
- Assuming structure without checking examples
