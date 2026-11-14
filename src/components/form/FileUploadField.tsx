import { DocumentFile, DocumentsMetaItem } from '@/store/useFormEngineStore';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FileUploadFieldProps {
  title: string;
  subtitle: string;
  badge?: string;
  file?: DocumentFile;
  meta?: DocumentsMetaItem;
  onUpload: () => void;
  onView?: () => void;
  onDelete?: () => void;
  onCancel?: () => void;
  maxSize?: number;
  acceptedTypes?: string[];
}

export default function FileUploadField({
  title,
  subtitle,
  badge,
  file,
  meta,
  onUpload,
  onView,
  onDelete,
  onCancel,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/png', 'application/pdf'],
}: FileUploadFieldProps) {
  const getVariant = () => {
    if (meta?.isUploading) return 'uploading';
    if (meta?.uploaded) return 'success';
    if (meta?.error) return 'error';
    return 'empty';
  };

  const fileExceedsLimit = !!(file?.size && file.size > maxSize);
  const renderFileSize = (size: number) =>
    fileExceedsLimit
      ? `${formatFileSize(size)} — over ${Math.round(maxSize / 1024 / 1024)}MB limit`
      : formatFileSize(size);

  const renderEmptyState = () => (
    <View style={styles.uploadArea}>
      <View style={styles.uploadIcon}>
        <Text style={styles.uploadIconText}>📁</Text>
      </View>
      <Text style={styles.uploadTitle}>Upload {title}</Text>
      <Text style={styles.uploadSubtitle}>
        Tap below to choose a file
      </Text>
      <Text style={styles.uploadInfo}>
        {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} up to {Math.round(maxSize / 1024 / 1024)} MB
      </Text>
      <TouchableOpacity style={styles.chooseButton} onPress={onUpload}>
        <Text style={styles.chooseButtonText}>+ Choose File</Text>
      </TouchableOpacity>
    </View>
  );

  const renderUploadingState = () => (
    <View style={styles.uploadingArea}>
      {file && (
        <View style={styles.fileRow}>
          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
            <Text style={[styles.fileSize, fileExceedsLimit && styles.fileSizeError]}>{renderFileSize(file.size || 0)}</Text>
          </View>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
      <Text style={styles.uploadingText}>Preparing file…</Text>
    </View>
  );

  const renderUploadedState = () => (
    <View style={styles.uploadedArea}>
      {file && (
        <View style={styles.fileRow}>
          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
            <Text style={[styles.fileSize, fileExceedsLimit && styles.fileSizeError]}>{renderFileSize(file.size || 0)}</Text>
            <Text style={styles.verifiedText}>Attached</Text>
          </View>
          <View style={styles.fileActions}>
            {onView && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onView}
                accessibilityRole="button"
                accessibilityLabel={`View ${title}`}
              >
                <Text style={styles.actionButtonText}>👁</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onDelete}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${title}`}
            >
              <Text style={styles.actionButtonText}>🗑</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Text style={styles.successMessage}>File attached — it will be uploaded when you submit the application</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorArea}>
      <Text style={styles.errorTitle}>Upload Failed</Text>
      <Text style={styles.errorMessage}>{meta?.error || 'Please try again'}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onUpload}>
        <Text style={styles.retryButtonText}>Retry Upload</Text>
      </TouchableOpacity>
    </View>
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const variant = getVariant();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {badge && (
          <View style={[styles.badge, variant === 'empty' && styles.requiredBadge]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        {variant === 'empty' && renderEmptyState()}
        {variant === 'uploading' && renderUploadingState()}
        {variant === 'success' && renderUploadedState()}
        {variant === 'error' && renderErrorState()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  requiredBadge: {
    backgroundColor: '#EF4444',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  content: {
    minHeight: 120,
  },
  uploadArea: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: colors.card,
  },
  uploadIcon: {
    marginBottom: spacing.sm,
  },
  uploadIconText: {
    fontSize: 32,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  uploadInfo: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  chooseButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  chooseButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  uploadingArea: {
    paddingVertical: spacing.md,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  fileSizeError: {
    color: '#EF4444',
    fontWeight: '600',
  },
  verifiedText: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '600',
  },
  cancelButton: {
    padding: spacing.sm,
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  uploadingText: {
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  uploadedArea: {
    paddingVertical: spacing.md,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  fileActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  actionButtonText: {
    fontSize: 16,
  },
  successMessage: {
    fontSize: 12,
    color: '#22C55E',
    textAlign: 'center',
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  errorArea: {
    paddingVertical: spacing.md,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: spacing.sm,
  },
  errorMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});