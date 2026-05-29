import React from 'react';
import { View, Text } from 'react-native';
import { useFormEngineStore } from '../store/useFormEngineStore';
import { getFormConfig } from '../forms/shared/registry';

// Import shared/professional form section components
import GuidelinesSection from '../screens/form-sections/professional/GuidelinesSection';
import ProfPersonalSection from '../screens/form-sections/professional/PersonalSection';
import ProfContactSection from '../screens/form-sections/professional/ContactSection';
import ProfAddressSection from '../screens/form-sections/professional/AddressSection';
import ProfFamilySection from '../screens/form-sections/professional/FamilySection';
import ProfDocumentSection from '../screens/form-sections/professional/DocumentSection';
import ProfAcademicSection from '../screens/form-sections/professional/AcademicSection';
import BankSection from '../screens/form-sections/professional/BankSection';
import ReviewSection from '../screens/form-sections/professional/ReviewSection';
import SuccessSection from '../screens/form-sections/professional/SuccessSection';

// Import PUC-specific form section components
import PucPersonalSection from '../screens/form-sections/puc/PersonalSection';
import PucContactSection from '../screens/form-sections/puc/ContactSection';
import PucAddressSection from '../screens/form-sections/puc/AddressSection';
import PucFamilySection from '../screens/form-sections/puc/FamilySection';
import PucCategorySection from '../screens/form-sections/puc/CategorySection';
import PucAcademicSection from '../screens/form-sections/puc/AcademicSection';
import PucDocumentSection from '../screens/form-sections/puc/DocumentSection';

interface FormRendererProps {
  navigation: any;
  route: {
    params?: {
      formType?: 'professional' | 'puc';
    };
  };
}

// Component maps per form type
const professionalComponentMap: Record<string, React.ComponentType<any>> = {
  guidelines: GuidelinesSection,
  personal: ProfPersonalSection,
  contact: ProfContactSection,
  address: ProfAddressSection,
  family: ProfFamilySection,
  academic: ProfAcademicSection,
  bank: BankSection,
  documents: ProfDocumentSection,
  review: ReviewSection,
  success: SuccessSection,
};

const pucComponentMap: Record<string, React.ComponentType<any>> = {
  guidelines: GuidelinesSection,
  personal: PucPersonalSection,
  contact: PucContactSection,
  address: PucAddressSection,
  family: PucFamilySection,
  category: PucCategorySection,
  academic: PucAcademicSection,
  documents: PucDocumentSection,
  review: ReviewSection,
  success: SuccessSection,
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

  // Select the correct component map based on form type
  const activeComponentMap = formType === 'puc' ? pucComponentMap : professionalComponentMap;
  const ComponentToRender = activeComponentMap[currentStepId] || null;

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
