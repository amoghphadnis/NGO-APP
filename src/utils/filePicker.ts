import * as DocumentPicker from 'expo-document-picker';

export const pickDocument = async (types?: string | string[]) => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: false,
      copyToCacheDirectory: true,
      type: types || '*/*',
    });

    console.log('[filePicker] DocumentPicker result:', result);

    if (result.canceled) {
      console.log('[filePicker] User canceled document picker');
      return null;
    }

    const asset = result.assets?.[0];
    if (!asset) {
      console.error('[filePicker] No asset found in result');
      return null;
    }

    console.log('[filePicker] Picked asset:', {
      uri: asset.uri,
      name: asset.name,
      mimeType: asset.mimeType,
      size: asset.size,
    });

    return {
      uri: asset.uri,
      name: asset.name || 'unknown',
      type: asset.mimeType || 'application/octet-stream',
      size: asset.size || 0,
    };
  } catch (err) {
    console.error('[filePicker] Document picker error:', err);
    return null;
  }
};