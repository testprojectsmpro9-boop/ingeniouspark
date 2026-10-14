# Claude Code Team Setup

One-time setup to get all agents, skills, hooks, and memory working.
Takes ~5 minutes. Everything is optional — use what you want.

---

## What You Get

- **23 AI agents** — GSAP animations, UI/UX design system, caveman mode, memory search, code planning
- **Caveman hooks** — auto-injects terse communication mode each session
- **Claude-mem** — persistent memory across all Claude sessions (remembers past work)
- **MCP servers** — Magic UI components, Framer (get your own API keys)

---

## Step 1 — Copy Agents & Skills (Required for agents)

```bash
# Create global Claude dirs
mkdir -p ~/.claude/agents
mkdir -p ~/.claude/skills/ui-ux-pro-max
mkdir -p ~/.claude/hooks

# Copy agents (23 skill files)
cp -r claude/agents/. ~/.claude/agents/

# Copy ui-ux-pro-max Python scripts + data
cp -r claude/skills/ui-ux-pro-max/. ~/.claude/skills/ui-ux-pro-max/
```

---

## Step 2 — Install Caveman Hooks (Optional but recommended)

```bash
# Copy hook files
cp claude/hooks/caveman-activate.js ~/.claude/hooks/
cp claude/hooks/caveman-mode-tracker.js ~/.claude/hooks/
cp claude/hooks/caveman-config.js ~/.claude/hooks/
cp claude/hooks/package.json ~/.claude/hooks/

# Windows only — copy statusline
cp claude/hooks/caveman-statusline.ps1 ~/.claude/hooks/
# Mac/Linux — copy statusline
# cp claude/hooks/caveman-statusline.sh ~/.claude/hooks/
```

---

## Step 3 — Wire Hooks into settings.json

Add this to `~/.claude/settings.json` (create if it doesn't exist):

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node \"~/.claude/hooks/caveman-activate.js\""
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node \"~/.claude/hooks/caveman-mode-tracker.js\""
          }
        ]
      }
    ]
  },
  "statusLine": {
    "type": "command",
    "command": "powershell -ExecutionPolicy Bypass -File \"~/.claude/hooks/caveman-statusline.ps1\""
  }
}
```

> **Mac/Linux statusLine:**
> ```json
> "command": "bash \"~/.claude/hooks/caveman-statusline.sh\""
> ```

---

## Step 4 — Install Claude-Mem (Optional — persistent memory)

```bash
# Install Bun (required by claude-mem)
# Windows:
powershell -c "irm bun.sh/install.ps1 | iex"
# Mac/Linux:
curl -fsSL https://bun.sh/install | bash

# Restart terminal, then:
npx claude-mem install

# Start the memory worker
npx claude-mem start
```

If `npx claude-mem install` fails (claude CLI not in PATH), run this manually:

```bash
# Manual install
mkdir -p ~/.claude/plugins/marketplaces/thedotmack
# Then ask your team lead to share the plugin folder
# Or download: https://github.com/thedotmack/claude-mem
```

---

## Step 5 — MCP Servers (Optional — get your own API keys)

Add to `~/.claude/settings.json` under `"mcpServers"`:

```json
{
  "mcpServers": {
    "magic": {
      "command": "npx",
      "args": ["-y", "@21st-dev/magic@latest"],
      "env": {
        "API_KEY": "YOUR_21ST_DEV_API_KEY"
      },
      "scope": "user"
    }
  }
}
```

Get Magic API key: https://21st.dev
Get Framer MCP: https://unframer.co

---

## Step 6 — Restart Claude Code

Restart the VSCode Claude extension or Claude Code CLI to activate all hooks and agents.

---

## Verify Everything Works

```bash
# Check claude-mem worker
npx claude-mem status

# Test ui-ux-pro-max
python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard" --design-system

# In Claude Code — test caveman
# Type: /caveman
# Type: /caveman ultra
```

---

## What Each Agent Does

| Agent | How to Use |
|-------|-----------|
| `caveman` | `/caveman` — terse mode. `/caveman ultra` for max compression |
| `caveman-commit` | Ask: "write a commit message" |
| `caveman-review` | Ask: "review this PR" |
| `gsap-core` | Ask about GSAP animations |
| `gsap-scrolltrigger` | Ask about scroll animations |
| `gsap-react` | Ask about GSAP in React |
| `ui-ux-pro-max` | Ask: "design a landing page" or "review this UI" |
| `mem-search` | Ask: "did we already solve X?" |
| `make-plan` | Ask: "plan this feature" |
| `do-plan` | Ask: "execute this plan" |
| `smart-explore` | Ask: "explore the codebase" |

---

## Troubleshooting

**Agents not loading:** Check `~/.claude/agents/` has the .md files.

**Caveman not activating:** Check hook paths in `settings.json` use full absolute paths (not `~`).

**claude-mem failing:** Ensure Bun is installed and `npx claude-mem start` runs without error.

**ui-ux-pro-max failing:** Ensure Python 3 is installed — `python3 --version`.
