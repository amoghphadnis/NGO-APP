---
name: vp-error-handling
description: Error handling standards for VPApp. Defines error classification, user-facing messages, and API error mapping.
---

# VPApp Error Handling

## Purpose

Standardize error UX across modules. Prevent backend error leakage to users while ensuring proper debugging information.

---

## Error Classification

| Error Type | UX Treatment | When It Occurs |
|------------|--------------|----------------|
| **Validation Error** | Inline field message | Form field fails Zod validation |
| **API 4xx Error** | Toast / Alert | Client error (bad request, unauthorized) |
| **API 5xx Error** | Toast + Log | Server error (exception, timeout) |
| **Session Error** | Redirect | Token expired, unauthorized access |
| **Unexpected Error** | Error Boundary | Runtime exception, unhandled promise |

---

## Error Treatment Standards

### Validation Errors

**UX:** Display inline under the field

```typescript
// React Hook Form + Zod handles this automatically
<Controller
  name="email"
  control={control}
  render={({ field, fieldState }) => (
    <Input 
      value={field.value}
      onChangeText={field.onChange}
      error={fieldState.error?.message}  // ← Inline display
    />
  )}
/>
```

**Rules:**
- Error message appears below the field
- Field border turns red
- Error clears on valid input
- No toast for validation errors

### API 4xx Errors

**UX:** Toast notification or Alert dialog

**Examples:**
- `400 Bad Request` - Invalid payload
- `401 Unauthorized` - Token expired
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Duplicate application

```typescript
// Error mapping
const errorMap: Record<string, string> = {
  'STUDENT_ALREADY_EXISTS': 'An application already exists for this student.',
  'INVALID_CASTE_CERTIFICATE': 'Please upload a valid caste certificate.',
  'INVALID_FILE_FORMAT': 'Please upload a PDF or image file.',
  'FILE_TOO_LARGE': 'File size should be less than 5MB.',
  'NETWORK_ERROR': 'Unable to connect. Please check your internet.',
};

// Usage
try {
  await submitForm(payload);
} catch (error) {
  if (error instanceof ApiError) {
    const userMessage = errorMap[error.code] || 'Something went wrong. Please try again.';
    showToast(userMessage);  // ← User sees this
    logError({ context: 'formSubmission', error, payload });  // ← Log sees this
  }
}
```

**Rules:**
- Never show raw backend error messages
- Map known error codes to friendly messages
- Unknown errors → generic message + detailed log

### API 5xx Errors

**UX:** Generic toast + detailed logging

**Examples:**
- `500 Internal Server Error`
- `502 Bad Gateway`
- `503 Service Unavailable`
- `504 Gateway Timeout`

```typescript
// 5xx errors
try {
  await submitForm(payload);
} catch (error) {
  if (error instanceof ApiError && error.response?.status >= 500) {
    showToast('Server error. Please try again later.');  // ← Generic message
    logError({ 
      context: 'formSubmission', 
      severity: 'error',
      error: error.message,
      stack: error.stack,
      payload,
      timestamp: new Date().toISOString(),
    });  // ← Detailed log for debugging
  }
}
```

**Rules:**
- User sees only generic message
- Full error details logged for debugging
- Include timestamp, context, payload
- Don't expose server internals

### Session Errors

**UX:** Immediate redirect to login

```typescript
// Token expiration handling
if (error.response?.status === 401) {
  clearAuthToken();
  navigate('/login', { 
    state: { message: 'Your session has expired. Please log in again.' }
  });
}
```

**Rules:**
- Redirect immediately, no retry
- Show clear message on login screen
- Clear all cached tokens

### Unexpected Errors

**UX:** Error Boundary fallback UI

```typescript
// ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    logError({
      context: 'errorBoundary',
      error: error.message,
      stack: errorInfo.componentStack,
    });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            Please restart the app. If the problem persists, contact support.
          </Text>
          <Button title="Restart" onPress={() => RNRestart.restart()} />
        </View>
      );
    }
    
    return this.props.children;
  }
}
```

**Rules:**
- Graceful fallback UI
- Log full error details
- Provide restart option
- Don't crash to white screen

---

## Error Mapping Standards

### Mapping Priority

1. **Specific error codes first** - `STUDENT_ALREADY_EXISTS`
2. **HTTP status fallback** - `400`, `401`, `500`
3. **Generic fallback** - `Something went wrong`

### Code Organization

```
src/
├── errors/
│   ├── errorMap.ts           # Error code → message mappings
│   ├── ApiError.ts           # Custom error class
│   └── errorLogger.ts        # Error logging utility
└── components/
    └── ErrorBoundary.tsx     # React error boundary
```

### Error Map Structure

```typescript
// src/errors/errorMap.ts
export const errorMap: Record<string, string> = {
  // Registration errors
  'STUDENT_ALREADY_EXISTS': 'An application already exists for this student.',
  'INVALID_EMAIL': 'Please enter a valid email address.',
  'INVALID_PHONE': 'Please enter a valid 10-digit phone number.',
  
  // File upload errors
  'INVALID_FILE_FORMAT': 'Please upload a PDF or image file.',
  'FILE_TOO_LARGE': 'File size should be less than 5MB.',
  'UPLOAD_FAILED': 'File upload failed. Please try again.',
  
  // Validation errors
  'MISSING_REQUIRED_FIELD': 'Please fill in all required fields.',
  'INVALID_DATE_FORMAT': 'Please enter a valid date.',
  
  // Network errors
  'NETWORK_ERROR': 'Unable to connect. Please check your internet.',
  'TIMEOUT_ERROR': 'Request timed out. Please try again.',
  
  // Auth errors
  'UNAUTHORIZED': 'Please log in to continue.',
  'FORBIDDEN': 'You do not have permission to perform this action.',
  
  // Generic fallback
  'UNKNOWN_ERROR': 'Something went wrong. Please try again.',
};
```

---

## Error Logging Standards

### What to Log

| Property | Include | Reason |
|----------|---------|--------|
| `context` | Yes | Where error occurred |
| `error.message` | Yes | Error description |
| `error.stack` | Yes | Stack trace for debugging |
| `error.code` | Yes | Backend error code |
| `payload` | Sometimes | Request data (exclude PII) |
| `timestamp` | Yes | When error occurred |
| `userId` | Yes | Who encountered error |
| `severity` | Yes | error / warn / info |

### What NOT to Log

- Passwords
- Aadhaar numbers
- Bank account details
- Raw file contents
- Session tokens

### Log Levels

```typescript
enum LogLevel {
  ERROR = 'error',    // 5xx errors, exceptions, crashes
  WARN = 'warn',      // 4xx errors, validation failures
  INFO = 'info',      // Expected errors (session expiry)
}
```

---

## Non-Goals (Out of Scope)

This skill does **NOT** define:

- **Validation Rules** → See validation schemas in `src/validation/`
- **API Integration** → See `vp-api-contracts.md`
- **Form Engine Logic** → See `vp-form-engine.md`
- **State Management** → See `vp-platform-architecture.md`
- **UI Component Design** → See `vp-ui-system.md`

---

## Success Criteria

**Code follows Error Handling standards when:**

- No raw backend errors displayed to users
- All API errors mapped to friendly messages
- Validation errors appear inline, never as toast
- 5xx errors show generic message with detailed logs
- Session errors redirect immediately to login
- Error boundaries catch unexpected errors gracefully
- Error logs include context but exclude PII

---

## Minimum Viable Rules

For initial implementation, focus on:

1. **Never show raw backend error messages**
2. **Map known error codes** to user-friendly messages
3. **Validation errors inline** (not toast)
4. **5xx errors generic** (with detailed logging)
5. **Session expiry immediate redirect**

Expand to full classification as dashboard and approval modules stabilize.
