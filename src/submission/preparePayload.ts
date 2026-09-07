import { payanaMapper } from '@/forms/payana/mapper';
import { professionalMapper } from '@/forms/professional/mapper';
import { pucMapper } from '@/forms/puc/mapper';
import { semiProfessionalMapper } from '@/forms/semiProfessional/mapper';
import { FormType } from '@/forms/shared/types';
import { PayanaFormValues, ProfessionalFormValues, PucFormValues, SemiProfessionalFormValues } from '@/types/forms';
import { PucFormat11FormValues } from '@/validation/pucFormat11Schemas';

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
  } else if (formType === 'semiProfessional') {
    payload = semiProfessionalMapper(formData as SemiProfessionalFormValues);
  } else if (formType === 'payana') {
    payload = payanaMapper(formData as PayanaFormValues);
  } else {
    payload = pucMapper(formData as unknown as PucFormat11FormValues);
  }

  const keys = Array.from((payload as any).keys());
  console.log(`[preparePayload] Output payload contains ${keys.length} fields:`, keys);

  return payload;
}
