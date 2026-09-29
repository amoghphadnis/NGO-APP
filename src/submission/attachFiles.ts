import { isUploadableFile, UploadableFile } from '@/types/api';

/**
 * Converts a base64 string to a Uint8Array byte buffer.
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  try {
    const cleaned = base64.includes(',') ? base64.split(',')[1] : base64;
    const globalBuffer = (globalThis as any).Buffer;
    if (typeof atob === 'function') {
      const binaryString = atob(cleaned);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    } else if (globalBuffer) {
      return new Uint8Array(globalBuffer.from(cleaned, 'base64'));
    }
  } catch (err) {
    console.warn('[base64ToUint8Array] Error decoding base64:', err);
  }
  return new Uint8Array(0);
}

/**
 * Reads binary bytes from a file URI (file://, content://, data:, or http(s)://).
 * Compatible with Expo's modern WinterCG fetch/FormData converter.
 */
export async function readFileBytes(uri: string): Promise<Uint8Array> {
  if (!uri) {
    return new Uint8Array(0);
  }

  // 1. Data URI
  if (uri.startsWith('data:')) {
    return base64ToUint8Array(uri);
  }

  // 2. Try native fetch (handles blob:, http:, and modern file: protocols in some runtimes)
  try {
    const res = await fetch(uri);
    if (res && typeof res.arrayBuffer === 'function') {
      const buffer = await res.arrayBuffer();
      if (buffer && buffer.byteLength > 0) {
        return new Uint8Array(buffer);
      }
    }
  } catch {
    // Continue to legacy FileSystem
  }

  // 3. Try expo-file-system legacy (reads Android content:// and file:// natively)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const FileSystem = require('expo-file-system/legacy');
    if (FileSystem && typeof FileSystem.readAsStringAsync === 'function') {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });
      if (base64) {
        return base64ToUint8Array(base64);
      }
    }
  } catch {
    // Continue to react-native-blob-util
  }

  // 4. Try react-native-blob-util if available
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const RNFetchBlob = require('react-native-blob-util').default || require('react-native-blob-util');
    if (RNFetchBlob?.fs?.readFile) {
      const path = uri.startsWith('file://') ? uri.replace('file://', '') : uri;
      const base64 = await RNFetchBlob.fs.readFile(path, 'base64');
      if (base64) {
        return base64ToUint8Array(base64);
      }
    }
  } catch {
    // Return empty buffer as fallback (e.g. in unit tests with mock URIs)
  }

  return new Uint8Array(0);
}

/**
 * Appends a file to FormData in a format fully compatible with both:
 * 1. Expo SDK 52/57's WinterCG fetch (convertFormDataAsync which expects `bytes(): Promise<Uint8Array>`)
 * 2. Standard React Native multipart / OkHttp networking ({ uri, type, name })
 */
export function appendFileToFormData(
  formData: FormData,
  key: string,
  file?: unknown
): void {
  // Support unwrapping if passed { file: UploadableFile, ... }
  const candidate = (file && typeof file === 'object' && 'file' in file)
    ? (file as any).file
    : file;

  if (!candidate || !isUploadableFile(candidate)) {
    return;
  }

  const uploadable: UploadableFile = candidate;
  const fileName = uploadable.name || `${key}.jpg`;
  const fileType = uploadable.type || 'application/octet-stream';

  formData.append(key, {
    uri: uploadable.uri,
    type: fileType,
    name: fileName,
    bytes: async () => readFileBytes(uploadable.uri),
  } as unknown as Blob);
}

export function attachFiles(
  formData: FormData,
  fileMap: Record<string, unknown> | undefined
): void {
  if (!fileMap) {
    return;
  }

  Object.entries(fileMap).forEach(([key, file]) => {
    appendFileToFormData(formData, key, file);
  });
}
