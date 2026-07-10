# Testing Setup

## Jest Configuration for Expo 54

### Install Dependencies

```bash
npx expo install jest-expo jest @testing-library/react-native @testing-library/jest-native
npm install -D jest-expo @testing-library/react-native @testing-library/jest-native
```

### jest.config.js

```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-clone-referenced-element|@react-native-community/slider|@react-native-community/datetimepicker|@react-native-community/picker|react-native-gesture-handler|react-native-reanimated|react-native-screens|react-native-safe-area-context|react-native-svg|zustand|zod|@hookform|react-hook-form|dayjs)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/**',
  ],
};
```

### jest.setup.ts

```typescript
import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(() => ({})),
  router: { push: jest.fn(), back: jest.fn(), replace: jest.fn() },
}));

// Mock expo-document-picker
jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
}));

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));
```

### package.json additions

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Mock Patterns

### Mocking Zustand Store

```typescript
import { useFormEngineStore } from '@/store/useFormEngineStore';

jest.mock('@/store/useFormEngineStore', () => ({
  useFormEngineStore: jest.fn(),
}));

beforeEach(() => {
  (useFormEngineStore as jest.Mock).mockReturnValue({
    formData: { personal: { StudentName: 'Test' } },
    updateSectionData: jest.fn(),
    markStepComplete: jest.fn(),
    updateValidationState: jest.fn(),
    currentStep: 0,
    currentFormType: 'professional',
  });
});
```

### Mocking API Client

```typescript
jest.mock('@/api/client', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));
```

### Mocking FormData

React Native's `FormData` is available in Jest with `jest-expo`. For explicit testing:

```typescript
const mockAppend = jest.fn();
const mockFormData = { append: mockAppend } as unknown as FormData;
```
