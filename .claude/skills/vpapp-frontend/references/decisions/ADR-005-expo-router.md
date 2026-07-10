# ADR-005: Expo Router

**Date:** 2025
**Status:** Accepted

## Context

VPApp needs navigation between auth screens, form selection, form engine, dashboard, house visit, approval, and renewal screens. The app has deep linking requirements and file-based routing preferences.

## Decision

Use **Expo Router** (v6) for navigation.

## Rationale

- **File-based routing** — Routes are defined by file structure in `src/app/`. No manual route configuration.
- **Expo ecosystem** — Native integration with Expo 54. No additional navigation library needed.
- **Deep linking** — Built-in URL-based navigation. Works with `expo-linking`.
- **Type safety** — Expo Router provides typed routes in newer versions.
- **Nested layouts** — `_layout.tsx` files enable shared layouts (tab bar, headers) without wrapper components.
- **Simpler than react-navigation** — No `Stack.Screen` registrations. Files ARE the routes.

## Trade-offs

- **Less control** — File-based routing is more opinionated than manual `react-navigation` setup.
- **Learning curve** — Team familiar with `react-navigation` needed to learn file-based routing conventions.
- **Bundle entry** — `expo-router/entry` is the app entry point, which changes the standard Expo bootstrap flow.

## Implementation

**Entry point:** `package.json` → `"main": "expo-router/entry"`

**Route structure:**
```
src/app/
  _layout.tsx          → Root layout
  index.tsx            → Splash/redirect
  login.tsx            → Login screen
  register.tsx         → Register screen
  form-selection.tsx   → Form type picker
  form-engine.tsx      → Form renderer (receives formType param)
  dashboard.tsx        → Student dashboard
  pdashboard.tsx       → Parent dashboard
  housevisit/          → House visit screens
  approval/            → Approval screens
  renewal-*.tsx        → Renewal form screens
```

**Form engine entry:**
```tsx
// src/app/form-engine.tsx
export default function FormEngineScreen() {
  const { formType } = useLocalSearchParams();
  return <FormRenderer formType={formType as FormType} />;
}
```
