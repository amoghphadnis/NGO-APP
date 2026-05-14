import { View, Text, StyleSheet } from 'react-native';
import Button from '@/components/common/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Sign in to continue your form journey and keep your progress in a clear, step-based workflow.
        </Text>
      </View>
      <View style={styles.actions}>
        <Button title="Continue" onPress={login} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 6,
  },
  title: {
    fontSize: typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
  },
  actions: {
    marginTop: spacing.xl,
    alignItems: 'flex-end',
  },
});
