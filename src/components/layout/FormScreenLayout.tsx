import AppFooter from '@/components/common/AppFooter';
import StickyActionFooter from '@/components/common/StickyActionFooter';
import AppTopBar from '@/components/layout/AppTopBar';
import ProgressHeader from '@/components/layout/ProgressHeader';
import { getFormConfig } from '@/forms/shared/registry';
import { useFormEngineStore } from '@/store/useFormEngineStore';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Meta screens that are not counted as data-entry "pages".
const NON_PAGE_STEPS = new Set(['review', 'success']);

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
  const { currentFormType, currentStep: storeStep, completedSteps } =
    useFormEngineStore();

  // Inside the form engine, derive the displayed step/total from the active
  // form config so every section shows consistent "Step X of N" numbering.
  // `review` and `success` are meta screens and don't count as pages.
  // The `step`/`totalSteps` props remain as a fallback for non-form-engine
  // callers (none today) — an explicit `step` prop is ignored while a form
  // is active.
  let displayStep = step ?? 1;
  let displayTotal = totalSteps;
  let completedPages: number | undefined;

  if (currentFormType) {
    const config = getFormConfig(currentFormType);
    const pageCount = config.steps.filter((s) => !NON_PAGE_STEPS.has(s)).length;
    displayStep = Math.min(storeStep + 1, pageCount);
    displayTotal = pageCount;
    completedPages = config.steps.reduce(
      (count, stepId, index) =>
        !NON_PAGE_STEPS.has(stepId) && completedSteps[index] ? count + 1 : count,
      0
    );
  }

  // Progress reflects pages actually completed — 0% before the user has
  // finished anything, never more than 100%.
  const progress =
    completedPages !== undefined
      ? Math.min(100, (completedPages / displayTotal) * 100)
      : (displayStep / displayTotal) * 100;
  const actualRemainingSteps =
    remainingSteps ?? Math.max(0, displayTotal - displayStep);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppTopBar hideBell />

      {/* Screen Title - ABOVE content, not inside cards */}
      <Text style={styles.titleHeader}>{title}</Text>

      {/* Progress Header */}
      <ProgressHeader 
        step={displayStep}
        total={displayTotal}
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
        <AppFooter />
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
    </SafeAreaView>
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
