import * as DocumentPicker from 'expo-document-picker';

export const pickDocument = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/jpeg', 'image/png'],
      copyToCacheDirectory: true,
    });

    if (result.canceled) return null;

    const file = result.assets[0];
    return {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || 'application/octet-stream',
      size: file.size,
    };
  } catch (err) {
    console.error('Document picker error', err);
    return null;
  }
};