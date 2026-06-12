import { FormType } from '@/forms/shared/types';
import { createProfessionalStudent } from '@/api/professionalApi';
import { createPUCStudent } from '@/api/pucApi';
import { createSemiProfessionalStudent } from '@/api/semiProfessionalApi';
import { createPayanaStudent } from '@/api/payanaApi';
import { SubmissionPayload } from './preparePayload';
import { NormalizedApiResponse } from '@/api/transformers/normalizeApiResponse';

export async function submitApplication(
  formType: FormType,
  payload: SubmissionPayload
): Promise<NormalizedApiResponse<any>> {
  console.log(`[submitApplication] Starting submission for formType: ${formType}`);

  // Log payload for debugging
  if (payload instanceof FormData) {
    const keys = Array.from((payload as any).keys());
    console.log(`[submitApplication] FormData payload contains ${keys.length} fields:`, keys);
  } else {
    console.log(`[submitApplication] JSON payload contains ${Object.keys(payload).length} fields:`, Object.keys(payload));
  }

  try {
    let response;

    if (formType === 'professional') {
      console.log('[submitApplication] Routing to createProfessionalStudent');
      response = await createProfessionalStudent(payload as FormData);
    } else if (formType === 'payana') {
      console.log('[submitApplication] Routing to createPayanaStudent');
      response = await createPayanaStudent(payload as Record<string, any>);
    } else if (formType === 'semiProfessional') {
      console.log('[submitApplication] Routing to createSemiProfessionalStudent');
      response = await createSemiProfessionalStudent(payload as FormData);
    } else if (formType === 'puc') {
      console.log('[submitApplication] Routing to createPUCStudent');
      response = await createPUCStudent(payload as FormData);
    } else {
      console.error(`[submitApplication] ERROR: Unsupported form type "${formType}"`);
      return {
        success: false,
        error: `Unsupported form type: ${formType}`,
        message: `Form type "${formType}" is not supported for submission`,
      };
    }

    console.log(`[submitApplication] Response:`, response);
    return response;
  } catch (error: any) {
    console.error(`[submitApplication] Submission failed:`, error);
    return {
      success: false,
      error: error?.message || 'Submission failed',
      message: error?.message || 'An error occurred during submission',
    };
  }
}
