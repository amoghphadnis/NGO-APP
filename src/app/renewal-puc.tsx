import React from 'react';
import { useRouter } from 'expo-router';
import RenewalPUCForm from '@/screens/form-sections/renewal/RenewalPUCForm';

export default function RenewalPUCScreen() {
  const router = useRouter();

  return (
    <RenewalPUCForm
      navigation={{
        goBack: () => router.back(),
      }}
    />
  );
}
