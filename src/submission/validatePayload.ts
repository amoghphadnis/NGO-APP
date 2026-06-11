import { FormType } from '@/forms/shared/types';
import { professionalFormSchema } from '@/validation/professionalSchemas';
import { pucFormSchema } from '@/validation/pucSchemas';
import { semiProfessionalFormSchema } from '@/validation/semiProfessionalSchemas';
import { payanaFormSchema } from '@/validation/payanaSchemas';
import { ProfessionalFormValues, PucFormValues, SemiProfessionalFormValues, PayanaFormValues } from '@/types/forms';

export interface ValidationResult {
  success: boolean;
  errors?: string[];
}

export function validatePayload(
  formType: FormType,
  formData: ProfessionalFormValues | PucFormValues | SemiProfessionalFormValues | PayanaFormValues
): ValidationResult {
  console.log(`[validatePayload] Validating ${formType} form data`);
  
  if (formType === 'professional') {
    const result = professionalFormSchema.safeParse(formData);
    console.log(`[validatePayload] Professional validation:`, result.success ? 'passed' : 'failed');
    if (result.success) {
      return { success: true };
    }

    return {
      success: false,
      errors: result.error.issues.map((issue) => issue.message),
    };
  }

  if (formType === 'semiProfessional') {
    const result = semiProfessionalFormSchema.safeParse(formData);
    console.log(`[validatePayload] SemiProfessional validation:`, result.success ? 'passed' : 'failed');
    if (result.success) {
      return { success: true };
    }

    return {
      success: false,
      errors: result.error.issues.map((issue) => issue.message),
    };
  }

  if (formType === 'payana') {
    const result = payanaFormSchema.safeParse(formData);
    console.log(`[validatePayload] Payana validation:`, result.success ? 'passed' : 'failed');
    if (result.success) {
      return { success: true };
    }

    return {
      success: false,
      errors: result.error.issues.map((issue) => issue.message),
    };
  }

  const result = pucFormSchema.safeParse(formData);
  console.log(`[validatePayload] PUC validation:`, result.success ? 'passed' : 'failed');
  if (result.success) {
    return { success: true };
  }

  return {
    success: false,
    errors: result.error.issues.map((issue) => issue.message),
  };
}
