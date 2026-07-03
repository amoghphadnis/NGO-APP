import React from 'react';
import { useRouter } from 'expo-router';
import LegalModal from '@/components/common/LegalModal';
import { TERMS_CONTENT } from '@/constants/legalContent';

export default function TermsModal() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <LegalModal
      visible={true}
      onClose={handleClose}
      title="Terms & Conditions"
      content={TERMS_CONTENT}
    />
  );
}
