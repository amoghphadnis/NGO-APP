import React from 'react';
import { Text, View } from 'react-native';
import { getFormConfig } from '../forms/shared/registry';
import { useFormEngineStore } from '../store/useFormEngineStore';

// Import shared/professional form section components
import ProfAcademicSection from '../screens/form-sections/professional/AcademicSection';
import ProfDocumentSection from '../screens/form-sections/professional/DocumentSection';
import ProfFamilySection from '../screens/form-sections/professional/FamilySection';
import GuidelinesSection from '../screens/form-sections/professional/GuidelinesSection';
import ProfPersonalSection from '../screens/form-sections/professional/PersonalSection';
import ReviewSection from '../screens/form-sections/professional/ReviewSection';
import SuccessSection from '../screens/form-sections/professional/SuccessSection';

// Import PUC-specific form section components
import PucAcademicSection from '../screens/form-sections/puc/AcademicSection';
import PucAddressSection from '../screens/form-sections/puc/AddressSection';
import PucCategorySection from '../screens/form-sections/puc/CategorySection';
import PucContactSection from '../screens/form-sections/puc/ContactSection';
import PucDocumentSection from '../screens/form-sections/puc/DocumentSection';
import PucFamilySection from '../screens/form-sections/puc/FamilySection';
import PucPersonalSection from '../screens/form-sections/puc/PersonalSection';

// Import Semi Professional-specific form section components
import SemiProfAcademicSection from '../screens/form-sections/semiProfessional/AcademicSection';
import SemiProfDocumentSection from '../screens/form-sections/semiProfessional/DocumentSection';
import SemiProfFamilySection from '../screens/form-sections/semiProfessional/FamilySection';
import SemiProfGuidelinesSection from '../screens/form-sections/semiProfessional/GuidelinesSection';
import SemiProfPersonalSection from '../screens/form-sections/semiProfessional/PersonalSection';
import SemiProfReviewSection from '../screens/form-sections/semiProfessional/ReviewSection';
import SemiProfSuccessSection from '../screens/form-sections/semiProfessional/SuccessSection';

// Import Payana-specific form section components
import PayanaAcademicSection from '../screens/form-sections/payana/AcademicSection';
import PayanaAddressSection from '../screens/form-sections/payana/AddressSection';
import PayanaBankSection from '../screens/form-sections/payana/BankSection';
import PayanaCategorySection from '../screens/form-sections/payana/CategorySection';
import PayanaContactSection from '../screens/form-sections/payana/ContactSection';
import PayanaDocumentSection from '../screens/form-sections/payana/DocumentSection';
import PayanaFamilySection from '../screens/form-sections/payana/FamilySection';
import PayanaGuidelinesSection from '../screens/form-sections/payana/GuidelinesSection';
import PayanaPersonalSection from '../screens/form-sections/payana/PersonalSection';

interface FormRendererProps {
  navigation: any;
  route: {
    params?: {
      formType?: 'professional' | 'puc' | 'payana' | 'semiProfessional';
    };
  };
}

// Component maps per form type
const professionalComponentMap: Record<string, React.ComponentType<any>> = {
  guidelines: GuidelinesSection,
  personal: ProfPersonalSection,
  family: ProfFamilySection,
  academic: ProfAcademicSection,
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

const semiProfessionalComponentMap: Record<string, React.ComponentType<any>> = {
  guidelines: SemiProfGuidelinesSection,
  personal: SemiProfPersonalSection,
  family: SemiProfFamilySection,
  academic: SemiProfAcademicSection,
  documents: SemiProfDocumentSection,
  review: SemiProfReviewSection,
  success: SemiProfSuccessSection,
};

const payanaComponentMap: Record<string, React.ComponentType<any>> = {
  guidelines: PayanaGuidelinesSection,
  personal: PayanaPersonalSection,
  contact: PayanaContactSection,
  address: PayanaAddressSection,
  family: PayanaFamilySection,
  category: PayanaCategorySection,
  academic: PayanaAcademicSection,
  bank: PayanaBankSection,
  documents: PayanaDocumentSection,
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
  const getActiveComponentMap = () => {
    if (formType === 'puc') return pucComponentMap;
    if (formType === 'payana') return payanaComponentMap;
    if (formType === 'semiProfessional') return semiProfessionalComponentMap;
    return professionalComponentMap;
  };
  
  const activeComponentMap = getActiveComponentMap();
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
