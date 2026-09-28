# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

```
NGO-APP
├─ .agents
│  └─ skills
│     ├─ vp-api-contracts.md
│     ├─ vp-error-handling.md
│     ├─ vp-form-engine.md
│     ├─ vp-platform-architecture.md
│     ├─ vp-type-safety.md
│     ├─ vp-ui-design-system
│     │  └─ SKILL.md
│     └─ vp-ui-system
│        └─ SKILL.md
├─ .devin
│  └─ rules
│     └─ instructions.md
├─ API Endpoints.md
├─ app.json
├─ ARCHITECTURE.md
├─ assets
│  ├─ expo.icon
│  │  ├─ Assets
│  │  │  ├─ expo-symbol 2.svg
│  │  │  └─ grid.png
│  │  └─ icon.json
│  ├─ icon.png
│  ├─ images
│  │  ├─ expo-badge-white.png
│  │  ├─ expo-badge.png
│  │  ├─ expo-logo.png
│  │  ├─ favicon.png
│  │  ├─ logo-glow.png
│  │  ├─ react-logo.png
│  │  ├─ react-logo@2x.png
│  │  ├─ react-logo@3x.png
│  │  ├─ splash-icon.png
│  │  ├─ tabIcons
│  │  │  ├─ explore.png
│  │  │  ├─ explore@2x.png
│  │  │  ├─ explore@3x.png
│  │  │  ├─ home.png
│  │  │  ├─ home@2x.png
│  │  │  └─ home@3x.png
│  │  └─ tutorial-web.png
│  └─ Logo.png
├─ downloads.css
├─ downloads.html
├─ downloads.zip
├─ eas.json
├─ package-lock.json
├─ package.json
├─ README.md
├─ scripts
│  └─ reset-project.js
├─ src
│  ├─ api
│  │  ├─ approvalApi.ts
│  │  ├─ authApi.ts
│  │  ├─ client.ts
│  │  ├─ dashboardApi.ts
│  │  ├─ houseVisitApi.ts
│  │  ├─ payanaApi.ts
│  │  ├─ payanaStudentApi.ts
│  │  ├─ professionalApi.ts
│  │  ├─ professionalStudentApi.ts
│  │  ├─ pucApi.ts
│  │  ├─ pucStudentApi.ts
│  │  ├─ registrationApi.ts
│  │  ├─ renewalPayanaApi.ts
│  │  ├─ renewalProfessionalApi.ts
│  │  ├─ renewalPucApi.ts
│  │  ├─ semiProfessionalApi.ts
│  │  ├─ studentApi.ts
│  │  └─ transformers
│  │     ├─ normalizeApiResponse.ts
│  │     ├─ normalizeDropdowns.ts
│  │     └─ normalizeSemiProfDropdowns.ts
│  ├─ app
│  │  ├─ approval
│  │  │  ├─ payana.tsx
│  │  │  ├─ professional.tsx
│  │  │  ├─ puc.tsx
│  │  │  └─ semi-professional.tsx
│  │  ├─ dashboard.tsx
│  │  ├─ forgot-password.tsx
│  │  ├─ form-engine.tsx
│  │  ├─ form-selection.tsx
│  │  ├─ housevisit
│  │  │  └─ create.tsx
│  │  ├─ index.tsx
│  │  ├─ login.tsx
│  │  ├─ notifications.tsx
│  │  ├─ pdashboard.tsx
│  │  ├─ register.tsx
│  │  ├─ renewal-payana.tsx
│  │  ├─ renewal-professional.tsx
│  │  ├─ renewal-puc.tsx
│  │  ├─ reset-password.tsx
│  │  ├─ volunteer
│  │  │  ├─ professional.tsx
│  │  │  └─ puc.tsx
│  │  └─ _layout.tsx
│  ├─ components
│  │  ├─ animated-icon.module.css
│  │  ├─ animated-icon.tsx
│  │  ├─ animated-icon.web.tsx
│  │  ├─ app-tabs.tsx
│  │  ├─ app-tabs.web.tsx
│  │  ├─ approval
│  │  │  ├─ StudentRow.tsx
│  │  │  └─ StudentRowSkeleton.tsx
│  │  ├─ common
│  │  │  ├─ Button.tsx
│  │  │  ├─ Chip.tsx
│  │  │  ├─ FormCard.tsx
│  │  │  ├─ FormSectionHeader.tsx
│  │  │  ├─ ModalSelectField.tsx
│  │  │  ├─ SegmentedControl.tsx
│  │  │  ├─ Stepper.tsx
│  │  │  ├─ StickyActionFooter.tsx
│  │  │  ├─ VPDatePickerField.tsx
│  │  │  └─ VPInputField.tsx
│  │  ├─ external-link.tsx
│  │  ├─ form
│  │  │  ├─ DropdownField.tsx
│  │  │  └─ FileUploadField.tsx
│  │  ├─ FormRenderer.tsx
│  │  ├─ hint-row.tsx
│  │  ├─ layout
│  │  │  ├─ FormScreenLayout.tsx
│  │  │  └─ ProgressHeader.tsx
│  │  ├─ student
│  │  │  └─ StudentDetailModal.tsx
│  │  ├─ themed-text.tsx
│  │  ├─ themed-view.tsx
│  │  ├─ volunteer
│  │  │  └─ VolunteerStudentRow.tsx
│  │  └─ web-badge.tsx
│  ├─ config
│  │  └─ environment.ts
│  ├─ constants
│  │  ├─ formOptions.ts
│  │  └─ theme.ts
│  ├─ forms
│  │  ├─ payana
│  │  │  ├─ config.ts
│  │  │  ├─ defaults.ts
│  │  │  └─ mapper.ts
│  │  ├─ professional
│  │  │  ├─ config.ts
│  │  │  ├─ defaults.ts
│  │  │  ├─ dropdowns.ts
│  │  │  ├─ fileKeys.ts
│  │  │  ├─ mapper.ts
│  │  │  ├─ uploads.ts
│  │  │  └─ validation.ts
│  │  ├─ puc
│  │  │  ├─ config.ts
│  │  │  ├─ defaults.ts
│  │  │  ├─ dropdowns.ts
│  │  │  ├─ fileKeys.ts
│  │  │  ├─ mapper.ts
│  │  │  ├─ uploads.ts
│  │  │  └─ validation.ts
│  │  ├─ semiProfessional
│  │  │  ├─ config.ts
│  │  │  ├─ fileKeys.ts
│  │  │  ├─ mapper.ts
│  │  │  └─ uploads.ts
│  │  └─ shared
│  │     ├─ baseSchemas.ts
│  │     ├─ commonSections.ts
│  │     ├─ registry.ts
│  │     ├─ types.ts
│  │     └─ uploadTypes.ts
│  ├─ global.css
│  ├─ hooks
│  │  ├─ api
│  │  │  ├─ useProfessionalDropdowns.ts
│  │  │  ├─ usePUCDropdowns.ts
│  │  │  └─ useStudentList.ts
│  │  ├─ use-color-scheme.ts
│  │  ├─ use-color-scheme.web.ts
│  │  └─ use-theme.ts
│  ├─ mappers
│  │  └─ mapApplicationToApi.ts
│  ├─ screens
│  │  ├─ approval
│  │  │  └─ ApprovalListScreen.txt
│  │  ├─ auth
│  │  │  ├─ ForgotPasswordScreen.tsx
│  │  │  ├─ LoginScreen.tsx
│  │  │  ├─ RegisterScreen.tsx
│  │  │  └─ ResetPasswordScreen.tsx
│  │  ├─ common
│  │  │  └─ GuidelinesScreen.tsx
│  │  ├─ form-sections
│  │  │  ├─ payana
│  │  │  │  ├─ AcademicSection.tsx
│  │  │  │  ├─ AddressSection.tsx
│  │  │  │  ├─ BankSection.tsx
│  │  │  │  ├─ CategorySection.tsx
│  │  │  │  ├─ ContactSection.tsx
│  │  │  │  ├─ DocumentSection.tsx
│  │  │  │  ├─ FamilySection.tsx
│  │  │  │  ├─ GuidelinesSection.tsx
│  │  │  │  └─ PersonalSection.tsx
│  │  │  ├─ professional
│  │  │  │  ├─ AcademicSection.tsx
│  │  │  │  ├─ AddressSection.tsx
│  │  │  │  ├─ BankSection.tsx
│  │  │  │  ├─ ContactSection.tsx
│  │  │  │  ├─ DocumentSection.tsx
│  │  │  │  ├─ FamilySection.tsx
│  │  │  │  ├─ GuidelinesSection.tsx
│  │  │  │  ├─ PersonalSection.tsx
│  │  │  │  ├─ ReviewSection.tsx
│  │  │  │  └─ SuccessSection.tsx
│  │  │  ├─ puc
│  │  │  │  ├─ AcademicSection.tsx
│  │  │  │  ├─ AddressSection.tsx
│  │  │  │  ├─ CategorySection.tsx
│  │  │  │  ├─ ContactSection.tsx
│  │  │  │  ├─ DocumentSection.tsx
│  │  │  │  ├─ FamilySection.tsx
│  │  │  │  └─ PersonalSection.tsx
│  │  │  ├─ renewal
│  │  │  │  ├─ RenewalPayanaForm.tsx
│  │  │  │  ├─ RenewalProfessionalForm.tsx
│  │  │  │  └─ RenewalPUCForm.tsx
│  │  │  └─ semiProfessional
│  │  │     ├─ AcademicSection.tsx
│  │  │     ├─ AddressSection.tsx
│  │  │     ├─ DocumentSection.tsx
│  │  │     ├─ FamilySection.tsx
│  │  │     ├─ GuidelinesSection.tsx
│  │  │     ├─ PersonalSection.tsx
│  │  │     ├─ ReviewSection.tsx
│  │  │     └─ SuccessSection.tsx
│  │  ├─ house-visit
│  │  │  ├─ components
│  │  │  │  ├─ SectionABasicDetails.tsx
│  │  │  │  ├─ SectionBHousing.tsx
│  │  │  │  └─ SectionCSocial.tsx
│  │  │  ├─ HouseVisitFormScreen.tsx
│  │  │  └─ mapper.ts
│  │  └─ volunteer
│  │     └─ StudentListScreen.tsx
│  ├─ services
│  │  ├─ formService.ts
│  │  └─ payanaApi.ts
│  ├─ store
│  │  ├─ useAuthStore.ts
│  │  └─ useFormEngineStore.ts
│  ├─ submission
│  │  ├─ attachFiles.ts
│  │  ├─ index.ts
│  │  ├─ preparePayload.ts
│  │  ├─ serializeMultipart.ts
│  │  ├─ submit.ts
│  │  ├─ validatePayload.ts
│  │  └─ __tests__
│  │     └─ submission.test.ts
│  ├─ theme
│  │  ├─ colors.ts
│  │  ├─ DESIGN_SYSTEM.md
│  │  ├─ platform.ts
│  │  ├─ spacing.ts
│  │  └─ typography.ts
│  ├─ types
│  │  ├─ api.ts
│  │  ├─ dashboard.ts
│  │  ├─ documents.ts
│  │  ├─ forms.ts
│  │  ├─ houseVisit.ts
│  │  └─ studentList.ts
│  ├─ utils
│  │  ├─ accessibility.ts
│  │  ├─ apiError.ts
│  │  ├─ apiMapper.ts
│  │  ├─ apiResponse.ts
│  │  ├─ filePicker.ts
│  │  ├─ fileValidation.ts
│  │  ├─ formSubmissionState.ts
│  │  ├─ logger.ts
│  │  ├─ mapFormToApi.ts
│  │  ├─ navigationFlow.ts
│  │  ├─ networkResilience.ts
│  │  ├─ roleUtils.ts
│  │  └─ validateFullForm.ts
│  └─ validation
│     ├─ formSchemas.ts
│     ├─ houseVisitSchemas.ts
│     ├─ payanaSchemas.ts
│     ├─ professionalSchemas.ts
│     ├─ pucSchemas.ts
│     ├─ renewalPayanaSchemas.ts
│     ├─ renewalProfessionalSchemas.ts
│     ├─ renewalPucSchemas.ts
│     ├─ semiProfessionalSchemas.ts
│     └─ sharedSchemas.ts
├─ tmp_tsc_output.txt
└─ tsconfig.json

```