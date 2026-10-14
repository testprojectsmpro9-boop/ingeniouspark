---
name: claude-code-plugin-release
description: Automated semantic versioning and release workflow for Claude Code plugins. Handles version increments across package.json, marketplace.json, and plugin.json, build verification, git tagging, GitHub releases, and changelog generation.
---

# Version Bump & Release Workflow

**IMPORTANT:** Plan and write detailed release notes BEFORE starting the version bump workflow.

**CRITICAL:** ALWAYS commit EVERYTHING (including build artifacts). At the end, NOTHING should be left uncommitted or unpushed. Run `git status` at the end to verify.

## Preparation

1. **Analyze**: Determine if change is **PATCH** (bug fixes), **MINOR** (features), or **MAJOR** (breaking).
2. **Environment**: Identify repo owner and name (from `git remote -v`).
3. **Paths**: Verify existence of `package.json`, `.claude-plugin/marketplace.json`, `plugin/.claude-plugin/plugin.json`.

## Workflow

1. **Update**: Increment version strings in all config files.
2. **Verify**: Use `grep` to ensure all files match new version.
3. **Build**: Run `npm run build` to generate fresh artifacts.
4. **Commit**: `git add -A && git commit -m "chore: bump version to X.Y.Z"`.
5. **Tag**: `git tag -a vX.Y.Z -m "Version X.Y.Z"`.
6. **Push**: `git push origin main && git push origin vX.Y.Z`.
7. **Release**: `gh release create vX.Y.Z --title "vX.Y.Z" --notes "RELEASE_NOTES"`.
8. **Changelog**: `gh api repos/{owner}/{repo}/releases --paginate | ./scripts/generate_changelog.js > CHANGELOG.md`
9. **Sync**: Commit and push updated `CHANGELOG.md`.
10. **Notify**: Run `npm run discord:notify vX.Y.Z` if applicable.
11. **Finalize**: Run `git status` to ensure clean working tree.

## Checklist

- [ ] All config files have matching versions
- [ ] `npm run build` succeeded
- [ ] Git tag created and pushed
- [ ] GitHub release created with notes
- [ ] `CHANGELOG.md` updated and pushed
- [ ] `git status` shows clean tree
