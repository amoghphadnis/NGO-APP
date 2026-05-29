import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedView } from '@/components/themed-view';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

export default function HomeScreen() {
  const router = useRouter();

  const handleStartApplication = () => {
    // Navigate to form selection screen
    (router.push as any)('/form-selection');
  };

  return (
    <SafeAreaView style={styles.container}> 
      <ThemedView style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="school" size={64} color={colors.primary} />
          </View>
          <Text style={styles.title}>Vidya Poshak</Text>
          <Text style={styles.subtitle}>Scholarship Portal</Text>
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            Welcome to Scholarship Application Portal
          </Text>
          <Text style={styles.welcomeText}>
            Apply for scholarships and pursue your educational dreams with Vidya Poshak's support.
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartApplication}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-forward" size={20} color={colors.card} />
          <Text style={styles.startButtonText}>Start Application</Text>
        </TouchableOpacity>

        {/* Quick Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            <Text style={styles.infoText}>Easy online application process</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
            <Text style={styles.infoText}>Secure and confidential</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="time" size={24} color={colors.warning} />
            <Text style={styles.infoText}>Quick processing and response</Text>
          </View>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: platform.normalize.fontSize.h1,
    lineHeight: platform.normalize.lineHeight.h1,
    color: colors.textTitle,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSubtitle,
    textAlign: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  welcomeTitle: {
    fontSize: platform.normalize.fontSize.h2,
    lineHeight: platform.normalize.lineHeight.h2,
    color: colors.textTitle,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  welcomeText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSubtitle,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 16,
    minHeight: 56,
    marginBottom: spacing.xl,
  },
  startButtonText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.card,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  infoSection: {
    gap: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
});
