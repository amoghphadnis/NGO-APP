import { PRIVACY_CONTENT, TERMS_CONTENT } from '@/constants/legalContent';

export type LegalDocumentType = 'privacy' | 'terms';

export interface LegalDocumentConfig {
  title: string;
  sections: typeof PRIVACY_CONTENT | typeof TERMS_CONTENT;
  pdfSource?: number;
}

export const LEGAL_DOCUMENTS: Record<LegalDocumentType, LegalDocumentConfig> = {
  privacy: {
    title: 'Privacy Policy',
    sections: PRIVACY_CONTENT,
  },
  terms: {
    title: 'Terms & Conditions',
    sections: TERMS_CONTENT,
  },
};
