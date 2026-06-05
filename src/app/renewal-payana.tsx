import React from 'react';
import { useRouter } from 'expo-router';
import RenewalPayanaForm from '@/screens/form-sections/renewal/RenewalPayanaForm';

export default function RenewalPayanaScreen() {
  const router = useRouter();

  return (
    <RenewalPayanaForm
      navigation={{
        goBack: () => router.back(),
      }}
    />
  );
}
