# .claude/ — VPApp AI Skills & Agents

This directory contains project-aware AI skills, agents, and tooling for the Vidya Poshak Scholarship App (VPApp).

## Skills Overview

| Skill | Directory | Purpose |
|---|---|---|
| **VPApp Frontend** | `skills/vpapp-frontend/` | Frontend engineering handbook: form engine, VP UI System, submission pipeline, mapper conventions, AI development rules, ADRs |
| **VPApp Testing** | `skills/vpapp-testing/` | Testing strategy: Jest + RNTL setup, test patterns, acceptance checklists, failure scenarios |
| **Senior Architect** | `skills/senior-architect/` | Architecture governance: patterns, system design workflows, tech decisions, consistency checks, health report |

## Agents

| Agent | File | Purpose |
|---|---|---|
| **Mobile App Developer** | `agents/mobile-app-developer.md` | Native and cross-platform mobile development (React Native, Expo, iOS, Android) |
| **Code Reviewer** | `agents/code-reviewer.md` | Code quality, security, and best practices review with TypeScript-specific checks |

## How They Interact

```
User Request
    │
    ├── Frontend feature/form work → vpapp-frontend skill
    │       └── References: VP UI System, Form Engine, Submission Pipeline, AI Rules, ADRs
    │
    ├── Testing/QA work → vpapp-testing skill
    │       └── References: Test Setup, Test Patterns, Acceptance Checklists, Failure Scenarios
    │
    ├── Architecture decisions → senior-architect skill
    │       └── References: Architecture Patterns, System Design, Tech Decisions
    │       └── Scripts: check-form-consistency, architecture-health, update-project-context
    │
    ├── Code review → code-reviewer agent
    │       └── TypeScript checks, security, error handling
    │
    └── Mobile platform work → mobile-app-developer agent
            └── React Native, Expo, platform normalization, accessibility
```

## When to Use Each

- **vpapp-frontend:** Building form sections, modifying FormRenderer, adding UI components, changing mappers, working with Zustand store
- **vpapp-testing:** Writing tests, setting up Jest, designing test strategies, manual QA, NGO acceptance
- **senior-architect:** Adding new form types, changing architecture, evaluating trade-offs, generating project context
- **code-reviewer:** Pre-PR review, security audit, TypeScript quality check
- **mobile-app-developer:** Platform-specific optimization, native modules, accessibility, app store preparation

## Available Scripts

### npm scripts (most frequently used)

```bash
npm run vp:generate    # Scaffold a new form section
npm run vp:validate    # Validate form configs (duplicate steps, missing components)
npm run vp:audit       # Audit design system compliance (raw TextInput, hardcoded colors)
npm run vp:context     # Regenerate PROJECT_CONTEXT_CURRENT.md + .json
npm run vp:health      # Architecture health report (like `flutter doctor`)
```

### Direct execution (less frequent)

```bash
npx tsx .claude/skills/vpapp-frontend/scripts/check-field-contracts.ts      # Schema → mapper → store drift
npx tsx .claude/skills/senior-architect/scripts/check-form-consistency.ts   # Registry ↔ config ↔ mapper ↔ schema
npx tsx .claude/skills/senior-architect/scripts/dependency_analyzer.ts      # Unused dependencies
npx tsx .claude/skills/vpapp-testing/scripts/check-dead-deps.ts             # Dead deps + legacy files
npx tsx .claude/skills/vpapp-testing/scripts/generate-test.ts               # Generate test file for a module
```

## ADR Index

| ADR | Decision | File |
|---|---|---|
| ADR-001 | Zustand over Redux | `skills/vpapp-frontend/references/decisions/ADR-001-zustand-over-redux.md` |
| ADR-002 | Native Fetch over Axios | `skills/vpapp-frontend/references/decisions/ADR-002-native-fetch.md` |
| ADR-003 | Config-Driven Form Engine | `skills/vpapp-frontend/references/decisions/ADR-003-config-driven-forms.md` |
| ADR-004 | Zod over Yup | `skills/vpapp-frontend/references/decisions/ADR-004-zod.md` |
| ADR-005 | Expo Router | `skills/vpapp-frontend/references/decisions/ADR-005-expo-router.md` |

## Related Configuration

| File | Purpose |
|---|---|
| `.devin/rules/instructions.md` | Native build guardrails (Android manifest, Gradle, signing) |
| `.devin/project-context/instructions.md` | Rules for maintaining PROJECT_CONTEXT_CURRENT.md |
| `PROJECT_CONTEXT_CURRENT.md` | Current project state (auto-generated via `npm run vp:context`) |
| `PROJECT_CONTEXT_CURRENT.json` | Machine-readable project state (auto-generated via `npm run vp:context`) |
