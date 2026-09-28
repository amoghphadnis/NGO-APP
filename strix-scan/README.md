# Strix scan prep (authorized test environment)

Target: `https://vpwebservices.testserver.envisage-workflow.in/api`

## Status — preparation only, nothing has been sent to the target

## How credentials are handled (officially supported mechanism)

Strix takes target credentials through the `--instruction` / `--instruction-file`
option; it has no dedicated "target auth header" flag. To keep credentials out
of source files, the run script reads them from environment variables and
builds the instruction file at run time (in the git-ignored `strix-scan/`
directory). Never put the token in the command line or any tracked file.

## Required environment variables (set in your shell / secret store, not in files)

| Variable | Purpose |
|---|---|
| `GROQ_API_KEY` | Groq key, passed to Strix as `LLM_API_KEY` |
| `TARGET_API_TOKEN` | Bearer token for the target API (test-env credential) |

## LLM configuration

Strix uses LiteLLM model strings. Groq provider format: `groq/<model>`.
Verified model used here: `groq/llama-3.3-70b-versatile`.
Strix config lives in `~/.strix/cli-config.json` (auto-created) or via env vars.

## Install (run once)

```bash
pip install strix-agent
```
(Docker Desktop must be running — the first run pulls a sandbox image.)

## Run (when authorized to execute)

See `run-scan.sh.example`. Budget is capped with `--max-budget 5` and
`--max-turns 60`, scan mode `quick`.
