---
name: vp-ui-design-system
description: UI design system toolkit tailored for Vidya Poshak NGO mobile application. Focuses on form-driven UX, step-based workflows, accessibility, and consistency between Figma and React Native implementation.
---

# Vidya Poshak UI Design System

## Core Principles
- Step-based form UX (multi-step navigation)
- Card-based layout structure
- 8pt spacing system
- Minimal cognitive load per screen
- Inline validation feedback
- Bottom-fixed primary CTA

## Design Tokens
- Primary: Blue (#4F5DFF)
- Error: Red (#EF4444)
- Success: Green (#22C55E)
- Neutral grayscale system
- 8pt spacing grid
- Rounded inputs (10–12px radius)

## Component Standards

### Form Inputs
- Label + Input + Helper/Error
- Error state: red border + message
- Success state: optional

### Buttons
- Primary CTA: filled (blue)
- Secondary: outlined/ghost

### Layout
- Section-based cards
- Consistent padding (16px)
- Vertical rhythm spacing

### Navigation
- Stack-based navigation
- Progress bar always visible
- Step indicator mandatory

## Accessibility
- Minimum touch target: 44px
- Color contrast compliance
- Clear error messaging

## Developer Handoff Rules
- All UI must map to reusable components
- No inline styling
- Use theme tokens only
- State-driven validation
