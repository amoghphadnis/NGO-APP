# AI Development Rules

Hard rules that AI assistants MUST follow when working on VPApp. These prevent the most common mistakes.

## NEVER

1. **Never use axios** — The project uses native `fetch` via `src/api/client.ts`. Do not import or install axios.
2. **Never use raw `TextInput`** — Always use `VPInputField` from `src/components/common/VPInputField.tsx`.
3. **Never bypass the mapper layer** — Always go through `preparePayload()` → `submitApplication()`. Do not construct FormData directly in components.
4. **Never hardcode navigation** — Always use `FormRenderer` + `FormConfig` step definitions. Do not hardcode screen names or step indices in components.
5. **Never create form sections without a registry entry** — Every new section must be added to the form config's `steps` array AND the component map in `FormRenderer.tsx`.
6. **Never use Yup** — The project uses Zod for all validation. Do not install or import Yup.
7. **Never use Redux** — The project uses Zustand (`src/store/useFormEngineStore.ts`). Do not install Redux or create Redux stores.
8. **Never use `ScreenWrapper`** — This component does not exist. Use `FormScreenLayout` for form screens.
9. **Never place screen titles inside cards** — Titles go ABOVE card content, using `FormSectionHeader` or `FormScreenLayout`'s `title` prop.
10. **Never use `expo prebuild --clean`** without re-applying native config — See `.devin/rules/instructions.md` for native build guardrails.
11. **Never create Python scripts** — The project is TypeScript/Node.js. All tooling scripts must be `.ts` files run via `npx tsx`.
12. **Never use `any` without justification** — Type all props, state, and return values. `{ navigation }: any` should be replaced with proper types.

## ALWAYS

1. **Always use `FormScreenLayout`** for form screens — It provides title, progress header, scroll view, and sticky footer.
2. **Always use PascalCase for professional form fields** — `StudentName`, `DateOfBirth`, `GenderID`, etc. This matches the backend API contract.
3. **Always use camelCase for PUC/Payana/SemiProfessional fields** — These forms target different API contracts.
4. **Always update `PROJECT_CONTEXT_CURRENT.md`** after structural changes — See `.devin/project-context/instructions.md` for rules.
5. **Always use `zodResolver(schema)`** with React Hook Form — `mode: "onChange"` for real-time validation.
6. **Always call `updateSectionData()` and `markStepComplete()`** on form section submit — This syncs data to the Zustand store.
7. **Always use theme tokens** from `src/theme/` — Never hardcode colors, spacing, or font sizes.
8. **Always use `appendFileToFormData()`** for file uploads — Never append files to FormData directly.
9. **Always check `isUploadableFile()`** before appending files — Prevents runtime errors from malformed file objects.
10. **Always run `./gradlew clean`** before `assembleRelease` — Wipes stale CMake cache (see `.devin/rules/instructions.md`).
11. **Always ensure `signingConfig` points to `signingConfigs.release`** in release build type — NOT `signingConfigs.debug`.
12. **Always use `vp:` prefixed npm scripts** for project tooling — `vp:generate`, `vp:validate`, `vp:audit`, `vp:context`.

## Common AI Mistakes to Avoid

| Mistake | Correct Approach |
|---|---|
| Suggesting Next.js patterns | This is Expo/React Native — no SSR, no `getServerSideProps` |
| Using `react-navigation` directly | Use Expo Router (`expo-router`) |
| Creating standalone screen components | Form screens must be in `src/screens/form-sections/{type}/` |
| Importing from `react-native-web` | Import from `react-native` only |
| Suggesting Tailwind CSS | Use the VP theme system (`src/theme/`) |
| Creating new state stores | Use existing `useFormEngineStore` — extend it if needed |
| Using `alert()` for errors | Use proper error state in `submissionState` or inline form errors |
| Suggesting Cypress/Playwright | Use Jest + React Native Testing Library; Detox for E2E |
