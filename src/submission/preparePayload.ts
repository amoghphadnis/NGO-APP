import { FormType } from '@/forms/shared/types';
import { ProfessionalFormValues, PucFormValues, PayanaFormValues, SemiProfessionalFormValues } from '@/types/forms';
import { professionalMapper } from '@/forms/professional/mapper';
import { pucMapper } from '@/forms/puc/mapper';
import { mapPayanaFormToApiPayload, PAYANA_FILE_MAPPINGS } from '@/forms/payana/mapper';
import { semiProfessionalMapper } from '@/forms/semiProfessional/mapper';

export type SubmissionPayload = FormData;

export function preparePayload(
  formType: FormType,
  formData: ProfessionalFormValues | PucFormValues | PayanaFormValues | SemiProfessionalFormValues
): SubmissionPayload {
  console.log(`[preparePayload] Preparing payload for ${formType}`);
  console.log(`[preparePayload] Input formData keys:`, Object.keys(formData as any));
  
  let payload: FormData;
  
  if (formType === 'professional') {
    payload = professionalMapper(formData as ProfessionalFormValues);
  } else if (formType === 'payana') {
    payload = preparePayanaPayload(formData as PayanaFormValues);
  } else if (formType === 'semiProfessional') {
    payload = semiProfessionalMapper(formData as SemiProfessionalFormValues);
  } else {
    payload = pucMapper(formData as PucFormValues);
  }
  
  const keys = Array.from((payload as any).keys());
  console.log(`[preparePayload] Output payload contains ${keys.length} fields:`, keys);
  
  return payload;
}

function preparePayanaPayload(formData: PayanaFormValues): FormData {
  const payanaPayload = mapPayanaFormToApiPayload(formData);
  const fd = new FormData();
  
  console.log(`[preparePayanaPayload] Mapped data keys:`, Object.keys(payanaPayload));
  
  // Append text fields
  Object.entries(payanaPayload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      fd.append(key, String(value));
      console.log(`[preparePayanaPayload] Appended field: ${key} = ${value}`);
    }
  });
  
  // Append files using PAYANA_FILE_MAPPINGS
  Object.entries(PAYANA_FILE_MAPPINGS).forEach(([formKey, apiKey]) => {
    const doc = formData.documents?.[formKey as keyof typeof formData.documents];
    if (doc?.file?.uri) {
      fd.append(apiKey, {
        uri: doc.file.uri,
        name: doc.file.name || `${apiKey}.jpg`,
        type: doc.file.type || 'application/octet-stream',
      } as any);
      console.log(`[preparePayanaPayload] Appended file: ${apiKey} (${doc.file.name})`);
    } else {
      console.log(`[preparePayanaPayload] Missing file: ${formKey} (API: ${apiKey})`);
    }
  });
  
  return fd;
}
