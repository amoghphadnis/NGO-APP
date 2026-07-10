# Acceptance Checklists

## Manual QA Checklist (Per Form Type)

### Pre-Submission Checks

- [ ] App launches without crash
- [ ] Form selection screen shows all 4 form types
- [ ] Selecting a form type navigates to form-engine with correct `formType` param
- [ ] Guidelines step displays terms and requires acceptance
- [ ] Cannot proceed past guidelines without accepting

### Per-Section Checks (Repeat for each step)

- [ ] Step title displays correctly above content
- [ ] Progress header shows correct step number and percentage
- [ ] All required fields show asterisk (*)
- [ ] Validation errors appear on invalid input
- [ ] Validation errors clear when input corrected
- [ ] Next button disabled when form invalid
- [ ] Next button enabled when form valid
- [ ] Back button navigates to previous step
- [ ] Data persists when navigating back and forward
- [ ] Dropdown fields load options from API
- [ ] Date picker prevents future dates
- [ ] File upload works for documents and images
- [ ] File upload shows progress indicator

### Review Screen Checks

- [ ] Review screen displays all entered data
- [ ] Incomplete sections are flagged
- [ ] Declaration checkbox present
- [ ] Submit button disabled until declaration accepted
- [ ] Submit button disabled if form incomplete
- [ ] Submit triggers API call
- [ ] Loading indicator shown during submission
- [ ] Error message displayed on API failure
- [ ] Can retry after failure

### Success Screen Checks

- [ ] Application ID displayed (from API or fallback)
- [ ] Student name displayed
- [ ] Submission date displayed
- [ ] Process timeline shown
- [ ] "Go to Home" navigates and resets form
- [ ] "Exit Application" resets form state

## NGO Stakeholder Acceptance Checklist

### Professional Form

- [ ] All 16 documents can be uploaded
- [ ] House visit link field requires `https://` prefix
- [ ] All field names match backend API contract (PascalCase)
- [ ] Dropdown options load from `/students/professional/dropdowns`
- [ ] Submission posts to `/students/professional/create`
- [ ] Multipart form data includes all 16 files
- [ ] Application ID returned from API is displayed

### PUC Form

- [ ] Category step present (unique to PUC)
- [ ] All field names use camelCase
- [ ] Submission posts to correct PUC endpoint

### Payana Form

- [ ] Bank step present (unique to Payana)
- [ ] Submission sends JSON (not FormData)
- [ ] File URIs sent as strings in JSON payload

### SemiProfessional Form

- [ ] No contact, category, or bank steps
- [ ] 3 document uploads work
- [ ] Submission posts to correct endpoint

### Cross-Form Checks

- [ ] Form state resets when switching form types
- [ ] No data leakage between form types
- [ ] Token expiry triggers logout
- [ ] Network timeout shows user-friendly error
- [ ] Large file (5MB) uploads successfully
- [ ] App handles offline gracefully (no crash)
