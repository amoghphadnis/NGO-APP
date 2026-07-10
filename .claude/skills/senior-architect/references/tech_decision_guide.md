# Tech Decision Guide

VPApp-specific technology decisions with rationale and trade-offs. Full ADRs are in `vpapp-frontend/references/decisions/`.

## Zustand over Redux

**Decision:** Use Zustand v5 for state management.
**Why:**
- Single store for all form state (no slice management)
- No provider wrappers needed
- TypeScript inference out of the box
- ~1KB vs Redux Toolkit ~15KB
- Direct access: `useFormEngineStore()` → destructure what you need

**Trade-offs:**
- Less mature DevTools than Redux
- No time-travel debugging without middleware
- Smaller community ecosystem

**When to reconsider:** If the app grows to need multiple independent state domains (e.g., offline sync state separate from form state), consider a second Zustand store rather than Redux.

**ADR:** `vpapp-frontend/references/decisions/ADR-001-zustand-over-redux.md`

## Native Fetch over Axios

**Decision:** Use native `fetch` with `AbortController`.
**Why:**
- No external dependency
- Resolved axios "Network Error" issues on Android with multipart
- React Native's `fetch` handles `FormData` natively
- Full control over response parsing

**Trade-offs:**
- Custom `ApiError` class needed to match axios error shape
- No built-in interceptors (manual auth token injection)
- No auto JSON parsing

**When to reconsider:** If the project needs request/response interceptors for logging, retry logic, or request queuing, evaluate adding a thin wrapper or middleware layer on top of `fetch` rather than switching to axios.

**ADR:** `vpapp-frontend/references/decisions/ADR-002-native-fetch.md`

## Config-Driven Form Engine

**Decision:** Use a config-driven engine with a form registry.
**Why:**
- Single `FormRenderer` handles all 4 form types
- Adding form types is additive (config + components + registry)
- Step order is declarative
- Validation mapping is explicit in config

**Trade-offs:**
- Indirection: reading code requires understanding registry → config → component map flow
- `FormDataUnion` requires type guards for safe narrowing
- Shared sections (PUC using Professional's Review/Success) have form-specific logic leaks

**When to reconsider:** If form types diverge so much that shared components cause more bugs than they prevent, consider splitting into per-form renderers while keeping the registry for metadata.

**ADR:** `vpapp-frontend/references/decisions/ADR-003-config-driven-forms.md`

## Zod over Yup

**Decision:** Use Zod v4 for all validation.
**Why:**
- `z.infer<typeof schema>` generates TypeScript types automatically
- `@hookform/resolvers/zod` integrates seamlessly with React Hook Form
- Composable: per-section schemas combine into full-form schemas
- `z.custom<T>()` handles complex types like `UploadedDocument`

**Trade-offs:**
- Larger bundle than Yup (~8KB vs ~6KB)
- Different API style (chaining vs Yup's object syntax)
- Async validation less ergonomic (requires `.refine()` with async)

**When to reconsider:** Never. Zod is the project standard. `yup` should be removed from `package.json`.

**ADR:** `vpapp-frontend/references/decisions/ADR-004-zod.md`

## Expo Router over React Navigation

**Decision:** Use Expo Router v6 for navigation.
**Why:**
- File-based routing: files in `src/app/` ARE the routes
- Native Expo integration (no separate navigation library)
- Built-in deep linking via `expo-linking`
- Nested layouts via `_layout.tsx` files

**Trade-offs:**
- More opinionated than manual `react-navigation` setup
- `expo-router/entry` as app entry point changes standard Expo bootstrap
- Less granular control over navigation stack configuration

**When to reconsider:** If the app needs complex navigation patterns (nested stacks with custom transitions, modal stacks with specific behaviors) that file-based routing can't express, evaluate falling back to `react-navigation` directly. Currently, Expo Router handles all VPApp navigation needs.

**ADR:** `vpapp-frontend/references/decisions/ADR-005-expo-router.md`

## Decisions NOT Made (Yet)

| Question | Current State | Recommendation |
|---|---|---|
| Form data persistence | No persistence (lost on app kill) | Add AsyncStorage persistence for in-progress forms |
| Offline submission | Not supported | Queue submissions with background sync if needed |
| Image compression | No compression before upload | Add expo-image-manipulator for large images |
| Token refresh | No refresh token flow | Implement if backend supports it |
| Analytics | No analytics tracking | Add if NGO requires usage data |
