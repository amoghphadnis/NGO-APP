# QA Test Report — Vidya Poshak App (NGO-APP)

**App:** Vidya Poshak scholarship app (Expo / React Native, TypeScript, expo-router, axios + React Query, Zustand, Zod)
**Test date:** 2026-09-26
**Tested by:** QA agent (static code analysis + automated suites; read-only — **no application code was changed**)
**Scope:** Full `src/` tree, `app.json`/`eas.json`, API contracts in `API Endpoints.md` and `Docs/`
**Client instructions covered:** (1) missing/broken links between components, (2) API fetch design vs API contracts, (3) UI enhancements needed — plus additional pre-launch testing requested by the team.

---

## Executive summary

| Area | Verdict |
|---|---|
| Broken/missing navigation links | **No broken route links found**, but there are **unreachable screens (whole feature), dead-end flows, and no back buttons on key screens** |
| API fetch design vs contracts | **4 core student forms + approvals/house-visit/volunteer are contract-faithful**; the **renewal trio + registration violate their contracts** — Payana Renewal will fail submission outright |
| UI enhancements needed | **Yes** — safe-area overlap, fake "verified" upload states, keyboard covering inputs, near-zero accessibility, search firing a request per keystroke |
| Automated checks | TypeScript clean · Jest 130/130 pass · ESLint **38 errors** incl. one crash-risk hook violation |
| Launch blocker | **Production build would call the test server** (`API_BASE_URL` hardcoded) |

**Top launch blockers (must fix before Play Store):**

1. `src/config/environment.ts:2` — API base URL hardcoded to the **test** server; every production APK hits it. No env/eas override exists.
2. **Payana Renewal submission is broken against its contract** — sends JSON + device file-URI strings instead of multipart file parts; `PayanaId` not enforced as required (`src/api/renewalPayanaApi.ts:44-87`, `src/validation/renewalPayanaSchemas.ts:9`). All 5 documents are silently lost on every submission.
3. `src/components/FormRenderer.tsx:151` — **React hook called conditionally** (rules-of-hooks) — crash risk in the main form engine.
4. Success screen after submission traps the user in the form: "Home" and "Exit" both restart the same form (`src/screens/form-sections/professional/SuccessSection.tsx:30-40`).
5. Approval list screens have **no back button** and ignore the top safe area (title under the notch) — 6 screens users reach from the dashboard (`src/screens/approval/GenericApprovalListScreen.tsx:183-228`, `PucApprovalListScreen.tsx:187-229`, `HouseVisitApprovalListScreen.tsx:211-253`).

---

## A. Missing / broken links between components (client ask #1)

### A1. Route inventory
40 route files under `src/app/` (expo-router). Every `router.push` / `href` / `Link` target in the app resolves to an existing file — **there are no links to non-existent routes**. Param passing was cross-checked and all passed params are read (form-engine `formType`, reset-password `email`, house-visit `studentId/source/studentName/houseVisitId/program`).

### A2. Unreachable screens (worse than broken links — the links were never built)

| Screens | Severity | Detail |
|---|---|---|
| `/approval/house-visit/{puc,payana,professional,semi-professional}` | **MAJOR** | Entire house-visit-approval feature is unreachable — no screen pushes to these routes (`dashboard.tsx:37-40,89-107`, `pdashboard.tsx:37-40,83-108` and `notifications.tsx:64-88` link only to flat `/approval/*` routes) |
| `/volunteer/professional`, `/volunteer/semi-professional` | **MAJOR** | Route files exist, but `notifications.tsx:96,104,134,142` links only `/volunteer/puc` and `/volunteer/payana` |
| `/my-applications` | Minor | Registered in `_layout.tsx:39`, never navigated to ("Coming Soon" placeholder) |

### A3. Dead-end flows

| Flow | Severity | Detail |
|---|---|---|
| Form wizard entry — no way back | **MAJOR** | At step 0 the back button no-ops: `FormRenderer.tsx:153-158` decrements `currentStep` but never exits; `GuidelinesSection.tsx:49` wires `onBack` to that no-op. A user who taps "Apply" cannot return to form-selection in-app (hardware back only) |
| Post-submit trap | **MAJOR** | `SuccessSection.tsx:30-40` — both "Go to Home" and "Exit Application" call `navigation.navigate('guidelines')`, restarting the same form instead of leaving it |
| Approval screens — no back control | **MAJOR** | All approval list screens render no back button and don't import `useRouter` (`GenericApprovalListScreen.tsx:223-228` header is title-only); users need Android hardware/gesture back |

### A4. Layout / registration issues

- Root `_layout.tsx:30-43` registers only 14 of 40 screens; **24 route files are unregistered** (all renewals, approvals, house-visit, volunteer, notifications) — they still render via expo-router auto-registration but with inconsistent transition/gesture config. Minor.
- Auth guarding is inconsistent: `RequireAuthentication` wraps only `renewal-*` and `approval/renewal-*`; `dashboard`, `pdashboard`, `volunteer*`, `housevisit*`, `notifications` are unguarded. Minor (server enforces auth).
- Dead code: `src/components/app-tabs.tsx` / `app-tabs.web.tsx` / `external-link.tsx` (unused Expo template scaffold); `src/screens/approval/ApprovalListScreen.txt` (leftover `.txt` copy inside the screens tree); `src/config/appContent.ts:28-31` `DASHBOARD_MENU_ITEMS.newScholarship` defined but never consumed.

### A5. Verified-good flows
login → dashboard/pdashboard by role (`LoginScreen.tsx:62-64`); logout → `/` (`dashboard.tsx:277-283`); forgot-password → reset-password with email param → login (`ForgotPasswordScreen.tsx:55` → `ResetPasswordScreen.tsx:23`); house-visit create/edit round-trips with `router.back()` (`HouseVisitFormScreen.tsx:549,632,675`).

---

## B. API fetch design vs API contracts (client ask #2)

### B0. Context the team must resolve first

There are **two generations of contract documents in this repo** and they conflict:

- **Gen-A (older):** root `API Endpoints.md` + `Docs/*.txt`
- **Gen-B (newer, confirmed against backend C# source):** `Docs/API-Contracts/*.md` (+ `PHASE_2C_CONTRACT_CONFIRMATION_REPORT.md`, `D8_SEMI_PROFESSIONAL_MIGRATION_PLAN.md`)

The app mostly follows Gen-B, but mixes generations in three modules. **Someone must confirm which backend generation is actually deployed** — the findings below state the impact under each.

### B1. Contract violations

| # | Severity | Finding | Evidence |
|---|---|---|---|
| 1 | **CRITICAL** | **Payana Renewal submit sends JSON instead of the required multipart/form-data.** Gen-B contract Validation Rule 1: "Request must be multipart/form-data" (400 otherwise). Submission will fail outright under the Gen-B controller that owns the `/payana-renewal/create` route | `src/api/renewalPayanaApi.ts:44-87` vs `Docs/API-Contracts/PAYANA RENEWAL API CONTRACT.md` |
| 2 | **CRITICAL** | **Payana Renewal "files" are device URI strings sent as JSON** (`MarksheetFile: "file:///data/..."`) — real multipart parts are required; **all 5 documents silently lost** on every submission | `renewalPayanaApi.ts:79-83` |
| 3 | **CRITICAL** | **Payana Renewal `PayanaId` optional in app, required by contract** (blank → 400; duplicate check depends on it) | `src/validation/renewalPayanaSchemas.ts:9` vs contract |
| 4 | MAJOR | **Professional Renewal dropdowns endpoint matches no contract**: app calls GET `/professionalrenewal/dropdowns`; Gen-A says GET `/professionalrenewal/create`, Gen-B says GET `/professional-renewal1/dropdowns`. If Gen-B backend is live, the professional renewal form cannot load dropdowns at all | `src/api/renewalProfessionalApi.ts:24` |
| 5 | MAJOR | **PUC Renewal body format conflicts with Gen-B**: app sends JSON camelCase (matches Gen-A only); Gen-B requires multipart PascalCase (`Email`, `ApplicantName`, …). Works only if the Gen-A backend is deployed | `src/api/renewalPucApi.ts:44-85` vs `RENEWAL PUC API CONTRACT.md` |
| 6 | MAJOR | **Registration path mismatch**: app POSTs `/registration/register`; the only registration contract documents POST `/api/registration/registerNew`. If backend exposes only `registerNew`, registration fails | `src/api/registrationApi.ts:43` vs `API CONTRACT DOCUMENT (Registration).txt:8` |
| 7 | MAJOR | PUC Renewal sends undocumented `renewalPreviousVPID` and never collects/sends contract field `houseVisitLink` (nullable, but the downstream approval workflow relies on it) | `renewalPucApi.ts:81`, `src/validation/renewalPucSchemas.ts:49` |
| 8 | MAJOR | Payana student **list** uses the legacy route `/payanastudents/studentlist` while payana **create/dropdowns** use the Gen-B `/payana-students/*` family (whose list contract is `/payana-students/list`). If the Gen-B controller family replaced legacy, volunteer student lists break | `src/api/payanaStudentApi.ts:20,54` |
| 9 | MAJOR | **`normalizeApiError` discards contract error messages** — 400/401/404/409 bodies like "This Email already exists." are replaced with generic text; users never see the real reason | `src/api/transformers/normalizeApiResponse.ts:44-51` |

### B2. Robustness issues in the fetch design

- `normalizeApiResponse.ts:36-38` treats any response whose message contains "success"/"saved" as success **even when the success flag is false** — fragile heuristic.
- `client.ts:225-234` clears auth storage on **any** 401, including documented 401s on public renewal endpoints → a stray 401 wipes the user's session.
- `API_RETRY_ATTEMPTS: 3` (`src/config/environment.ts:4`) is never used — no retry logic in the client (only React Query dropdown hooks set `retry: 2`).
- Auth header allow-list (`client.ts:78-135`, ~45 hardcoded path prefixes): new protected endpoints silently ship without a token unless someone remembers to extend the list (e.g. `/renewalpuc/import-grid`, `/payana-renewal/import-grid` are not covered).
- PII-adjacent logging: `client.ts:189` logs every URL; mappers `console.log` entire form payloads (`professionalApi.ts:22-27`, payana mapper, `professionalStudentApi.ts:64` full response) — contradicts the "do NOT log payload contents — PII" rule in `src/submission/submit.ts:32`. **House visit screen logs the full payload + response in production** (`HouseVisitFormScreen.tsx:621,625`).
- Missing: house-visit create-mode **context endpoint** `GET /housevisit/create?studentId&source` (contract `HOUSE VISIT API CONTRACT DOCUMENT.txt:10,23`) is never called — screen relies solely on route params.
- Missing module: Gen-B professional-renewal **approval grid** (`/professional-renewal1/list|approve|reject`) has no client API/screen (PUC and Payana renewal approvals exist).

### B3. Verified correct (contract-faithful)

Professional form mapper (all 9 file keys), PUC 1.1 mapper (all 5 mandatory file keys), Payana student create mapper (including quirks `StudentAchivements`, `securedPercentage`, `bankaccountno`), Semi-professional mapper, all approval grids (incl. PUT vs POST and query-param vs body remark differences), house-visit edit/approval, volunteer assignment (incl. `StudentID` casing and PUT reassign), dashboard notifications. Response `Success/success` + `PRId/renewalId` dual-casing handled everywhere. No raw `fetch` bypasses the client.

---

## C. UI enhancements needed (client ask #3) — **Yes**

### C1. Major

1. **Approval screens ignore the top safe area** — `SafeAreaView edges={['bottom']}` only while `headerShown: false` → titles/badges render under the notch/status bar. Fix: `edges={['top','bottom']}`. (`GenericApprovalListScreen.tsx:183-225`, `PucApprovalListScreen.tsx:187-229`, `HouseVisitApprovalListScreen.tsx:211-253`)
2. **No submit feedback in the form wizard** — `StickyActionFooter.tsx:29` accepts a `loading` prop and never uses it; `Button.tsx` has no spinner/disabled-submit support → "Next" looks dead during async work and double-submit isn't visibly prevented.
3. **Fake upload feedback** — picking a document instantly marks it `uploaded: true, progress: 100` and the UI shows **"Verified — Document verified and accepted successfully"** though nothing has been uploaded yet (files upload at submit). Also "Tap to browse or **drag & drop**" (doesn't exist on mobile) and a dead 👁 view button (`FileUploadField.tsx:49,93-105`; `DocumentSection.tsx` all 4 form types).
4. **Fabricated application ID on success** — `SuccessSection.tsx:20` falls back to `VP${year}${Math.random()...}`, inventing an ID the NGO has no record of; line 80 labels every non-professional form "PUC Scholarship".
5. **Keyboard handling gaps** — `FormScreenLayout.tsx:65-72` has no `KeyboardAvoidingView` (inputs hide behind keyboard in Contact/Bank/Address/Academic sections; renewal forms do this correctly at `RenewalProfessionalForm.tsx:266`); `ModalSelectField.tsx:84-131` renders long dropdown lists (caste/place/courses) in a fixed modal **without ScrollView/maxHeight** → unreachable options; `VolunteerPickerModal.tsx:71-126` keyboard covers the list; `StudentListScreen.tsx:496-508` district dropdown clips at `maxHeight: 200`.
6. **Search fires a network request per keystroke** — `StudentListScreen.tsx:114-150` embeds raw `searchText` in the React Query key; the code comment claims debounce exists, it does not.
7. **Accessibility is nearly absent app-wide** — only 5 files have any `accessibilityLabel`/`accessibilityRole`; icon-only password toggles (`LoginScreen.tsx:146-153`), terms checkboxes, emoji icon buttons (👁/🗑 in `FileUploadField.tsx:96-101`) and all back buttons are unlabeled; `src/utils/accessibility.ts` is web-only dead code (`window.speechSynthesis`, `HTMLElement`) on native. A shared touchable/field wrapper would fix most of this in one pass.
8. **Wrong keyboards on the primary data-entry workflow** — House-visit form's local `InputField` (`HouseVisitFormScreen.tsx:50-64`) doesn't accept `keyboardType`: age, incomes, EMI, units, children counts all open the alphabetic keyboard; zero `autoComplete` props in the whole codebase (login/register email/password).

### C2. Minor

- **Dark mode will break**: `app.json` sets `userInterfaceStyle: "automatic"` but every screen hardcodes light colors and `src/theme/colors.ts` has no dark palette. Either force `"light"` or implement the dark palette. (`app.json:9`)
- Touch targets below 48px in chips (`HouseVisitFormScreen.tsx:1012`), `SegmentedControl.tsx:44-49`, `FileUploadField.tsx:226-231` — `platform.touchTarget.minSize = 48` exists but is never applied.
- Silent dropdown-fetch failure in wizard sections (empty selects, no error/retry) — `puc/PersonalSection.tsx:38-58` and siblings.
- Nested same-direction ScrollViews (`DocumentSection`/`GuidelinesSection`/`ReviewSection` inside `FormScreenLayout`'s ScrollView) — Android scroll quirks.
- ~150 hardcoded colors drifting from the theme; two competing type scales and duplicated spacing tokens; two different dropdown components (`DropdownField` vs `ModalSelectField`) with different radii/behaviors.
- House-visit specifics: submit button is green instead of the primary color; single-choice questions rendered as multi-select chips; list keys by array index; vague legal declaration placeholder.
- `dashboard.tsx:454-457` notification badge always renders ("0" badge); `FormRenderer.tsx:144-147` "Component coming soon" dev fallback can ship to users; `VPDatePickerField.tsx:35,176` passes `Invalid Date` to the Android picker; `RegisterScreen.tsx:456-458` logo 150×150 inside a 96×96 circle (overflow).
- Dead/placeholder screens reachable from UI: `/help` ("Coming Soon") is linked from home "Contact Support" (`form-selection.tsx:193-199`).

### C3. What's already good
Fetch screens consistently render loading / error+retry / empty / pull-to-refresh (notifications, approvals, volunteer lists, dashboards). Double-submit locks exist in house-visit, renewal forms, and approval modals. Single icon family (Ionicons), text scales with OS settings, consistent 48px buttons via shared components, portrait lock + safe areas on all screens except C1-1.

---

## D. Additional testing beyond the client instructions

### D1. Automated checks (run on this machine, read-only)

| Check | Result |
|---|---|
| `tsc --noEmit` (typecheck) | ✅ Clean (exit 0) — note: stale `tmp_tsc_output.txt` in the repo root lists an old `collapsible.tsx` error that no longer reproduces; delete the file |
| `jest --ci` | ✅ **130/130 tests pass** (8 suites: approval contracts, house-visit, PUC approval, diagnostics, dashboard counts, submission) |
| `expo lint` | ❌ **38 errors, 72 warnings** — details below |

ESLint error highlights (full list via `npx expo lint`):

- **`src/components/FormRenderer.tsx:151` — React Hook `useFormEngineStore` called conditionally** (`react-hooks/rules-of-hooks`) — genuine crash/order-corruption risk in the core form engine. Highest-priority lint finding.
- `dashboard.tsx:235,236` and `pdashboard.tsx:206,207` — refs accessed during render (`react-hooks/refs`).
- `dashboard.tsx:311`, `notifications.tsx:171`, `pdashboard.tsx:266` — setState synchronously in effects (cascading-render risk).
- `FormRenderer.tsx:90` component created during render; unescaped `'` entities in `notifications.tsx:210`, `FormRenderer.tsx:82`, etc.

### D2. Play Store readiness

| Item | Status | Detail |
|---|---|---|
| API environment | ❌ **Blocker** | Test server URL hardcoded in `src/config/environment.ts:2`; no `__DEV__`/env/eas override — the production bundle would ship test-server traffic |
| Android permissions | ⚠️ Over-broad | Manifest requests `RECORD_AUDIO`, `READ_MEDIA_VIDEO`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, but `src/utils/imagePicker.ts:7` uses `mediaTypes: 'images'` only — audio is never used, video/storage permissions unnecessary on modern targetSdk. Unused sensitive permissions cause Play review friction and user distrust |
| Adaptive icon | ⚠️ | `adaptiveIcon.foregroundImage` is the full logo — needs a proper foreground with safe zone (full-bleed logos get cropped/masked badly); no separate `monochrome` icon |
| Privacy policy | ⚠️ | In-app `/legal/privacy` exists, but Play Store requires a **hosted public URL** in the console — confirm one exists |
| Versioning | ✅ | `versionCode: 1`, `autoIncrement: true`, production builds `.aab` (`eas.json production`) — correct for Play |
| Dark mode | ⚠️ | `userInterfaceStyle: automatic` with light-only UI (see C2) — set `"light"` or implement dark tokens |
| Secrets | ✅ | No hardcoded secrets/API keys/tokens found in `src/` (grep scan) |

### D3. Security context (references existing `strix-scan/TEST_REPORT.md`, 2026-09-26)

A backend API scan already exists in the repo: **`GET /students/getall` is publicly accessible and returns student PII without any valid token (Critical, confirmed)**. The app itself calls this family (`studentApi.ts`/approval grids), so the backend fix is required before launch. App-side additions from this QA: the PII payload logging in B2 should be stripped from production builds.

### D4. Limitations of this test pass

Static analysis + automated suites only — the app was **not executed on an emulator/device** (no Android SDK/emulator available in this environment). Recommend a manual device pass before release, focused on: full wizard submit per form type (esp. file uploads), keyboard overlap on small screens, notch overlap on approval screens, and hardware-back behavior on every screen listed in A3.

---

## Recommended fix order

1. Environment split for API base URL (D2 blocker) — confirm which contract generation the live backend implements, then fix B1 #1-#6.
2. `FormRenderer.tsx` conditional hook + dashboard/pdashboard ref-during-render (D1).
3. Navigation: form-wizard exit, SuccessSection Home/Exit, back buttons + top safe-area on all approval screens, wire or remove orphaned routes (A2/A3).
4. Upload UX honesty + submit-button loading states (C1-2, C1-3, C1-4).
5. Keyboard avoidance, ModalSelectField scroll, search debounce, keyboardType pass (C1-5, C1-6, C1-8).
6. Accessibility pass via shared wrapper (C1-7); dark-mode decision (C2).
7. Play hygiene: trim Android permissions, adaptive-icon foreground, hosted privacy policy URL (D2).
8. Strip PII logging from production paths (B2, D3).

---

*Report generated from static analysis and automated suites; all findings cite file:line so each can be verified without running the app. No application code was modified.*
