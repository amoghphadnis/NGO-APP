import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { MAX_TOTAL_UPLOAD_BYTES } from '@/constants/formOptions';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { formatBytes } from '@/utils/uploadSize';

interface UploadSizeNoticeProps {
  totalBytes: number;
}

/**
 * Live indicator of the combined attachment size in a submission.
 * Turns red once the total exceeds what the backend accepts in a single
 * request, so the user knows the submission would be rejected.
 */
export default function UploadSizeNotice({ totalBytes }: UploadSizeNoticeProps) {
  if (!totalBytes || totalBytes <= 0) return null;

  const exceeded = totalBytes > MAX_TOTAL_UPLOAD_BYTES;
  const limitLabel = formatBytes(MAX_TOTAL_UPLOAD_BYTES);

  return (
    <View style={[styles.container, exceeded ? styles.containerError : styles.containerOk]}>
      <Ionicons
        name={exceeded ? 'alert-circle' : 'cloud-upload-outline'}
        size={18}
        color={exceeded ? colors.error : colors.textSecondary}
        style={styles.icon}
      />
      <Text style={[styles.text, exceeded && styles.textError]}>
        {exceeded
          ? `Attachments total ${formatBytes(totalBytes)} — above the ${limitLabel} upload limit. The server will reject this submission. Please remove or compress some files.`
          : `Attachments: ${formatBytes(totalBytes)} of ${limitLabel} limit`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 10,
    borderWidth: 1,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  containerOk: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  containerError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  icon: {
    marginRight: spacing.sm,
    marginTop: 1,
  },
  text: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  textError: {
    color: colors.error,
  },
});
