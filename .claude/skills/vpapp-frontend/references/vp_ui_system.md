# VP UI System

## Component Catalog

### FormScreenLayout
**File:** `src/components/layout/FormScreenLayout.tsx`
**Props:** `title`, `step`, `onBack`, `onNext`, `nextDisabled`, `children`
**Rules:**
- Screen title is ALWAYS above content, never inside cards
- Includes ProgressHeader with step indicator
- ScrollView has 140px bottom padding to prevent footer overlap
- Integrates StickyActionFooter automatically

### StickyActionFooter
**File:** `src/components/common/StickyActionFooter.tsx`
**Rules:**
- Always fixed position, never moves between screens
- Safe area aware
- Back + Next buttons with consistent width
- Buttons are disabled (not hidden) when conditions aren't met
- 56px minimum touch targets

### VPInputField
**File:** `src/components/common/VPInputField.tsx`
**Props:** `label`, `value`, `onChangeText`, `placeholder`, `error`, `helperText`, `successText`, `prefix`, `suffix`, `icon`, `required`
**Rules:**
- 56px minimum height
- Platform-specific padding (Android: `textAlignVertical: 'center'`, `includeFontPadding: false`)
- NEVER use raw `TextInput` — always use `VPInputField`
- Supports accessibility labels

### VPDatePickerField
**File:** `src/components/common/VPDatePickerField.tsx`
**Rules:**
- Native date picker on tap (no manual typing)
- DD/MM/YYYY display format
- Future date prevention
- Returns `YYYY-MM-DD` string format

### ModalSelectField
**File:** `src/components/common/ModalSelectField.tsx`
**Props:** `label`, `placeholder`, `value`, `onChange`, `options`, `error`, `required`, `disabled`
**Rules:**
- Uses bottom sheet modal for option selection
- Options are `Option<T>[]` where `T` is typically `number` (for IDs)

### FormCard
**File:** `src/components/common/FormCard.tsx`
**Rules:**
- 16px border radius
- 20px padding
- Platform-specific shadows/elevation
- 24px bottom margin between cards

### FormSectionHeader
**File:** `src/components/common/FormSectionHeader.tsx`
**Props:** `icon`, `title`, `subtitle`, `showRequired`
**Rules:**
- ALWAYS above card content, never inside cards
- Shows required field indicator when `showRequired` is true

### Stepper
**File:** `src/components/common/Stepper.tsx`
**Rules:**
- 56px minimum height
- Material 3 inspired segmented control
- Large touch targets

### SegmentedControl
**File:** `src/components/common/SegmentedControl.tsx`
**Rules:**
- For toggle/enum selections
- Consistent with Material 3 design

### Chip
**File:** `src/components/common/Chip.tsx`
**Rules:**
- For tag/multi-select inputs

## DO

- Use `FormScreenLayout` for ALL form screens
- Place screen titles ABOVE content
- Use `StickyActionFooter` for navigation
- Apply global spacing rules from `spacing.ts`
- Ensure 48px minimum touch targets
- Use `VPInputField` for all text inputs
- Use `VPDatePickerField` for all date inputs
- Include accessibility labels on form fields

## DON'T

- Place screen titles inside cards
- Allow footer buttons to move between screens
- Let ScrollView overlap sticky footer
- Use raw `TextInput` directly
- Use platform-default input sizing
- Allow inconsistent spacing between fields
- Use touch targets smaller than 48px
- Let Android appear compressed (always apply platform normalization)

## Spacing Rules (MANDATORY)

| Token | Value | Usage |
|---|---|---|
| screenHorizontal | 20px | Screen edge padding |
| sectionSpacing | 24px | Between sections |
| fieldSpacing | 20px | Between form fields |
| labelSpacing | 8px | Label to input |
| cardPadding | 20px | Inside FormCard |
| footerPadding | 16px | Inside StickyActionFooter |
| borderRadius | 16px | Card corners |
| scrollViewBottomPadding | 140px | Prevent footer overlap |

## Color Tokens

| Token | Value | Usage |
|---|---|---|
| primary | `#4F5DFF` | Primary actions, headers |
| primaryDark | `#3F4AE0` | Pressed states |
| background | `#F5F6FA` | Screen background |
| card | `#FFFFFF` | Card background |
| textPrimary | `#1A1A1A` | Primary text |
| textSecondary | `#6B7280` | Secondary text |
| border | `#E5E7EB` | Borders, dividers |
| success | `#22C55E` | Success states |
| error | `#EF4444` | Error states |
| warning | `#F59E0B` | Warning states |
| disabled | `#D1D5DB` | Disabled elements |
