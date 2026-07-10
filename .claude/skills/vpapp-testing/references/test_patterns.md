# Test Patterns

## Schema Validation Tests

```typescript
import { professionalPersonalDetailsSchema } from '@/validation/professionalSchemas';

describe('professionalPersonalDetailsSchema', () => {
  it('accepts valid data', () => {
    const result = professionalPersonalDetailsSchema.safeParse({
      StudentName: 'John Doe',
      DateOfBirth: '2000-01-15',
      GenderID: 1,
      CasteCategoryID: 2,
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing StudentName', () => {
    const result = professionalPersonalDetailsSchema.safeParse({
      DateOfBirth: '2000-01-15',
      GenderID: 1,
      CasteCategoryID: 2,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Student name');
    }
  });

  it('rejects GenderID of 0', () => {
    const result = professionalPersonalDetailsSchema.safeParse({
      StudentName: 'John',
      DateOfBirth: '2000-01-15',
      GenderID: 0,
      CasteCategoryID: 2,
    });
    expect(result.success).toBe(false);
  });
});
```

## Mapper Tests

```typescript
import { professionalMapper } from '@/forms/professional/mapper';
import { ProfessionalFormValues } from '@/types/forms';

describe('professionalMapper', () => {
  const mockFormData: ProfessionalFormValues = {
    personal: { StudentName: 'John', DateOfBirth: '2000-01-15', GenderID: 1, CasteCategoryID: 2 },
    contact: { Email: 'john@test.com', ContactNumber: '1234567890' },
    address: { DistrictID: 1, Taluk: 'Test', PlaceID: 1, Address: '123 St' },
    family: { FamilyMembers: 4, AnnualIncome: '50000' },
    academic: { PUPercentage: 85, CourseTypeID: 1, CollegeName: 'Test College', CollegeTypeID: 1, CollegeFees: 50000 },
    documents: {
      HouseVisitLink: 'https://example.com',
      PUCMarksCard: { uri: 'file:///test.pdf', type: 'application/pdf', name: 'test.pdf' },
    },
  };

  it('produces FormData', () => {
    const result = professionalMapper(mockFormData);
    expect(result).toBeInstanceOf(FormData);
  });

  it('appends StudentName in PascalCase', () => {
    const appendSpy = jest.spyOn(FormData.prototype, 'append');
    professionalMapper(mockFormData);
    expect(appendSpy).toHaveBeenCalledWith('StudentName', 'John');
  });

  it('appends files via appendFileToFormData', () => {
    const appendSpy = jest.spyOn(FormData.prototype, 'append');
    professionalMapper(mockFormData);
    expect(appendSpy).toHaveBeenCalledWith('PUCMarksCard', expect.objectContaining({
      uri: 'file:///test.pdf',
    }));
  });

  it('skips undefined files', () => {
    const appendSpy = jest.spyOn(FormData.prototype, 'append');
    professionalMapper({ ...mockFormData, documents: { HouseVisitLink: 'https://example.com' } } as any);
    expect(appendSpy).not.toHaveBeenCalledWith('IncomeCertificate', expect.anything());
  });
});
```

## Store Tests

```typescript
import { useFormEngineStore } from '@/store/useFormEngineStore';

describe('useFormEngineStore', () => {
  beforeEach(() => {
    useFormEngineStore.getState().resetForm();
  });

  it('initializes professional form', () => {
    useFormEngineStore.getState().initializeForm('professional');
    const state = useFormEngineStore.getState();
    expect(state.currentFormType).toBe('professional');
    expect(state.formData).toHaveProperty('personal');
  });

  it('updates section data', () => {
    useFormEngineStore.getState().initializeForm('professional');
    useFormEngineStore.getState().updateSectionData('personal', { StudentName: 'Test' });
    const state = useFormEngineStore.getState();
    expect(state.formData.personal.StudentName).toBe('Test');
  });

  it('marks step complete', () => {
    useFormEngineStore.getState().markStepComplete(1);
    expect(useFormEngineStore.getState().completedSteps[1]).toBe(true);
  });

  it('sets submission success with application ID', () => {
    useFormEngineStore.getState().setSubmissionSuccess(true, 'APP123');
    const state = useFormEngineStore.getState();
    expect(state.submissionState.isSubmitted).toBe(true);
    expect(state.submissionState.applicationId).toBe('APP123');
  });
});
```

## Component Tests (RNTL)

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import VPInputField from '@/components/common/VPInputField';

describe('VPInputField', () => {
  it('renders label', () => {
    const { getByText } = render(
      <VPInputField label="Student Name" value="" onChangeText={jest.fn()} />
    );
    expect(getByText('Student Name')).toBeTruthy();
  });

  it('renders error message', () => {
    const { getByText } = render(
      <VPInputField label="Email" value="" onChangeText={jest.fn()} error="Invalid email" />
    );
    expect(getByText('Invalid email')).toBeTruthy();
  });

  it('calls onChangeText on input', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <VPInputField label="Name" value="" onChangeText={onChangeText} placeholder="Enter name" />
    );
    fireEvent.changeText(getByPlaceholderText('Enter name'), 'John');
    expect(onChangeText).toHaveBeenCalledWith('John');
  });
});
```

## Review Gatekeeper Tests

```typescript
describe('ReviewSection isFormComplete', () => {
  it('returns false when personal data missing', () => {
    const formData = { personal: { StudentName: '' } };
    expect(isFormComplete(formData, 'professional')).toBe(false);
  });

  it('returns false when documents missing', () => {
    const formData = { /* complete except documents */ };
    expect(isFormComplete(formData, 'professional')).toBe(false);
  });

  it('returns true when all sections complete', () => {
    const formData = { /* all sections complete */ };
    expect(isFormComplete(formData, 'professional')).toBe(true);
  });
});
```
