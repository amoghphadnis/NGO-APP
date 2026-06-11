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
  
  // Log FormData keys for debugging
  if (payload instanceof FormData) {
    const keys = Array.from((payload as any).keys());
    console.log(`[submitApplication] Payload contains ${keys.length} fields:`, keys);
  }
  
  try {
    let response;
    
    if (formType === 'professional') {
      console.log('[submitApplication] Routing to createProfessionalStudent');
      response = await createProfessionalStudent(payload);
    } else if (formType === 'payana') {
      console.log('[submitApplication] Routing to createPayanaStudent');
      response = await createPayanaStudent(payload);
    } else if (formType === 'semiProfessional') {
      console.log('[submitApplication] Routing to createSemiProfessionalStudent');
      response = await createSemiProfessionalStudent(payload);
    } else if (formType === 'puc') {
      console.log('[submitApplication] Routing to createPUCStudent');
      response = await createPUCStudent(payload);
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
