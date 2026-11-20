# Vidya Poshak App — Final QA & Runtime Testing Report

**App:** Vidya Poshak scholarship app (Expo / React Native, TypeScript, expo-router, axios + React Query, Zustand, Zod)
**Test date:** 2026-09-26
**Tested by:** QA (static analysis + automated suites + **live hands-on testing on Android emulator** against the test server)
**Backend tested against:** `https://vpwebservices.testserver.envisage-workflow.in/api` (live during testing)
**Client instructions covered:**
1. Missing / broken links between components
2. Does the API fetch design follow the API contracts
3. UI enhancements needed
…plus additional testing beyond these asks.

**Constraints honoured:** No application code was changed and nothing was committed or pushed. All findings below were **verified by actually running the app** on an Android 15 emulator (Pixel 7, 1080×2400) via Expo Go / Metro, and by probing the live test-server API. Screenshots are in **`qa-evidence/`** (35 files). Each finding lists its evidence.

---

## Executive summary

The app boots, runs, and its core screens render well. Login, logout, role routing, dashboards, notifications, dropdowns and the renewal form UI all work. **However, there are three show-stoppers that break the NGO's core workflows, one of which we reproduced end-to-end through the real UI:**

| # | Severity | Finding |
|---|---|---|
| 1 | **P0 — CRITICAL** | **Payana Renewal submission can never succeed.** Filled the entire form with valid data and submitted: server rejected with HTTP 400 `"Request must be multipart/form-data."` (app sends JSON). Reproduced live through the UI — `qa-evidence/15_submit_result.png`. |
| 2 | **P0 — CRITICAL** | **PUC approval screen has no Approve/Reject buttons.** Backend returns `approvalStatus: ""` for pending students; the app only renders action buttons when status is exactly `"pending"`. Dashboard advertises "2 Pending PUC Apps" but the approver can't approve anything. Backend + frontend both need a fix. |
| 3 | **P0 — CRITICAL** | **`/volunteer/payana` student list is dead.** Calls `/payanastudents/studentlist`, which **no longer exists** on the server (HTTP 404). The volunteer sees a raw server error string. Confirmed live — `qa-evidence/20_volunteer_payana_404.png`. |
| 4 | **P0 — HIGH** | **Production build would call the test server.** `src/config/environment.ts:2` hardcodes the test-server URL, and the domain literally contains "testserver". No env/EAS override exists. |
| 5 | **P0 — HIGH** | **Date-of-birth picker defaults to 01 Jan 1970** (Unix epoch) and needed several taps before it would open at all. DOB is required → the professional scholarship wizard cannot reliably be completed on Android. |

Automated checks: **TypeScript clean · Jest 130/130 pass · ESLint 38 errors / 72 warnings** (incl. a genuine conditional-hook violation in the form engine).

Also confirmed during testing: fake "Verified / Uploading to server… 0%" document-upload states, titles rendered under the status bar (notch) on approval screens with no back button, the form wizard discarding all data on exit, a raw JWT token and full form payloads logged to the console, and **plaintext passwords for all test accounts committed in `Docs/API-Contracts/Users List (2).md`** (security).

A prioritized fix list is at the end (§9).

---

## 1. Client ask #1 — Missing / broken links between components

### 1.1 Route inventory — no dead links
There are 40 route files under `src/app/` (expo-router). Every `router.push` / `href` / `Link` target in the codebase resolves to an existing route file, and every passed param is read by its destination. **No link points to a non-existent screen.** The problems are the opposite: screens that exist but can never be reached, and flows that trap the user.

### 1.2 Unreachable screens (links were never built) — CONFIRMED
| Screens | Severity | Evidence |
|---|---|---|
| `/approval/house-visit/{puc,payana,professional,semi-professional}` | **MAJOR** | No screen in the app pushes these routes (grep over all of `src/`). The house-visit *approval* feature is unreachable. |
| `/volunteer/professional`, `/volunteer/semi-professional` | **MAJOR** | Route files exist; only `/volunteer/puc` and `/volunteer/payana` are linked (notifications + drawer). Verified by grep. |
| `/my-applications` | Minor | Registered but never navigated to. Runtime: renders a "Coming Soon" placeholder with a "Back to Home" button (`qa-evidence/30_my-applications.png`). |
| `/help` | Minor | "Coming Soon" placeholder, yet linked from home as "Contact Support" — a support dead-end for users. |

### 1.3 Dead-end flows — CONFIRMED AT RUNTIME
| Flow | Severity | Evidence |
|---|---|---|
| **Form wizard entry: Back is a no-op at step 1** | **MAJOR** | At step 1 of 7 the footer "Back" button does nothing (tapped it; screen unchanged — screenshot pair `qa-evidence/23_wiz_guidelines.png`). Cause: `FormRenderer.tsx:153-158` decrements `currentStep` only when `> 0` and never exits; `GuidelinesSection.tsx:49` wires `onBack` to that no-op. The user cannot return to form selection (hardware back works, but the visible button lies). |
| **Post-submit trap** | **MAJOR** | `SuccessSection.tsx:27-36`: both "Go to Home" and "Exit Application" call `navigation.navigate('guidelines')` — they restart the same form instead of leaving it. Verified in code. |
| **Approval screens have no back button** | **MAJOR** | "PUC Approval" and "Pending Payana Renewals" render title-only headers with no back control (screenshots `qa-evidence/05_puc_approval_top.png`, `09_...`). Android hardware back does work (tested), but the on-screen affordance is missing. |
| **"Edit House Visit" silently does nothing** | **HIGH (new)** | On the working Payana volunteer-assignment screen (`/payana-volunteer-assignment/students` flow), tapping **Edit House Visit** for the student "Daya" produced no navigation and no error, repeatedly (logs clean). Either the param needed by `/housevisit/edit` is missing for this record or the handler fails silently — needs a developer look. |

### 1.4 Navigation observations at runtime
- Login routes correctly by role: Admin → Admin Dashboard; Volunteer (sham/Dharwad) → Volunteer Dashboard. Logout from the drawer returns to home. ✅
- Notifications screen links work and its items match live pending counts (PUC 2, PUC Renewals 1, Payana Renewals 9) — `qa-evidence/08_notifications.png`. It also has a proper back arrow. ✅
- **Volunteer drawer:** APPROVALS section header renders with **zero items** for a Volunteer (empty section header should be hidden). VOLUNTEER ASSIGNMENT and RENEWAL SCHOLARSHIP sections render fine. (New, Minor.)
- **Register screen redirects to home with no message when a user is still logged in** — deep-linking to `/register` while authenticated dumps the user on home without explanation. (New, Minor.)

### 1.5 What's good
Login → role dashboards; forgot-password flow wiring; logout; notifications linking; the volunteer-assignment flow (district picker → student card with Reassign / Edit House Visit buttons) renders correctly.

---

## 2. Client ask #2 — API fetch design vs API contracts

**Method:** contract documents in `Docs/API-Contracts/` + **live HTTP probes of the test server** + runtime observation via Metro logs.

### 2.1 CRITICAL — Payana Renewal submit violates its contract (proven live end-to-end)
- Contract (`PAYANA RENEWAL API CONTRACT.md`): `POST /api/payana-renewal/create` must be **multipart/form-data**; `EmailId` and `PayanaId` are **required**; documents are **file parts**.
- App (`src/api/renewalPayanaApi.ts:44-87`): posts **JSON**, with document fields as device path strings (`MarksheetFile: "file:///data/..."`) or `""`, and `payanaId` optional (`src/validation/renewalPayanaSchemas.ts:12`).
- **Live proof (three independent ways):**
  1. curl `POST` JSON → `HTTP 400 {"success":false,"message":"Request must be multipart/form-data."}`
  2. Filled the entire Payana Renewal form through the UI with valid data and submitted → the app showed the red error banner **"Request must be multipart/form-data."** (`qa-evidence/15_submit_result.png`).
  3. Metro log shows the full JSON payload the app sent and the 400 response.
- Net effect: **no Payana Renewal application can ever be submitted from this app.** The failure mode at least shows the server's message (good), but the message is technical jargon for a student.

### 2.2 CRITICAL — Payana student list calls a route that no longer exists (proven live)
- App (`src/api/payanaStudentApi.ts:52`, used by `/volunteer/payana` via `StudentListScreen`): `GET /payanastudents/studentlist`.
- Live server: **HTTP 404** (route removed). Replacement generation (`/payana-students/list`) exists (401 without token = alive).
- Runtime: the "Payana Students" screen displays the raw server error *"No HTTP resource was found that matches the request URI 'https://…/api/payanastudents/studentlist'."* — with a search bar and column headers but no data and no retry button (`qa-evidence/20_volunteer_payana_404.png`). React Query retried 3× (all failed).
- Note the split-brain: the *volunteer-assignment* Payana screen works (it uses the newer `/payana-volunteer-assignment/students`), while the *student-list* screen uses the dead legacy route.

### 2.3 Findings the live server DISPROVED for the current deployment
The repo contains two generations of contract docs (root `API Endpoints.md` + `Docs/*.txt` = older; `Docs/API-Contracts/*.md` = newer). The report-generation question "which backend is deployed?" is now answered: **the deployed test server currently serves BOTH generations.** Therefore:
| Report concern | Live result |
|---|---|
| App calls `GET /professionalrenewal/dropdowns`; Gen-B says `/professional-renewal1/dropdowns` | **Both return 200.** Dropdowns load in the app (professional wizard + Payana renewal both fetched them successfully). Not broken today; a portability risk if the old controller is retired. |
| Registration path: app posts `/registration/register`, contract documents `/registration/registerNew` | **Both routes exist** (405 on GET = POST-only route present). Login works live. |
| Payana renewal dropdowns | `GET /payana-renewal/dropdowns` → 200, correct shape. ✅ |
| PUC Renewal JSON-camelCase body vs Gen-B multipart-PascalCase | Not fully probed (deliberately not submitted to avoid creating records). Same both-generations pattern applies; verify before Gen-A retirement. |

### 2.4 Backend data bug surfaced through the app (NEW)
- **Father's Occupation dropdown contains no occupations** — only *Divorced, Not Supporting, Departed, Left, Not Working, Expired*. Mother's list is correct (*Coolie, Daily wages, Home maker, Tailor, …*).
- Verified via `GET /payana-renewal/dropdowns`: the **server itself** returns `fatherOccupations: ["Divorced","Not Supporting","Departed","Left","Not Working","Expired"]`. The app renders the master data faithfully — **this is a backend/data fix** (`PFatherOccupationMaster` table appears to hold family-status values).

### 2.5 Error-handling design issues (verified in code + runtime)
| # | Severity | Finding | Evidence |
|---|---|---|---|
| 1 | MAJOR | **Every HTTP 401 is treated as "Session expired" and logs the user out — including a genuinely wrong password.** `client.ts:225-234` calls `logout()` on any 401 before the caller can interpret it. Runtime: a wrong-password login produced `ApiError: Session expired. Please login again.` in the logs and consumed the stored session. | Metro log + `qa-evidence/03_login_wrong_password.png` |
| 2 | MAJOR | **`normalizeApiResponse` treats `success:false` as success if the message contains "success"/"saved"** (`normalizeApiResponse.ts:50-53`). Fragile heuristic that can flip real failures into successes. | Code |
| 3 | MAJOR | **PII / secrets logging in production code paths:** full JWT token + user object logged on every login (`authApi.ts`), entire renewal payload (email, bank account, IFSC) logged on failure (`renewalPayanaApi.ts:100`), full API responses logged by dropdown fetchers (`renewalProfessionalApi.ts:25`, `payanaStudentApi.ts:64`), full student list responses logged. Contradicts the app's own "do NOT log payload contents — PII" rule (`src/submission/submit.ts:32`). | Metro logs (token + payload visible) |
| 4 | Minor | Auth header allow-list (~45 hardcoded prefixes in `client.ts:78-135`): new protected endpoints silently ship without a token (e.g. `/renewalpuc/import-grid`, `/payana-renewal/import-grid` not covered). | Code |
| 5 | Minor | `API_RETRY_ATTEMPTS: 3` (`environment.ts:4`) is never used — only React Query dropdown hooks set `retry: 2`. | Code |
| 6 | Minor | House-visit create-mode context endpoint `GET /housevisit/create?studentId&source` is never called (screen relies only on route params). | Code |

### 2.6 Verified contract-faithful (checked in code and/or live)
Professional & PUC 1.1 form mappers (file keys), Payana student create mapper quirks, approval grids (PUT/POST + remark shapes), house-visit edit/approval, volunteer assignment (`/payana-volunteer-assignment/*` works live), welcome-dashboard notification counts (live, correct per-role endpoint: `admin-notifications` vs `notifications`), login endpoint, district master lists. All dropdown fetches during testing returned proper data (gender/caste/area/district/college-type).

---

## 3. Client ask #3 — UI enhancements needed (YES — confirmed at runtime)

### 3.1 Major
1. **Approval screens render under the status bar (notch) with no back button.** "PUC Approval" title is drawn underneath the clock/battery icons; same pattern on "Pending Payana Renewals". Cause: `SafeAreaView edges={['bottom']}` only + `headerShown:false` globally (`src/app/_layout.tsx:29`). Evidence: `qa-evidence/05_puc_approval_top.png`. Fix: `edges={['top','bottom']}` + back button.
2. **Fake document-upload feedback.** After picking a file the field shows a progress bar **"Uploading to server… Please don't close the app during upload — 0%"** (nothing uploads at this point; files upload at submit) and then flips to **"Verified"** — `qa-evidence/28_fake_upload.png`. Nothing has been sent to any server; this misleads students about the state of their application. Also on the same cards: **"Tap to browse or drag & drop"** (drag & drop does not exist on mobile) and contradictory size labels **"Max file size: 10 MB"** next to "JPEG, PNG, PDF up to 5 MB" (app config caps at 5 MB, `environment.ts:7`).
3. **No submit feedback in the wizard footer.** `StickyActionFooter.tsx` accepts `loading` and ignores it; buttons have no spinner/disabled-while-submitting state → double-submit risk and "dead" buttons during async work.
4. **Fabricated application ID on success** — `SuccessSection.tsx:20` falls back to `VP{year}{random}`, showing the student an ID the NGO has no record of; line 80 labels every non-professional form "PUC Scholarship".
5. **DOB date picker (Android):**
   - Opens with **01 January 1970** as the default value (epoch — an invalid/null date passed to the picker; matches `VPDatePickerField.tsx` "Invalid Date" issue).
   - Required **3 attempts** before it opened (first two taps produced nothing, no error) — flaky open behavior.
   - Evidence: `qa-evidence/25_datepicker.png`.
6. **Form wizard loses everything on exit.** Stepping back out (or an app reload/Fast Refresh — which happened twice during testing) restarts the wizard at step 1 with all data wiped, no confirmation, no draft persistence. Combined with 1.3's no-op/exit back button, one accidental tap can discard a half-filled scholarship application.
7. **Keyboard hides inputs in the main wizard.** The Personal/Address sections use `FormScreenLayout` with no `KeyboardAvoidingView` (renewal forms do it correctly at `RenewalProfessionalForm.tsx:266`). During testing, active text fields were repeatedly pushed under the keyboard and had to be scrolled.
8. **Search fires a request per keystroke** — `StudentListScreen.tsx:114-150` embeds raw `searchText` in the React Query key; comment claims debounce exists, it does not (the dead Payana screen showed 3× retry spam of the dead URL even while idle).

### 3.2 Minor
- **Duplicated helper text** on wizard sections: "Fields marked with * are required · Fields marked with * are required" (`qa-evidence/24_personal_validation.png`).
- **Header icon overlap:** the notification bell and settings gear draw on top of each other, and the bell shows a **"0" badge when there are zero notifications** (`qa-evidence/17_volunteer_dashboard.png`).
- **Register form:** empty-submit gives **no feedback at all** (no errors, unlike Login which shows "Email is required" / "Password is required"); password placeholder clipped ("min 6 / chars" cut off); **Role dropdown has no "Volunteer" option** although Volunteer is a live role (volunteers presumably must be created by admins — if so, fine, but the UI shouldn't imply the list is complete).
- **Off-theme colors:** renewal "Submit" is green while the app primary is blue-purple (screenshots 13/15/28); ~150 hardcoded colors drift from the theme; two competing dropdown components.
- **Dropdown list clipping:** district dropdown clips the last item mid-text ("Bagalkot" cut in half, `qa-evidence/18_district_dropdown.png`); `ModalSelectField` renders long lists in a fixed modal without ScrollView → unreachable options on long lists.
- Touch targets < 48px on chips/segments/upload buttons; silent dropdown-fetch failure in wizard sections (no error/retry when a dropdown list fails).
- **Diagnostics screen is exposed in the production drawer** for Admin/Volunteer (app version, session id, event log with Export/Clear) — `qa-evidence/31_diagnostics.png`. Ship-blocker for polish, not function.
- Dead code: `src/components/app-tabs.*`, `external-link.tsx`, `ApprovalListScreen.txt` (a `.txt` copy inside the screens tree), `DASHBOARD_MENU_ITEMS.newScholarship` unused; `src/utils/accessibility.ts` is web-only dead code.
- Dark mode: `app.json` `userInterfaceStyle:"automatic"` with light-only UI — Android 15 users on dark themes may see mismatched system bars (status bar rendered light in all tests).

### 3.3 What's already good
Empty-submit validation on **Login** (inline "Email is required"/"Password is required" with proper a11y error states — `qa-evidence/01_login_empty_submit.png`), wrong-password error banner ("Login Failed / Invalid credentials"), positive inline feedback ("Email format looks good"), dropdown modals open/select/close correctly everywhere, real district master data, role-aware dashboards, notifications with live counts, proper loading/empty states on fetch screens, portrait lock, single icon family, text scales with OS settings.

---

## 4. Beyond the asks — additional findings from runtime testing

| # | Severity | Finding |
|---|---|---|
| 1 | **P0 (backend+app)** | **PUC approval workflow is dead:** backend returns `approvalStatus:""` for pending students; app requires exactly `"pending"` to show Approve/Reject (`GenericApprovalListScreen.tsx:132,157`; live check of `/students/getall`: statuses = `{"":2,"Rejected":1,"Approved":1}`). Result: dashboard says "2 Pending PUC Apps", approval screen shows 4 students, **zero action buttons** (`qa-evidence/07_puc_approval_bottom.png`). Note the Payana *Renewal* approval screen works — its records carry proper "Pending" status (`qa-evidence/10_payana_renewal_scrolled.png`). |
| 2 | P1 | "Edit House Visit" button no-op (see 1.3). |
| 3 | P1 | The approval list shows **all** students (Approved/Rejected included) while the dashboard/notification count reflects only pending — "4 students" vs "2 pending items". Not wrong, but the header is misleading; consider a status filter. |
| 4 | P1 | **Volunteer dashboard is empty** — welcome card + footer only; no quick actions for the volunteer's actual job (house visits, lists). Everything lives in the drawer (`qa-evidence/17_volunteer_dashboard.png`). |
| 5 | **SECURITY** | **Plaintext credentials for all test roles are committed in the repo** — `Docs/API-Contracts/Users List (2).md` (Admin/Volunteer/Branch Executive/Program Manager emails + passwords). These worked against the test server during this test. Rotate them and remove the file. |
| 6 | **SECURITY** | `/students/getall` returns the full student table (names, emails, phones, addresses, percentages) with **no token** — re-confirmed live during this test (matches the earlier `strix-scan/TEST_REPORT.md` Critical). The app also uses this public endpoint for the PUC approval grid. |
| 7 | SECURITY | JWT token + full form payloads + student PII logged to console in production paths (see 2.5 #3). |
| 8 | P2 | Android permissions over-broad in manifest (`RECORD_AUDIO`, `READ_MEDIA_VIDEO`, storage) while the app only picks images/PDFs. |
| 9 | P2 | Adaptive icon foreground is the full logo (will crop badly); no monochrome icon. In-app privacy/terms pages exist and render, but Play Console needs a hosted privacy URL. |
| 10 | P2 | Dev-mode LogBox surfaces raw `console.error` output (including the token/payload logs) during development sessions; strip the underlying logging before release. |

---

## 5. Automated checks (re-run during this engagement, read-only)

| Check | Result |
|---|---|
| `tsc --noEmit` | ✅ Clean (exit 0) |
| `jest --ci` | ✅ 130/130 tests pass (8 suites) |
| `npx expo lint` | ❌ **38 errors, 72 warnings** — incl. `FormRenderer.tsx:151` **conditional React hook call** (real crash-risk in the form engine: hook called after an early return), ref-access-during-render in dashboards, setState-in-effect, unescaped entities |

---

## 6. Runtime test coverage (what was actually exercised)

**Environment:** Android 15 emulator (Pixel 7 AVD), Expo Go + Metro, live test backend.

| Area | Result |
|---|---|
| App boot & splash | ✅ Boots, no crash |
| Home / form-selection | ✅ Renders; cards work |
| Login: empty submit / bad email / wrong password / success | ✅ / ⚠️ no format check / ✅ / ✅ |
| Role routing Admin & Volunteer | ✅ |
| Admin dashboard, notifications, drawer | ✅ |
| PUC approval screen | ⚠️ renders; **no action buttons**; notch overlap; no back |
| Payana Renewal approval grid | ✅ Approve/Reject + Pending chips work; modal opens/cancels cleanly |
| Payana Renewal form: full fill + submit | ❌ **400 multipart** (the headline bug) |
| Renewal dropdowns (district/place/caste/occupation/college) | ⚠️ work, but father-occupation list is wrong (backend data) |
| Document picker + upload states | ⚠️ picker works; fake progress/Verified states |
| Professional wizard: guidelines → personal | ✅ validation/dropdowns; ❌ DOB picker epoch default; ❌ data loss on exit |
| `/volunteer/payana` student list | ❌ dead endpoint, raw error |
| Volunteer assignment (district → student card) | ✅ works |
| Edit House Visit | ❌ silent no-op (needs dev investigation) |
| Register: role list, terms link, empty submit | ⚠️ no Volunteer role; terms page ✅; silent validation |
| `/my-applications`, `/help` | ⚠️ Coming Soon placeholders |
| Diagnostics | ✅ works (but shouldn't ship) |
| Hardware back on wizard/approval/notifications | ✅ works |

**Not covered (needs credentials/time or risk of mutating test data):** actual Approve/Reject submissions, successful form submissions (professional/PUC), forgot/reset-password email loop, iOS, low-end device performance, offline behavior, deep backend contract audit of every remaining endpoint.

---

## 7. Recommended fix order for the developer

1. **P0 — environment split** for `API_BASE_URL` (`src/config/environment.ts`) with `__DEV__`/EAS override before any release build.
2. **P0 — Payana Renewal submit:** switch to `multipart/form-data` with real file parts; make `PayanaId` required in `renewalPayanaSchemas.ts` (align with contract). Fix the backend father-occupation master data too.
3. **P0 — PUC approval:** agree the canonical pending-status value; fix backend to return it (or app to map `""`/legacy values) so Approve/Reject render — `GenericApprovalListScreen.tsx:132`.
4. **P0 — Payana student list:** move `payanaStudentApi` to the live route (`/payana-students/list` or the volunteer-assignment endpoint); add a friendly error + retry to `StudentListScreen`.
5. **P0 — DOB picker:** pass a sensible default/minimum date (not epoch), make the field open reliably (`VPDatePickerField.tsx`), adopt the non-deprecated `onValueChange` API.
6. **P1 — navigation:** wizard Back at step 1 → exit to form-selection; SuccessSection Home/Exit → real destinations; back buttons + `edges:['top']` on all approval screens; fix/hide Edit House Visit no-op; wire or remove orphaned routes (`/approval/house-visit/*`, `/volunteer/{professional,semi-professional}`, `/my-applications`).
7. **P1 — upload honesty:** replace "Uploading to server… 0%"/"Verified" with "Selected — will be uploaded when you submit"; remove "drag & drop"; reconcile 5 MB vs 10 MB labels.
8. **P1 — error handling:** stop treating all 401s as session-expiry (`client.ts:225`); remove the "success/saved" message heuristic; **strip token/PII logging** from `authApi`, `renewalPayanaApi`, mappers, and `HouseVisitFormScreen`.
9. **P1 — form UX:** loading state on footer submit buttons; KeyboardAvoidingView in wizard sections; draft persistence or exit confirmation for the wizard; debounce student search.
10. **P2 — polish:** duplicated subtitle, bell/gear overlap + "0" badge, register empty-submit feedback + clipped placeholder + clarify Volunteer role, dropdown clipping/scroll, green→primary Submit, hide Diagnostics from production drawers, dark-mode decision (`"light"` or implement tokens), permissions trim, adaptive icon foreground, accessibility pass, delete dead code (`app-tabs.*`, `ApprovalListScreen.txt`, `tmp_tsc_output.txt`).
11. **Security:** rotate + remove the plaintext credentials in `Docs/API-Contracts/Users List (2).md`; backend must lock down `GET /students/getall` (Critical, pre-existing) before launch.

---

## 8. Evidence index (qa-evidence/)

| File | Shows |
|---|---|
| 01–03 | Login validation, bad-email state, wrong-password error |
| 04 | Admin dashboard (raw 401 LogBox toast, bell/gear overlap) |
| 05–07 | **PUC approval: notch overlap, no back, no Approve/Reject buttons** |
| 08 | Notifications with live counts |
| 09–11 | Payana renewal approval grid + working Approve modal |
| 12 | Admin drawer |
| 13–15 | **Payana Renewal form + the live 400 "Request must be multipart/form-data."** |
| 16–17 | Volunteer login + empty volunteer dashboard ("0" badge) |
| 18 | District dropdown clipping ("Bagalkot" cut) |
| 19 | Working volunteer-assignment student card |
| 20 | **Payana Students screen: raw 404 server error** |
| 21 | (house-visit navigation test) |
| 22–26 | Form wizard: guidelines, disabled-Next validation + duplicated subtitle, **epoch-1970 DOB picker** |
| 27–28 | **Fake upload: "Uploading to server… 0%" → "Verified"** |
| 29 | Register screen: clipped placeholder, terms link, silent empty submit |
| 30 | my-applications "Coming Soon" |
| 31 | Diagnostics screen |

*Prepared for the development team. No code changes were made; nothing was pushed. All test data used was either read-only or rejected by the server (the only write attempts — the Payana Renewal submission — failed with 400 by design of the bug being verified).*
