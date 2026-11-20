import { DocumentFile } from '@/types/documents';
import * as ImagePicker from 'expo-image-picker';

export { pickDocument } from './filePicker';

const IMAGE_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: 'images',
  allowsEditing: false,
  quality: 1,
};

function mapAssetToDocumentFile(
  asset: ImagePicker.ImagePickerAsset
): DocumentFile {
  const name = asset.fileName || 'image.jpg';
  const type = asset.mimeType || 'image/jpeg';

  return {
    uri: asset.uri,
    name,
    type,
    size: asset.fileSize || 0,
  };
}

export async function takePhoto(): Promise<DocumentFile | null> {
  try {
    const { granted } =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!granted) {
      console.warn('[imagePicker] Camera permission not granted');
      return null;
    }

    const result = await ImagePicker.launchCameraAsync(IMAGE_OPTIONS);

    if (result.canceled || !result.assets?.[0]) return null;

    return mapAssetToDocumentFile(result.assets[0]);
  } catch (error) {
    console.error('[imagePicker] takePhoto error:', error);
    return null;
  }
}

export async function pickFromGallery(): Promise<DocumentFile | null> {
  try {
    // No broad media library permission required.
    // Use the Android system photo picker where supported.
    const result =
      await ImagePicker.launchImageLibraryAsync(IMAGE_OPTIONS);

    if (result.canceled || !result.assets?.[0]) return null;

    return mapAssetToDocumentFile(result.assets[0]);
  } catch (error) {
    console.error('[imagePicker] pickFromGallery error:', error);
    return null;
  }
}