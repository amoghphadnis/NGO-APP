import React from 'react';
import { useRouter } from 'expo-router';
import LegalModal from '@/components/common/LegalModal';
import { PRIVACY_CONTENT } from '@/constants/legalContent';

export default function PrivacyModal() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <LegalModal
      visible={true}
      onClose={handleClose}
      title="Privacy Policy"
      content={PRIVACY_CONTENT}
    />
  );
}
