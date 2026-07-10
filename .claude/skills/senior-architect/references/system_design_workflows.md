# System Design Workflows

## Form Engine Flow

```
User selects form type (form-selection.tsx)
  → Expo Router navigates to /form-engine?formType=professional
  → form-engine.tsx extracts formType from useLocalSearchParams
  → FormRenderer mounts
    → initializeForm(formType) via Zustand
      → Sets currentFormType
      → Initializes formData with form-specific defaults
      → Initializes uploadState with document keys
      → Resets completedSteps, currentStep=0
    → getFormConfig(formType) from registry
    → config.steps[0] = 'guidelines'
    → componentMap['guidelines'] = GuidelinesSection
    → Renders GuidelinesSection with navigation

User completes step → onSubmit:
  → updateSectionData(section, data) → Zustand store
  → markStepComplete(stepIndex) → Zustand store
  → navigation.navigate(nextStep)
  → FormRenderer reads new currentStep
  → Renders next component
```

## Submission Flow

```
User on Review step, taps Submit:
  → isFormComplete(formData) check
  → declarationAccepted check
  → canSubmit = isFormComplete && declarationAccepted
  → If canSubmit:
    → preparePayload(formType, formData)
      → professionalMapper(formData) → FormData
      → pucMapper(formData) → FormData
      → mapPayanaFormToApiPayload(formData) → JSON
      → semiProfessionalMapper(formData) → FormData
    → submitApplication(formType, payload)
      → createProfessionalStudent(payload) → POST /students/professional/create
      → createPUCStudent(payload) → POST /students/puc/create
      → createPayanaStudent(payload) → POST /api/payanastudent/create
      → createSemiProfessionalStudent(payload) → POST /api/semiprofessionalstudent/create
    → On success:
      → setSubmissionSuccess(true, applicationId)
      → Navigate to success step
    → On error:
      → setSubmissionError(error message)
      → Submit button re-enabled for retry
```

## Upload Lifecycle

```
User on Documents step:
  → Taps upload button for a document key (e.g., 'PUCMarksCard')
  → expo-document-picker.getDocumentAsync() or expo-image-picker
  → File returned as { uri, type, name }
  → updateUploadState(key, { isUploading: true })
  → File stored in formData.documents[key] as UploadableFile
  → updateUploadState(key, { isUploading: false, uploaded: true })

On Submit:
  → Mapper iterates document keys
  → For each key with an UploadableFile:
    → appendFileToFormData(fd, key, file)
      → isUploadableFile(file) check
      → fd.append(key, { uri, type, name })
  → FormData sent to API
```

## API Client Flow

```
api.post(endpoint, body, options):
  → Build URL: API_BASE_URL + endpoint
  → Check BEARER_REQUIRED_PATHS
  → If protected: get token from AsyncStorage
  → Set headers: Content-Type, Authorization
  → fetchWithTimeout(url, { method, body, headers, signal })
    → AbortController with 30s timeout
    → fetch(url, options)
  → Parse response:
    → If ok: return { success: true, data }
    → If 401: logout() → throw ApiError
    → If other error: throw ApiError with status, data, message
  → Catch network errors: throw ApiError with descriptive message
```

## Dropdown Loading Flow

```
Form section mounts (e.g., PersonalSection):
  → useEffect → getProfessionalDropdowns()
    → api.get('/students/professional/dropdowns')
    → normalizeDropdowns(response.data)
    → setGenderOptions(response.data.genders)
    → setCasteOptions(response.data.castes)
  → ModalSelectField receives options
  → User selects → onChange(value) → Controller → RHF
```

## State Reset Flow

```
resetForm():
  → currentFormType = null
  → currentStep = 0
  → completedSteps = {}
  → formData = ProfessionalFormValues defaults  ⚠ (should use current form type)
  → uploadState = PROFESSIONAL_UPLOAD_KEYS defaults  ⚠
  → submissionState = { isSubmitting: false, isSubmitted: false, error: undefined, applicationId: undefined }

Known issue: resetForm() always resets to Professional defaults regardless of currentFormType.
Should call initializeForm(currentFormType) instead.
```
