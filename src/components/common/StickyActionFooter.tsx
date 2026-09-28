import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/common/Button';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';

interface StickyActionFooterProps {
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  showBack?: boolean;
  showNext?: boolean;
  loading?: boolean;
}

export default function StickyActionFooter({
  onBack,
  onNext,
  backLabel = 'Back',
  nextLabel = 'Next',
  nextDisabled = false,
  backDisabled = false,
  showBack = true,
  showNext = true,
  loading = false,
}: StickyActionFooterProps) {
  return (
    <SafeAreaView 
      style={styles.safeArea}
      edges={['bottom']}
    >
      <View style={styles.container}>
        {showBack && (
          <Button
            title={backLabel}
            onPress={onBack || (() => {})}
            disabled={backDisabled}
            style={styles.backButton}
          />
        )}
        
        {showNext && (
          <Button
            title={nextLabel}
            onPress={onNext || (() => {})}
            disabled={nextDisabled}
            loading={loading}
            style={styles.nextButton}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: platform.spacing.footerPadding,
    paddingVertical: platform.spacing.footerPadding,
    gap: 12,
    minHeight: platform.touchTarget.buttonHeight + (platform.spacing.footerPadding * 2),
  },
  backButton: {
    flex: 1,
    minHeight: platform.touchTarget.buttonHeight,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  nextButton: {
    flex: 1,
    minHeight: platform.touchTarget.buttonHeight,
    backgroundColor: colors.primary,
    ...Platform.select({
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
});
