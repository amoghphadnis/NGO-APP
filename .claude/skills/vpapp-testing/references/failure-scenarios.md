# Failure Scenarios

Real production edge cases that must be tested. These reflect VPApp's actual risks based on its architecture: multipart uploads, mobile network conditions, and form state management.

## 1. Network Lost During Upload

**Scenario:** User submits form, network drops mid-upload of 16 documents.
**Expected:** Error message displayed, no partial submission on server, user can retry.
**Test:**
- Mock network failure during `fetch` call
- Verify `submissionState.error` is set
- Verify `submissionState.isSubmitted` is false
- Verify user can retry without re-entering data

## 2. API Timeout During Submission

**Scenario:** API takes longer than 30s timeout.
**Expected:** `fetchWithTimeout` aborts, error shown, no hang.
**Test:**
- Mock `fetch` to delay > 30s
- Verify `AbortController` triggers
- Verify `ApiError` with timeout message

## 3. Duplicate Submission Prevention

**Scenario:** User taps Submit twice rapidly.
**Expected:** Second tap ignored, `submissionState.isSubmitting` prevents re-entry.
**Test:**
- Verify submit button disabled when `isSubmitting` is true
- Verify only one API call made

## 4. Back Button During Upload

**Scenario:** User presses Back while submission is in progress.
**Expected:** Either block navigation or cancel submission cleanly.
**Test:**
- Verify `submissionState.isSubmitting` blocks back navigation
- Or verify submission abort on unmount

## 5. Resume After App Kill

**Scenario:** User fills 5 steps, app is killed, reopens.
**Expected:** Form data lost (no persistence currently). User starts fresh.
**Risk:** No `AsyncStorage` persistence for form data. Known limitation.
**Test:**
- Document current behavior (fresh start)
- Future: test with AsyncStorage persistence if added

## 6. Token Expired Mid-Session

**Scenario:** User is on step 6, API returns 401 on dropdown load.
**Expected:** Auto-logout triggered, user redirected to login.
**Test:**
- Mock API returning 401
- Verify `logout()` called
- Verify navigation to login screen
- Verify form data preserved in store (not reset on logout)

## 7. Large File Upload (5MB+)

**Scenario:** User uploads 5MB PDF document.
**Expected:** Upload succeeds, no memory warning, no crash.
**Test:**
- Mock file with 5MB size
- Verify `appendFileToFormData` handles it
- Verify no OOM on Android low-memory devices

## 8. Partial Multipart Failure

**Scenario:** Server accepts some files but rejects one (e.g., corrupt PDF).
**Expected:** Server returns error, user sees which file failed.
**Risk:** Current implementation doesn't have per-file error tracking from server response.
**Test:**
- Mock server returning 400 with file-specific error
- Verify error message displayed

## 9. House Visit Link Validation

**Scenario:** User enters `http://` (not `https://`) or non-URL text.
**Expected:** Zod schema rejects with "Link must start with https://" message.
**Test:**
- `professionalDocumentDetailsSchema.safeParse({ HouseVisitLink: 'http://example.com' })` → fail
- `professionalDocumentDetailsSchema.safeParse({ HouseVisitLink: 'not-a-url' })` → fail
- `professionalDocumentDetailsSchema.safeParse({ HouseVisitLink: 'https://example.com' })` → pass

## 10. Declaration Checkbox Bypass

**Scenario:** User tries to submit without checking declaration.
**Expected:** Submit button remains disabled.
**Test:**
- Verify `canSubmit` is false when `declarationAccepted` is false
- Verify `canSubmit` is true when `declarationAccepted` is true AND `isFormComplete()` is true
- Verify button `disabled` prop reflects `canSubmit`

## 11. Form Type Switch Mid-Fill

**Scenario:** User fills 3 steps of Professional, goes back, selects PUC.
**Expected:** `initializeForm('puc')` resets all state, PUC form starts fresh.
**Test:**
- Call `initializeForm('professional')`, fill data
- Call `initializeForm('puc')`
- Verify `formData` is PUC defaults (not Professional data)
- Verify `completedSteps` is empty
- Verify `currentStep` is 0

## 12. Empty Form Data Submit

**Scenario:** Review screen somehow reached with empty form data.
**Expected:** `isFormComplete()` returns false, submit disabled.
**Test:**
- Initialize form, skip to review step
- Verify `isFormComplete()` returns false
- Verify submit button disabled
