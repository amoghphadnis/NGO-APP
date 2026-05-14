// Legacy service - DEPRECATED
// This file will be replaced with new API architecture
// DO NOT USE - Use src/api/studentApi.ts instead

export const LEGACY_submitFullForm = async (): Promise<{ success: boolean; message?: string }> => {
  console.warn('DEPRECATED: LEGACY_submitFullForm called. Use new API architecture.');
  return {
    success: false,
    message: 'Legacy API deprecated. Please use new implementation.',
  };
};
