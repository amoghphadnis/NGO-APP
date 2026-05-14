import { Platform } from 'react-native';

export const platform = {
  // Normalize font sizes to prevent Android from appearing smaller
  normalize: {
    fontSize: {
      h1: Platform.select({
        ios: 24,
        android: 26,
      }),
      h2: Platform.select({
        ios: 20,
        android: 22,
      }),
      h3: Platform.select({
        ios: 18,
        android: 20,
      }),
      body: Platform.select({
        ios: 16,
        android: 17,
      }),
      caption: Platform.select({
        ios: 14,
        android: 15,
      }),
      small: Platform.select({
        ios: 12,
        android: 13,
      }),
    },
    lineHeight: {
      h1: Platform.select({
        ios: 32,
        android: 34,
      }),
      h2: Platform.select({
        ios: 28,
        android: 30,
      }),
      h3: Platform.select({
        ios: 24,
        android: 26,
      }),
      body: Platform.select({
        ios: 22,
        android: 24,
      }),
      caption: Platform.select({
        ios: 18,
        android: 20,
      }),
      small: Platform.select({
        ios: 16,
        android: 17,
      }),
    },
  },
  
  // Input-specific normalization
  input: {
    minHeight: 56,
    paddingVertical: Platform.select({
      ios: 16,
      android: 18,
    }),
    paddingHorizontal: 16,
    fontSize: Platform.select({
      ios: 16,
      android: 17,
    }),
    lineHeight: Platform.select({
      ios: 22,
      android: 24,
    }),
    // Android-specific fixes to prevent compression
    android: {
      textAlignVertical: 'center',
      includeFontPadding: false,
    },
  },
  
  // Touch target normalization
  touchTarget: {
    minSize: 48,
    buttonHeight: 56,
    iconButtonSize: 48,
  },
  
  // Spacing normalization to ensure consistent density
  spacing: {
    screenHorizontal: 20,
    sectionSpacing: 24,
    fieldSpacing: 20,
    labelSpacing: 8,
    cardPadding: 20,
    footerPadding: 16,
    // Android-specific adjustments to prevent compression
    android: {
      verticalPadding: Platform.select({
        ios: undefined,
        android: 2, // Extra padding on Android to match iOS density
      }),
    },
  },
  
  // Platform-specific shadow and elevation
  elevation: {
    card: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
    button: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
};
