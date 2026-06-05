---
name: vp-platform-architecture
description: Core architectural constitution for VPApp Multi-Form Engine. Defines form types, module boundaries, state ownership, and data flow patterns.
---

# VPApp Platform Architecture

## Purpose

This skill documents the stable architectural decisions of the VPApp platform. All other skills reference this as the system "constitution."

---

## Form Types (Discriminated Union)

The platform supports multiple student registration programs through a unified form engine:

```typescript
type FormType = 'professional' | 'puc' | 'payana';

type FormDataUnion = 
  | ProfessionalFormValues 
  | PucFormValues 
  | PayanaFormValues;
```

**Current Forms:**
- **Professional**: Engineering/Medical student scholarship applications
- **PUC**: Pre-university course scholarship applications  
- **Payana**: Special program scholarship applications

**Future Forms:**
- Payana Renewal
- Professional Renewal
- House Visit
- Future NGO programs

---

## Module Boundaries

Each module has clear responsibilities and must not leak concerns:

| Module | Responsibility | Key Artifacts |
|--------|---------------|---------------|
| **Auth** | Login, logout, token management | `AuthContext`, `authApi.ts`, token storage |
| **Dashboard** | Overview counts, application lists, status tracking | `DashboardScreen`, `dashboardApi.ts` |
| **Forms** | Multi-step registration engine | `FormRenderer`, `useFormEngineStore`, mappers |
| **Approval** | Review workflows, decision tracking | `ApprovalScreen`, `approvalApi.ts` |
| **Master Data** | Dropdowns, reference data | `usePUCDropdowns`, `useProfessionalDropdowns` |

**Module Rules:**
1. Dashboard never directly calls form submission APIs
2. Forms never fetch their own dropdowns (use Master Data hooks)
3. Auth guards protect routes but don't implement role logic (yet)
4. Approval workflows are separate from form submissions

---

## State Ownership Matrix

| Data Type | Owner | Library | Cache Category | Example |
|-----------|-------|---------|----------------|---------|
| Form input values | Zustand | `useFormEngineStore` | Session-scoped | `personal.name`, `academic.puPercentage` |
| Dropdown/reference data | React Query | `useQuery` | Long-lived cache | `districts`, `casteCategories` |
| User session | Zustand | `useAuthStore` | Persisted storage | `token`, `userId`, `role` |
| Dashboard counts | React Query | `useQuery` | Short-lived cache | `pendingCount`, `approvedCount` |
| File upload metadata | Component state | `useState` | Ephemeral | `uploadProgress`, `selectedFile` |

### Cache Categories

**Session-Scoped (Zustand)**
- Lives only during form session
- Reset on form completion or cancellation
- Never cached across sessions

**Long-Lived Cache (React Query)**
- Reference data (districts, castes, occupations)
- Master data that rarely changes
- Background refresh acceptable

**Short-Lived Cache (React Query)**
- Dashboard counts, statistics
- Frequently changing aggregations
- Fresh data preferred

**Persisted Storage (Zustand)**
- User session, authentication tokens
- Survives app restart
- Secure storage for sensitive data

**Ephemeral (useState)**
- Local UI state
- Screen-specific data
- No caching needed

**Critical Rule:**
```
Form data lives in Zustand. Server data lives in React Query. Never mix them.
```

**Note:** Concrete `staleTime` values are implementation details. Use category guidelines above when configuring React Query.

---

## Data Flow Standard

All data must follow this pipeline:

```
┌─────────────────┐
│  UI Component   │  ← User input, local validation
│  (Section)      │
└────────┬────────┘
         │ updateSectionData()
         ▼
┌─────────────────┐
│  Zustand Store  │  ← Form state, completed steps
│  (formData)     │
└────────┬────────┘
         │ markStepComplete(), preparePayload()
         ▼
┌─────────────────┐
│  Mapper Layer   │  ← UI model → API model
│  (mapper.ts)    │    Field naming, type conversion
└────────┬────────┘
         │ mapped payload
         ▼
┌─────────────────┐
│  API Service    │  ← HTTP client, error handling
│  (pucApi.ts)    │
└────────┬────────┘
         │ HTTP request
         ▼
┌─────────────────┐
│  Backend API    │  ← .NET backend, database
│  (Contract)     │
└─────────────────┘
```

**Flow Rules:**
1. Never bypass the mapper layer — UI models ≠ API models
2. Form data only flows downward — no upstream mutations from mapper
3. API responses don't update form data directly — use store actions
4. All API calls go through service files, never directly from components

---

## Routing Structure

```
App (Navigation Container)
├── Stack.Navigator
│   ├── Public Stack (no auth required)
│   │   ├── /login
│   │   └── /register (if applicable)
│   │
│   └── Protected Stack (auth required)
│       ├── /dashboard
│       ├── /forms
│       │   ├── /forms/professional/*  (Multi-step)
│       │   ├── /forms/puc/*           (Multi-step)
│       │   └── /forms/payana/*        (Multi-step)
│       ├── /approval
│       └── /profile
```

**Current Auth Pattern:**
- Simple token check for protected routes
- No role-based routing (future consideration)
- Session expiry → redirect to `/login`

---

## Form Engine Architecture

The Multi-Form Engine is the core architectural pattern:

```
config.ts              ← FormConfig: steps, sections, validation
    │
    ▼
FormRenderer.tsx       ← Orchestrates section rendering
    │                    - Reads currentStep from store
    │                    - Renders section from componentMap
    │                    - Handles navigation (Next/Back)
    ▼
Section Component      ← Individual form sections
    │                    - PersonalSection, ContactSection, etc.
    │                    - Uses react-hook-form
    │                    - Calls updateSectionData()
    ▼
Zustand Store          ← Central form state
    │                    - formData (union type)
    │                    - currentStep, completedSteps
    │                    - validationState
    ▼
Mapper                 ← UI → API transformation
    │                    - Field name conversion
    │                    - Type conversion
    │                    - FormData construction
    ▼
API Submission         ← HTTP POST
```

**Engine Rules:**
1. All forms follow identical structure (config → renderer → sections → store → mapper → API)
2. Sections are shared across form types where possible
3. Form-specific sections live in `src/screens/form-sections/{type}/`
4. Shared sections (future) live in `src/screens/form-sections/shared/`

---

## File Organization

```
src/
├── api/                    # API services
│   ├── client.ts           # HTTP client, ApiError
│   ├── pucApi.ts           # PUC endpoints
│   ├── professionalApi.ts  # Professional endpoints
│   ├── authApi.ts          # Auth endpoints
│   └── transformers/       # Response transformers
│
├── forms/                  # Form configurations & mappers
│   ├── professional/
│   │   ├── config.ts
│   │   ├── mapper.ts       # UI → API
│   │   └── defaults.ts     # Initial state
│   ├── puc/
│   │   ├── config.ts
│   │   ├── mapper.ts
│   │   └── defaults.ts
│   └── payana/
│       ├── config.ts
│       ├── mapper.ts
│       └── defaults.ts
│
├── screens/
│   ├── form-sections/      # Form section components
│   │   ├── professional/
│   │   ├── puc/
│   │   └── payana/
│   ├── DashboardScreen.tsx
│   └── LoginScreen.tsx
│
├── store/
│   ├── useFormEngineStore.ts   # Form state
│   └── useAuthStore.ts         # Auth state
│
├── validation/
│   ├── sharedSchemas.ts      # Common Zod schemas
│   ├── professionalSchemas.ts
│   ├── pucSchemas.ts
│   └── payanaSchemas.ts
│
├── types/
│   └── forms.ts              # Form type definitions, type guards
│
└── components/
    ├── FormRenderer.tsx      # Form orchestration
    └── common/               # Reusable UI components
```

---

## Critical Architectural Rules

### 1. Never Bypass the Mapper Layer
```typescript
// ❌ Wrong: Direct API call with UI data
await submitForm(formData);

// ✅ Correct: Always map first
const payload = mapProfessionalFormToApiPayload(formData);
await submitForm(payload);
```

### 2. Form Data Lives in Zustand
```typescript
// ❌ Wrong: Local state for form inputs
const [name, setName] = useState('');

// ✅ Correct: Store-driven form data
const { formData, updateSectionData } = useFormEngineStore();
```

### 3. Server Data Lives in React Query
```typescript
// ❌ Wrong: Fetching in useEffect
useEffect(() => { fetchDistricts() }, []);

// ✅ Correct: React Query with caching
const { data: districts } = useDistricts();
```

### 4. Use Discriminated Unions, Never `any`
```typescript
// ❌ Wrong: Type assertion
const data = formData as ProfessionalFormValues;

// ✅ Correct: Type guard
if (isProfessionalForm(formData)) {
  // formData is narrowed to ProfessionalFormValues
}
```

### 5. Module Boundaries Are Enforced
```typescript
// ❌ Wrong: Dashboard calling form API directly
// In DashboardScreen.tsx:
await submitPUCForm(payload); // No!

// ✅ Correct: Dashboard uses dashboard APIs
const { data } = useDashboardCounts(); // Yes
```

---

## State Management Decision Tree

```
Is it user input that needs to persist across screens?
  ├─ Yes → Zustand (useFormEngineStore)
  │         └─ Form data, step progress, validation state
  │         └─ Session-scoped (reset on new form)
  │
  └─ No → Is it server-fetched data?
          ├─ Yes → React Query (useQuery)
          │         ├─ Reference data (districts, castes)
          │         │   └─ Long-lived cache
          │         └─ Dashboard counts, statistics
          │             └─ Short-lived cache
          │
          └─ No → Component State (useState)
                    └─ File picker state, modal visibility, local UI
                    └─ Ephemeral (no caching)
```

---

## Architecture Decision Records (ADR)

Key architectural decisions and their rationale:

| ADR | Decision | Rationale |
|-----|----------|-----------|
| **ADR-001** | State Management = Zustand | Simple, TypeScript-native, no boilerplate |
| **ADR-002** | Server State = React Query | Caching, background refresh, error handling |
| **ADR-003** | Forms = Config Driven | Reuse across form types, centralized control |
| **ADR-004** | Validation = Zod | TypeScript inference, runtime validation |
| **ADR-005** | Transport = Mapper Layer | UI/Backend model separation, contract alignment |
| **ADR-006** | Form Types = Discriminated Unions | Type safety, exhaustive checking |

**When to Challenge ADRs:**
- New requirement violates multiple ADRs → Consider ADR amendment
- Single ADR consistently problematic → Propose alternative with migration plan

---

## Non-Goals (Out of Scope)

This skill does **NOT** define:

- **UI Validation Rules** → See `vp-form-engine.md`
- **API Field Mappings** → See `vp-api-contracts.md`
- **TypeScript Guard Patterns** → See `vp-type-safety.md`
- **Error Handling UX** → See `vp-error-handling.md`
- **Component Implementation Details** → See `vp-ui-system.md`, `vp-ui-design-system.md`

---

## Success Criteria & Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| TypeScript errors per feature | < 5 | `tsc --noEmit` after changes |
| Module boundary violations | 0 | Code review checklist |
| New form implementation time | 1 week | From config to working form |
| Form code reuse | > 90% | New code vs existing patterns |

**Code follows Platform Architecture when:**
- Form types use discriminated unions with type guards
- Data flows through mapper layer before API calls
- No `any` types for form data
- Zustand only for session state, React Query for server state
- Module APIs are not cross-called
- New forms follow the config → renderer → section → store → mapper → API pattern
