import { AccessibilityProps } from 'react-native';

export const accessibility = {
  // Minimum touch target size (48x48dp per WCAG and platform guidelines)
  minTouchTarget: 48,
  
  // Screen reader announcements
  announce: (message: string) => {
    // Platform-specific screen reader announcements
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  },

  // Generate accessibility labels for form fields
  getFieldLabel: (label: string, required?: boolean, error?: string) => {
    let accessibilityLabel = label;
    if (required) {
      accessibilityLabel += ', required field';
    }
    if (error) {
      accessibilityLabel += `, error: ${error}`;
    }
    return accessibilityLabel;
  },

  // Generate accessibility hints for interactive elements
  getHint: (action: string, fieldType?: string) => {
    const hints: Record<string, string> = {
      'tap': 'Double tap to activate',
      'select': 'Double tap to select option',
      'date': 'Double tap to open date picker',
      'dropdown': 'Double tap to open dropdown',
      'increment': 'Double tap to increase value',
      'decrement': 'Double tap to decrease value',
    };
    
    let hint = hints[action] || 'Double tap to interact';
    if (fieldType) {
      hint += `. ${fieldType}`;
    }
    
    return hint;
  },

  // Accessibility roles for form elements (React Native compatible)
  roles: {
    input: 'text',
    button: 'button',
    link: 'link',
    header: 'header',
    list: 'list',
    listitem: 'listitem',
    switch: 'switch',
    tab: 'tab',
    tablist: 'tablist',
    textbox: 'text',
  } as const,

  // Ensure touch targets meet minimum size
  ensureTouchTarget: (style: any, minSize: number = 48) => ({
    ...style,
    minHeight: Math.max(style?.minHeight || 0, minSize),
    minWidth: Math.max(style?.minWidth || 0, minSize),
  }),

  // Focus management for screen readers
  trapFocus: (containerRef: any) => {
    // Implementation for focus trapping within modals
    const focusableElements = containerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements?.length > 0) {
      (focusableElements[0] as HTMLElement)?.focus();
    }
  },
};

// Common accessibility patterns
export const a11yPatterns = {
  // Form field pattern
  formField: (label: string, required?: boolean, error?: string) => ({
    accessible: true,
    accessibilityLabel: accessibility.getFieldLabel(label, required, error),
    accessibilityRole: 'none', // React Native TextInput doesn't need explicit role
    accessibilityHint: accessibility.getHint('tap', `Enter ${label.toLowerCase()}`),
  }),

  // Button pattern
  button: (label: string, action?: string) => ({
    accessible: true,
    accessibilityLabel: label,
    accessibilityRole: accessibility.roles.button,
    accessibilityHint: accessibility.getHint(action || 'tap'),
  }),

  // Stepper pattern
  stepper: (value: number, label: string) => ({
    accessible: true,
    accessibilityLabel: `${label}, current value ${value}`,
    accessibilityRole: accessibility.roles.textbox,
    accessibilityHint: 'Swipe up or down to change value',
  }),
};
