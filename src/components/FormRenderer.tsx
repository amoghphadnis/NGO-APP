import React from 'react';
import { View, Text } from 'react-native';
import { useFormEngineStore } from '../store/useFormEngineStore';
import { getFormConfig } from '../forms/shared/registry';

// Import core form section components that exist
import GuidelinesSection from '../screens/form-sections/professional/GuidelinesSection';
import PersonalSection from '../screens/form-sections/professional/PersonalSection';
import ContactSection from '../screens/form-sections/professional/ContactSection';
import AddressSection from '../screens/form-sections/professional/AddressSection';
import FamilySection from '../screens/form-sections/professional/FamilySection';
import DocumentSection from '../screens/form-sections/professional/DocumentSection';
import ReviewSection from '../screens/form-sections/professional/ReviewSection';
import SuccessSection from '../screens/form-sections/professional/SuccessSection';

// Import professional-specific sections
import CategorySection from '../screens/form-sections/puc/CategorySection';
import AcademicSection from '../screens/form-sections/professional/AcademicSection';
import BankSection from '../screens/form-sections/professional/BankSection';

interface FormRendererProps {
  navigation: any;
  route: {
    params?: {
      formType?: 'professional' | 'puc';
    };
  };
}

const componentMap = {
  GuidelinesSection,
  PersonalSection,
  ContactSection,
  AddressSection,
  FamilySection,
  CategorySection,
  AcademicSection,
  BankSection,
  DocumentSection,
  ReviewSection,
  SuccessSection,
};

export default function FormRenderer({ navigation, route }: FormRendererProps) {
  const { currentStep, initializeForm } = useFormEngineStore();
  const { formType = 'professional' } = route.params || {};

  // Initialize form when component mounts or formType changes
  React.useEffect(() => {
    try {
      initializeForm(formType);
    } catch (error) {
      console.error('Failed to initialize form:', error);
    }
  }, [formType, initializeForm]);

  let config;
  try {
    config = getFormConfig(formType);
  } catch (error) {
    console.error('Failed to get form config:', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
          Form configuration not found. Please try again.
        </Text>
      </View>
    );
  }

  const currentStepId = config.steps[currentStep];

  // Map step IDs to component names (including professional-specific steps)
  const stepComponentMap: Record<string, keyof typeof componentMap> = {
    guidelines: 'GuidelinesSection',
    personal: 'PersonalSection',
    contact: 'ContactSection',
    address: 'AddressSection',
    family: 'FamilySection',
    category: 'CategorySection',
    academic: 'AcademicSection',
    bank: 'BankSection',
    documents: 'DocumentSection',
    review: 'ReviewSection',
    success: 'SuccessSection',
  };

  const componentName = stepComponentMap[currentStepId];
  const ComponentToRender = componentName ? componentMap[componentName] : null;

  if (!ComponentToRender) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Step {currentStepId} - Component coming soon</Text>
      </View>
    );
  }

  // Create navigation object that uses step-based navigation instead of screen navigation
  const { setCurrentStep } = useFormEngineStore();
  
  const sectionNavigation = {
    goBack: () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    },
    navigate: (stepName: string) => {
      const stepIndex = config.steps.indexOf(stepName as any);
      if (stepIndex !== -1) {
        setCurrentStep(stepIndex);
      }
    }
  };

  return <ComponentToRender navigation={sectionNavigation} />;
}
