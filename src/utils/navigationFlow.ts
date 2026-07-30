/**
 * Deterministic Navigation Flow
 * Enforces strict step-by-step progression through the form
 */

import { FormStep } from '@/constants/formOptions';
import { FormType } from '@/forms/shared/types';

// Define the exact step order for each form type
export const PROFESSIONAL_STEPS: FormStep[] = [
  'guidelines',
  'personal',
  'family',
  'academic',
  'documents',
  'review',
  'success',
] as const;

export const PUC_STEPS: FormStep[] = [
  'guidelines',
  'personal',
  'contact',
  'address',
  'family',
  'category',
  'academic',
  'documents',
  'review',
  'success',
] as const;

export const PAYANA_STEPS: FormStep[] = [
  'guidelines',
  'personal',
  'contact',
  'address',
  'family',
  'category',
  'academic',
  'bank',
  'documents',
  'review',
  'success',
] as const;

export const SEMI_PROFESSIONAL_STEPS: FormStep[] = [
  'guidelines',
  'personal',
  'family',
  'academic',
  'documents',
  'review',
  'success',
] as const;

/**
 * Get the step order for a given form type
 */
export function getStepOrder(formType: FormType): readonly FormStep[] {
  if (formType === 'professional') return PROFESSIONAL_STEPS;
  if (formType === 'payana') return PAYANA_STEPS;
  if (formType === 'semiProfessional') return SEMI_PROFESSIONAL_STEPS;
  return PUC_STEPS;
}

/**
 * Get the next step in the sequence
 */
export function getNextStep(formType: FormType, currentStep: FormStep): FormStep | null {
  const steps = getStepOrder(formType);
  const currentIndex = steps.indexOf(currentStep);
  
  if (currentIndex === -1 || currentIndex === steps.length - 1) {
    return null;
  }
  
  return steps[currentIndex + 1];
}

/**
 * Get the previous step in the sequence
 */
export function getPreviousStep(formType: FormType, currentStep: FormStep): FormStep | null {
  const steps = getStepOrder(formType);
  const currentIndex = steps.indexOf(currentStep);
  
  if (currentIndex <= 0) {
    return null;
  }
  
  return steps[currentIndex - 1];
}

/**
 * Check if navigation to a specific step is allowed
 * Navigation is only allowed if all previous steps are completed
 */
export function isStepAllowed(
  formType: FormType,
  targetStep: FormStep,
  completedSteps: Record<number, boolean>
): boolean {
  const steps = getStepOrder(formType);
  const targetIndex = steps.indexOf(targetStep);
  
  if (targetIndex === -1) {
    return false;
  }
  
  // Allow going back to any previous step
  const currentStepIndex = Object.keys(completedSteps).length;
  if (targetIndex < currentStepIndex) {
    return true;
  }
  
  // Allow going to the next step if current step is completed
  if (targetIndex === currentStepIndex) {
    return completedSteps[currentStepIndex - 1] === true;
  }
  
  // Don't allow skipping steps
  return false;
}

/**
 * Get step index from step name
 */
export function getStepIndex(formType: FormType, step: FormStep): number {
  const steps = getStepOrder(formType);
  return steps.indexOf(step);
}

/**
 * Get step name from index
 */
export function getStepFromIndex(formType: FormType, index: number): FormStep | null {
  const steps = getStepOrder(formType);
  if (index < 0 || index >= steps.length) {
    return null;
  }
  return steps[index];
}

/**
 * Navigation helper for React Navigation
 * Provides type-safe navigation between form steps
 */
export interface FormNavigationProps {
  formType: FormType;
  currentStep: FormStep;
  completedSteps: Record<number, boolean>;
  navigate: (step: FormStep) => void;
  goBack: () => void;
}

export function navigateToNextStep(props: FormNavigationProps): boolean {
  const nextStep = getNextStep(props.formType, props.currentStep);
  
  if (!nextStep) {
    return false;
  }
  
  if (isStepAllowed(props.formType, nextStep, props.completedSteps)) {
    props.navigate(nextStep);
    return true;
  }
  
  return false;
}

export function navigateToPreviousStep(props: FormNavigationProps): boolean {
  const previousStep = getPreviousStep(props.formType, props.currentStep);
  
  if (!previousStep) {
    return false;
  }
  
  props.navigate(previousStep);
  return true;
}

export function navigateToStep(props: FormNavigationProps, targetStep: FormStep): boolean {
  if (isStepAllowed(props.formType, targetStep, props.completedSteps)) {
    props.navigate(targetStep);
    return true;
  }
  
  return false;
}
