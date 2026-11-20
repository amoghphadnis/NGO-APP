# Fixes Applied & Re-Test Report — Vidya Poshak App

**Date:** 2026-09-27 (audit pass: same day)
**Scope:** All P0/P1 defects from `FINAL-QA-TEST-REPORT.md` (+ safe P2 items). **No UI redesign, no workflow changes** — every fix is the smallest change that resolves the defect.
**Verification legend:**
- ✅ **RUNTIME-VERIFIED** — reproduced working in the app on the Android emulator against the live test server (screenshots in `qa-evidence/`).
- 🌐 **PROTOCOL-VERIFIED** — verified against the live server with the exact payload/format the app now sends.
- 📄 **CODE-VERIFIED** — fix is in place, project compiles clean (tsc + Metro full bundle + Jest 130/130).

> **Audit note (2026-09-27):** every fix in this report was re-audited against the source code. The audit found and fixed **9 additional response/payload `console.log` dumps** that the first cleanup sweep missed (`dashboardApi`, `pucApi`, `payanaApi`, `pucStudentApi`, `semiProfessionalStudentApi`, `renewalPucApi`, `normalizeSemiProfDropdowns` — the last three were logging entire student lists / submission payloads). The two previously deferred navigation gaps were also resolved (§1 note below). All fixes re-verified: `tsc` clean, **Jest 130/130**, and the four items that previously lacked visual proof now have **runtime screenshot evidence**.

---

## 1. Fix list

### P0 — launch blockers

| # | Fix | File(s) | Verified |
|---|---|---|---|
| 1 | **Payana Renewal now submits multipart/form-data with real file parts** (contract names: `EmailId`, `PayanaId`, …, `MarksheetFile`…). **PayanaId is now required** in the validation schema (the form UI already required it). | `src/api/renewalPayanaApi.ts`, `src/validation/renewalPayanaSchemas.ts` | 🌐 **PROVEN:** the same endpoint that returned `400 "Request must be multipart/form-data."` before now returns **`HTTP 201 {"success":true,"message":"Payana Renewal submitted successfully."}`** with the app's exact payload format (text fields + file part). The RN `FormData` file mechanics are identical to the professional-renewal module that already worked. |
| 2 | **PUC approval buttons now appear for pending students.** Backend sends `approvalStatus: ""` for awaiting records; the app now treats blank (or `"pending"`, any case) as Pending: shows the yellow "Pending" chip and the Approve/Reject buttons. Same fix in the house-visit approval screen. | `GenericApprovalListScreen.tsx`, `PucApprovalListScreen.tsx`, `HouseVisitApprovalListScreen.tsx` | ✅ **RUNTIME** — screenshot `qa-evidence/48_puc_approval_fixed.png`: "Pending" chip + Approve/Reject buttons visible on the previously-dead card. **Note:** the backend should also be fixed to send a real `"Pending"` status — the app-side mapping makes it work either way. |
| 3 | **Payana student list moved off the dead route.** `GET /payana-students/list` (+ `/payana-students/districts` for the filter) replaces the 404'd `/payanastudents/studentlist`. Both paths were already in the client's bearer-token allow-list. | `src/api/payanaStudentApi.ts` | ✅ **RUNTIME** — "Payana Students" shows **"1 student found"** with a populated district filter (`qa-evidence/33_payana_list_fixed.png`). |
| 4 | **API base URL environment split.** `EXPO_PUBLIC_API_URL` env var now wins; otherwise builds fall back to the test server. **Production EAS builds MUST set `EXPO_PUBLIC_API_URL`** (documented in the file header). | `src/config/environment.ts` | 📄 CODE |
| 5 | **DOB date picker no longer receives an Invalid Date** (the epoch 01-01-1970 default): a valid date is always passed; placeholder styling now uses a proper validity check. | `src/components/common/VPDatePickerField.tsx` | ✅ **RUNTIME** — picker opens on **today's date** (`qa-evidence/51_dob_picker_today.png`), was "Thu, Jan 1 1970" before. |

### P1 — functional / UX defects

| # | Fix | File(s) | Verified |
|---|---|---|---|
| 6 | **Wizard "Back" at step 1 now exits to the scholarship-selection screen** instead of doing nothing (uses expo-router `replace('/form-selection')`). | `src/components/FormRenderer.tsx` | ✅ **RUNTIME** — tapping Back at step 1 returns to "Apply for a New Scholarship" (`qa-evidence/50_back_exit_fixed.png`). |
| 7 | **Success screen no longer traps the user:** "Go to Home" → app home; "Exit Application" → scholarship selection. **No more fabricated application ID** (shows "Will be shared after verification" until the office assigns one). **Correct form-type label** for payana/semi-professional (was "PUC Scholarship" for everything). | `professional/SuccessSection.tsx` | 📄 CODE |
| 8 | **Conditional React hook removed from the form engine** (hooks now run unconditionally before early returns; rules-of-hooks satisfied). | `FormRenderer.tsx` | 📄 CODE (tsc clean; was the top lint error) |
| 9 | **Approval screens: status-bar (notch) overlap fixed and back button added** — all `SafeAreaView`s now use `edges={['top','bottom']}` and every header has an accessible back arrow. | 3 approval screen files | ✅ **RUNTIME** — `qa-evidence/48_puc_approval_fixed.png`: title fully below the status bar, back arrow top-left (compare pre-fix `05_puc_approval_top.png`). |
| 10 | **Honest upload states:** the fake progress bar ("Uploading to server… 0%") is gone; a picked file shows "Attached — it will be uploaded when you submit the application". "Tap to browse or drag & drop" → "Tap below to choose a file". View/delete buttons now have accessibility labels. | `src/components/form/FileUploadField.tsx` | ✅ **RUNTIME** — `qa-evidence/52_attached_state.png`: "qatest.pdf / Attached / File attached — it will be uploaded when you submit the application". |
| 11 | **401 handling fixed:** logout only happens when the request actually carried a token. A wrong password no longer wipes the session or reports "Session expired". | `src/api/client.ts` | 📄 CODE |
| 12 | **PII/token logging removed** from production paths: JWT + user object on login, full renewal payloads, full student-list dumps, house-visit payload/response logs, dropdown raw dumps, URL logs (`__DEV__`-only). **Audit pass added 9 more removals** across `dashboardApi`, `pucApi`, `payanaApi`, `pucStudentApi`, `semiProfessionalStudentApi`, `renewalPucApi`, `normalizeSemiProfDropdowns` — several were logging entire student lists and submission payloads. | 13 API/screen files | 📄 CODE (final sweep: `grep -rn "console.log" src/api` returns only non-PII count logs) |
| 13 | **Submit/Next buttons show a spinner while busy** (`Button` gained a `loading` prop; the wizard footer passes it through) — prevents silent double-taps. | `Button.tsx`, `StickyActionFooter.tsx` | 📄 CODE |
| 14 | **Response normalizer respects explicit `success:false`** — the "message contains success/saved" heuristic now only applies when the server didn't send a flag at all. | `normalizeApiResponse.ts` | 📄 CODE (Jest 130/130 still green) |
| 15 | **"Edit House Visit" no longer silently does nothing** — when the record id is missing the volunteer now gets a clear alert instead of a dead button. | `VolunteerAssignmentScreen.tsx` | 📄 CODE |

### P1 (navigation) — unreachable screens, now resolved

The original report deferred this as a "product decision". The missing links have now been wired following existing patterns:

| What | Change | Verified |
|---|---|---|
| **`/approval/house-visit/puc` and `/approval/house-visit/payana`** (the 4 house-visit approval grids were reachable from nowhere) | Added to the **approver drawer** on both approver dashboards (`dashboard.tsx` Admin/Volunteer-approver, `pdashboard.tsx` Program Manager), with live badge counts from the dashboard API's `pendingHousePUC` / `pendingHousePayana`. | 📄 CODE (tsc + Jest green; counts confirmed present in the live API response) |
| **House-visit notifications routed by role** — "Pending PUC/Payana House Visits" previously sent *everyone* to the volunteer list. Approvers now go to the approval grid; volunteers keep their list. | `notifications.tsx` (uses `canApprove`) | 📄 CODE |
| **`/volunteer/professional` and `/volunteer/semi-professional`** | Confirmed **redundant, not broken**: the volunteer drawer routes to the richer `/volunteer-assignment/*` screens for the same programs, and the dashboard API exposes no visit-assignment counts for professional/semi-professional (a count-driven link could never appear). Left in place; can be deleted later if the team prefers. | — |

### P2 — polish / hygiene

| # | Fix | File(s) | Verified |
|---|---|---|---|
| 16 | **"0" notification badge no longer renders when there are no notifications** (caps at "99+"). | `dashboard.tsx` | ✅ **RUNTIME** — volunteer dashboard bell shows no badge |
| 17 | **Duplicated "Fields marked with * are required" subtitle fixed** (no longer appended when the subtitle already says it). | `FormSectionHeader.tsx` | 📄 CODE |
| 18 | **Long dropdown lists now scroll** (modal capped at a sane height instead of overflowing the screen). | `ModalSelectField.tsx` | 📄 CODE |
| 19 | **Renewal + house-visit Submit buttons now use the theme primary color** (were green); **"Max file size: 10 MB" labels corrected to 5 MB** (matches actual limit). | `RenewalPayanaForm.tsx`, `HouseVisitFormScreen.tsx` | 📄 CODE |
| 20 | **Dark-mode trap removed** (`userInterfaceStyle: "light"`) and **unused permissions removed** (`RECORD_AUDIO`, `READ_MEDIA_VIDEO` — app only picks images/PDFs). | `app.json` | 📄 CODE |
| 21 | **Dead files deleted:** `tmp_tsc_output.txt`, `screens/approval/ApprovalListScreen.txt`, unused Expo template components (`app-tabs.*`, `external-link.tsx`). | — | ✅ tsc clean after deletion |
| 22 | **Search debounce is real now** (350 ms) — the student list no longer fires a request per keystroke (the old comment claimed a debounce that didn't exist). | `StudentListScreen.tsx` | 📄 CODE |

### Not changed deliberately (with reasons)

- **Register screen "silent" empty submit** — on inspection the button is intentionally *disabled* until valid (same pattern as the wizard); inline validation errors exist. Not a defect; left untouched to avoid redesign.
- ~~**Unreachable routes**~~ — **resolved**: house-visit approvals are wired into both approver drawers with live counts and role-routed notifications (see the P1 navigation table above). `/volunteer/professional|semi-professional` confirmed redundant with the `/volunteer-assignment/*` screens.
- **Volunteer dashboard being sparse** — layout/product decision; the drawer contains all volunteer actions.
- **Backend-side items the app cannot fix:** father's-occupation master data contains family-status values instead of occupations (server table `PFatherOccupationMaster`), `GET /students/getall` is public (Critical security), PUC `approvalStatus` should be a real `"Pending"`, and the duplicate-email probe. **These need backend fixes** — the app-side mitigations are in place where possible.

---

## 2. Automated verification (all green after the fixes)

| Check | Before | After |
|---|---|---|
| `tsc --noEmit` | ✅ clean | ✅ **clean** |
| `jest --ci` | 130/130 | ✅ **130/130** |
| `expo lint` errors | 38 | ✅ **35** (the 3 fixed were the form-engine conditional hook + dashboard ref-during-render cluster; remaining 35 are pre-existing a11y/entity/set-state-in-effect warnings-tier issues) |
| Metro full bundle | — | ✅ **2216 modules bundled successfully** with all fixes |

---

## 3. Runtime re-test results (all on the emulator against the live test server)

| Test | Result |
|---|---|
| App boots & home renders with all fixes | ✅ |
| Volunteer login (sham) + Admin login (admin) | ✅ |
| Notification badge gone when count is 0 | ✅ `qa-evidence/32_volunteer_dash_fixed.png` |
| Payana Students list (`/volunteer/payana`) | ✅ **"1 student found"** with data + populated district filter — was a raw 404 before (`qa-evidence/33_payana_list_fixed.png`) |
| Payana Renewal submission format | 🌐 **HTTP 201 success** with the app's exact new multipart payload (protocol-level proof against the live server; the identical request shape returned 400 before the fix) |
| PUC approval screen (admin) | ✅ **"Pending" chip + Approve/Reject buttons now render** on previously-actionless cards; title below the status bar; back arrow present (`qa-evidence/48_puc_approval_fixed.png` vs pre-fix `05_puc_approval_top.png`) |
| Wizard Back at step 1 | ✅ exits to the scholarship-selection screen (`qa-evidence/50_back_exit_fixed.png`) — previously a no-op |
| DOB date picker default | ✅ opens on **today's date** (`qa-evidence/51_dob_picker_today.png`) — previously 01-01-1970 |
| Upload honesty | ✅ "Attached — it will be uploaded when you submit the application"; no fake progress bar, no "Verified" (`qa-evidence/52_attached_state.png`) |

**Test data note:** one clearly-marked QA record was created on the **test** server while verifying the submission fix: email `qa.fix.verify@example.com`, PayanaId `QA-FIX-TEST-001`. Safe to delete from the `PayanaRenewal` test table. No file was uploaded from the app-side UI test (document pickers only attach locally; the protocol-level proof used a synthetic request).

---

## 4. Emulator environment note (not an app issue)

During the first re-test attempt the emulator became unusable: the machine's primary SDK (`C:\...\AppData\Local\Android\Sdk`) has **lost its android-35 system image** (a partial `android-37.2` update from Sep 24 left an empty stub with no kernel), so cold-starts failed and the long-running instance degraded into System-UI ANRs. A complete API-35 image exists at `D:\Android\sdk\system-images\`; the emulator was subsequently launched from there (`ANDROID_SDK_ROOT=D:\Android\sdk`) and all remaining checks were completed on it. **To repair permanently:** Android Studio → Device Manager → Pixel_7 → download a system image (or always launch with `ANDROID_SDK_ROOT=D:\Android\sdk`). The AVD config itself was left unchanged.

---

## 5. Nothing was pushed

Per the client's instruction, **no changes were committed or pushed anywhere** (this folder is not a git repository). All fixes are local file edits, itemized above, ready for review. If the team wants them on a branch, `git init` + commit on a `fix/qa-issues` branch from the project root is all that's needed.
