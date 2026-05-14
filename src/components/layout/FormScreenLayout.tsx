import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import ProgressHeader from '@/components/layout/ProgressHeader';
import StickyActionFooter from '@/components/common/StickyActionFooter';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';

interface FormScreenLayoutProps {
  children: React.ReactNode;
  title: string;
  step?: number;
  totalSteps?: number;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  showBack?: boolean;
  showNext?: boolean;
  loading?: boolean;
  remainingSteps?: number;
}

export default function FormScreenLayout({
  children,
  title,
  step,
  totalSteps = 8,
  onBack,
  onNext,
  nextLabel = 'Next',
  backLabel = 'Back',
  nextDisabled = false,
  backDisabled = false,
  showBack = true,
  showNext = true,
  loading = false,
  remainingSteps,
}: FormScreenLayoutProps) {
  const currentStep = step || 1;
  const progress = (currentStep / totalSteps) * 100;
  const actualRemainingSteps = remainingSteps || (totalSteps - currentStep);

  return (
    <View style={styles.container}>
      {/* Screen Title - ABOVE content, not inside cards */}
      <Text style={styles.titleHeader}>{title}</Text>

      {/* Progress Header */}
      <ProgressHeader 
        step={currentStep}
        total={totalSteps}
      />

      {/* Step Meta Information */}
      <View style={styles.stepMeta}>
        <Text style={styles.stepMetaText}>
          {progress.toFixed(1)}% Complete · {actualRemainingSteps} steps remaining
        </Text>
      </View>

      {/* Scrollable Content Area */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>

      {/* Sticky Footer - Fixed at bottom */}
      <StickyActionFooter
        onBack={onBack}
        onNext={onNext}
        backLabel={backLabel}
        nextLabel={nextLabel}
        nextDisabled={nextDisabled}
        backDisabled={backDisabled}
        showBack={showBack}
        showNext={showNext}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: platform.spacing.screenHorizontal,
    flex: 1,
    backgroundColor: colors.background,
  },
  titleHeader: {
    fontSize: platform.normalize.fontSize.h1,
    lineHeight: platform.normalize.lineHeight.h1,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: platform.spacing.screenHorizontal,
    paddingTop: platform.spacing.screenHorizontal,
    paddingBottom: platform.spacing.labelSpacing,
  },
  stepMeta: {
    paddingHorizontal: platform.spacing.screenHorizontal,
    paddingBottom: platform.spacing.sectionSpacing,
  },
  stepMetaText: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: platform.spacing.screenHorizontal,
    paddingBottom: 140, // Critical: Ensure footer never overlaps content
    flexGrow: 1,
  },
});
