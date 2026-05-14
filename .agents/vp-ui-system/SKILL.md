---
name: vp-ui-system
description: Enforces UI/UX consistency for Vidya Poshak NGO React Native app using Material 3 principles, Figma-aligned layouts, and production-ready component structure.
---

# Vidya Poshak UI System Skill

## Purpose
Ensure every screen follows the approved Vidya Poshak Figma design system and maintains consistent spacing, typography, colors, and layout hierarchy across the React Native app.

## Global Layout Rules
- Use `SafeAreaView` from `react-native-safe-area-context` for all screens.
- Use `ScrollView` for all form screens.
- Keep app width between 360–390px in design assumptions.
- Use a sticky footer for primary actions.
- Avoid full-screen fixed layouts.
- Always include: `ProgressHeader`, `ContentContainer`, `SectionCard`, `SectionHeader`, `SectionContent`, `StickyFooter`.

## Spacing System (8pt Grid)
- Use only the centralized spacing tokens.
- Values:
  - `xs = 4`
  - `sm = 8`
  - `md = 16`
  - `lg = 24`
  - `xl = 32`
- Card padding must be `16`.
- Section spacing should be `16–24`.
- Input spacing should be `12–16`.
- No random margins or padding values.

## Visual Design Rules
- Primary palette uses Indigo / Blue tones.
- Background: `#F8FAFC`.
- Card background: `#FFFFFF`.
- Border radius:
  - Cards: `12`
  - Inputs: `10–12`
- Elevation for cards should be subtle (level 1–2).

## Typography Rules
- Title: `20–24` with `SemiBold`.
- Section Title: `16–18` with `Medium`.
- Body text: `14–16` with `Regular`.
- Helper / Error text: `12–13`.
- Color hierarchy:
  - Primary text: `#111827`
  - Secondary text: `#6B7280`
  - Error: `#DC2626`

## Component Structure Rules
Every screen should follow this structure:
1. `SafeAreaView`
2. `ScrollView`
3. `ProgressHeader`
4. `ContentContainer`
5. `SectionCard`
6. `SectionHeader`
7. `SectionContent`
8. `StickyFooter`

## Card Component Rules
- Wrap each section in a card.
- Each card should include:
  - Icon on the left
  - Title
  - Content block
- Use bullets with icons, not dense text blocks.

## Checklist / Bullet Rules
- Use icons for bullets.
- Use vertical spacing of `8–12`.
- Left-align text.
- Avoid dense paragraphs.

## Checkbox Rules
- Checkbox must be clearly visible and left-aligned.
- Label text must wrap correctly.
- Label taps should toggle the checkbox.
- Checkbox state must control CTA enablement.

## Button Rules
Primary button should be:
- Full width
- Height `48–52`
- Border radius `12`
- Gradient or primary color background
- Disabled state should use light grey
- Enabled state should use primary color

## Sticky Footer Rules
- Fixed at the bottom of the screen.
- Padding: `16`.
- Background: white.
- Slight elevation.

## Progress Header Rules
- Must show `Step X of 8`.
- Must include a progress bar.
- Must be consistent across screens.
- Controlled through global state (Zustand).

## Interaction Rules
- Continue button disabled until required checkbox checked.
- State updates should be smooth.
- Avoid sudden layout shifts.

## Strict Constraints
Do not:
- Use inconsistent spacing.
- Hardcode random margins.
- Mix styles across screens.
- Skip `SectionCard` wrappers.
- Use inline styling everywhere.

## Expected Output
Generate screens with:
- Clean component hierarchy.
- Reusable layout structure.
- Consistent spacing.
- Theme-driven styling.
- Minimal inline styles.

## Implementation Hints
- Use `StyleSheet.create`.
- Use centralized `spacing.ts`, `colors.ts`, and `typography.ts`.
- Prefer reusable components over duplicated screen code.
