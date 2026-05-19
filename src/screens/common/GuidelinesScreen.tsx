import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProgressHeader from '@/components/layout/ProgressHeader';
import Button from '@/components/common/Button';
import { useFormEngineStore } from '@/store/useFormEngineStore';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

interface GuidelinesScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export default function GuidelinesScreen({ navigation }: GuidelinesScreenProps) {
  const { setCurrentStep, markStepComplete, currentStep } = useFormEngineStore();

  useEffect(() => {
    setCurrentStep(0);
  }, [setCurrentStep]);

  return (
    <View style={styles.container}>
      <ProgressHeader step={0} total={8} />
      <View style={styles.card}>
        <Text style={styles.title}>Application Guidelines</Text>
        <Text style={styles.description}>
          Follow the step indicator, keep your answers concise, and use inline validation when required. You can move forward only after each section is complete.
        </Text>
      </View>
      <View style={styles.actions}>
        <Button
          title="Start personal details"
          onPress={() => {
            markStepComplete(0);
            setCurrentStep(1);
          }}
        />
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
    fontSize: typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
  },
  actions: {
    marginTop: spacing.xl,
    alignItems: 'flex-end',
  },
});
