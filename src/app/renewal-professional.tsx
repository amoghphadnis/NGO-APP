import React from 'react';
import { useRouter } from 'expo-router';
import RenewalProfessionalForm from '@/screens/form-sections/renewal/RenewalProfessionalForm';

export default function RenewalProfessionalScreen() {
  const router = useRouter();

  return (
    <RenewalProfessionalForm
      navigation={{
        goBack: () => router.back(),
      }}
    />
  );
}
