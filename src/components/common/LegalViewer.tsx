import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LEGAL_DOCUMENTS, LegalDocumentType } from '@/config/legal';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';

interface LegalViewerProps {
  type: LegalDocumentType;
}

export default function LegalViewer({ type }: LegalViewerProps) {
  const router = useRouter();
  const document = LEGAL_DOCUMENTS[type];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{document.title}</Text>
        <View style={styles.headerSpacer} />
      </View>
      {document.pdfSource ? (
        <Pdf
          source={document.pdfSource}
          style={styles.pdf}
          trustAllCerts={false}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {document.sections.map((section) => (
            <View key={section.title} style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    flexDirection: 'row',
    minHeight: 56,
    paddingHorizontal: spacing.md,
  },
  backButton: {
    alignItems: 'center',
    height: platform.touchTarget.iconButtonSize,
    justifyContent: 'center',
    width: platform.touchTarget.iconButtonSize,
  },
  headerTitle: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: platform.normalize.fontSize.h3,
    fontWeight: '700',
    lineHeight: platform.normalize.lineHeight.h3,
    textAlign: 'center',
  },
  headerSpacer: {
    width: platform.touchTarget.iconButtonSize,
  },
  pdf: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: spacing.md,
    padding: spacing.md,
    ...platform.elevation.card,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: platform.normalize.fontSize.body,
    fontWeight: '700',
    lineHeight: platform.normalize.lineHeight.body,
    marginBottom: spacing.sm,
  },
  sectionContent: {
    color: colors.textSecondary,
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
  },
});
