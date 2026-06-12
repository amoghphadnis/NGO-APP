import { FormType } from '@/forms/shared/types';
import { ProfessionalFormValues, PucFormValues, PayanaFormValues, SemiProfessionalFormValues } from '@/types/forms';
import { professionalMapper } from '@/forms/professional/mapper';
import { pucMapper } from '@/forms/puc/mapper';
import { mapPayanaFormToApiPayload, PAYANA_FILE_MAPPINGS } from '@/forms/payana/mapper';
import { semiProfessionalMapper } from '@/forms/semiProfessional/mapper';

export type SubmissionPayload = FormData | Record<string, any>;

export function preparePayload(
  formType: FormType,
  formData: ProfessionalFormValues | PucFormValues | PayanaFormValues | SemiProfessionalFormValues
): SubmissionPayload {
  console.log(`[preparePayload] Preparing payload for ${formType}`);
  console.log(`[preparePayload] Input formData keys:`, Object.keys(formData as any));

  // Payana expects JSON, not FormData
  if (formType === 'payana') {
    const payload = preparePayanaPayload(formData as PayanaFormValues);
    console.log(`[preparePayload] Output payload contains ${Object.keys(payload).length} fields:`, Object.keys(payload));
    return payload;
  }

  let payload: FormData;

  if (formType === 'professional') {
    payload = professionalMapper(formData as ProfessionalFormValues);
  } else if (formType === 'semiProfessional') {
    payload = semiProfessionalMapper(formData as SemiProfessionalFormValues);
  } else {
    payload = pucMapper(formData as PucFormValues);
  }

  const keys = Array.from((payload as any).keys());
  console.log(`[preparePayload] Output payload contains ${keys.length} fields:`, keys);

  return payload;
}

function preparePayanaPayload(formData: PayanaFormValues): Record<string, any> {
  const payanaPayload = mapPayanaFormToApiPayload(formData);

  console.log(`[preparePayanaPayload] Mapped data keys:`, Object.keys(payanaPayload));

  // Build JSON payload - files will be sent as URI strings
  // (Backend needs to handle file upload separately or accept base64)
  const payload: Record<string, any> = { ...payanaPayload };

  // Add file URIs using PAYANA_FILE_MAPPINGS
  Object.entries(PAYANA_FILE_MAPPINGS).forEach(([formKey, apiKey]) => {
    const doc = formData.documents?.[formKey as keyof typeof formData.documents];
    if (doc?.file?.uri) {
      // Send file URI - backend may need to handle this differently
      payload[apiKey] = doc.file.uri;
      console.log(`[preparePayanaPayload] Added file URI: ${apiKey} = ${doc.file.uri}`);
    } else {
      payload[apiKey] = '';
      console.log(`[preparePayanaPayload] No file for: ${formKey} (API: ${apiKey})`);
    }
  });

  console.log(`[preparePayanaPayload] Final payload keys:`, Object.keys(payload));

  return payload;
}
