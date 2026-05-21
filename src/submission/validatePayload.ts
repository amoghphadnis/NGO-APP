import { FormType } from '@/forms/shared/types';
import { professionalFormSchema } from '@/validation/professionalSchemas';
import { pucFormSchema } from '@/validation/pucSchemas';
import { ProfessionalFormValues, PucFormValues } from '@/types/forms';

export interface ValidationResult {
  success: boolean;
  errors?: string[];
}

export function validatePayload(
  formType: FormType,
  formData: ProfessionalFormValues | PucFormValues
): ValidationResult {
  if (formType === 'professional') {
    const result = professionalFormSchema.safeParse(formData);
    if (result.success) {
      return { success: true };
    }

    return {
      success: false,
      errors: result.error.issues.map((issue) => issue.message),
    };
  }

  const result = pucFormSchema.safeParse(formData);
  if (result.success) {
    return { success: true };
  }

  return {
    success: false,
    errors: result.error.issues.map((issue) => issue.message),
  };
}
