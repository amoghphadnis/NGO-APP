/**
 * Branch Executive District Mapping Screen
 *
 * Web menu: "Assign Districts to Branch Executives"
 * Select a Branch Executive → check districts → save replaces the mapping.
 * Available to Program Manager and Branch Executives (web parity).
 */

import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { branchExecutiveMappingApi } from '@/api/branchExecutiveMappingApi';
import AppFooter from '@/components/common/AppFooter';
import ModalSelectField from '@/components/common/ModalSelectField';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { canAssignVolunteers } from '@/utils/roleUtils';

export default function DistrictMappingScreen() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedDistricts, setSelectedDistricts] = useState<number[]>([]);
  const [dirty, setDirty] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const userCanAccess = canAssignVolunteers(user?.Role);

  const formQuery = useQuery({
    queryKey: branchExecutiveMappingApi.queryKeys.form,
    queryFn: () => branchExecutiveMappingApi.getForm(),
    enabled: userCanAccess,
  });

  const assignedQuery = useQuery({
    queryKey: branchExecutiveMappingApi.queryKeys.assigned(selectedUserId ?? 0),
    queryFn: () => branchExecutiveMappingApi.getAssigned(selectedUserId!),
    enabled: userCanAccess && selectedUserId !== null,
  });

  // Effective selection: user's edits once they start toggling (dirty),
  // otherwise the server-fetched assigned districts.
  const effectiveDistricts = dirty
    ? selectedDistricts
    : assignedQuery.data ?? [];

  const assignMutation = useMutation({
    mutationFn: (vars: { userId: number; districtIds: number[] }) =>
      branchExecutiveMappingApi.assign(vars.userId, vars.districtIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branchExecutiveMapping'] });
      Alert.alert('Success', 'Districts assigned successfully.');
      setDirty(false);
    },
    onError: (err: any) =>
      Alert.alert('Error', err?.message || 'Failed to assign districts'),
  });

  const executives = formQuery.data?.Executives || [];
  const districts = formQuery.data?.Districts || [];

  const toggleDistrict = (id: number) => {
    const next = effectiveDistricts.includes(id)
      ? effectiveDistricts.filter((d) => d !== id)
      : [...effectiveDistricts, id];
    setSelectedDistricts(next);
    setDirty(true);
  };

  const handleSelectExecutive = (id: number) => {
    setSelectedUserId(id);
    setSelectedDistricts([]);
    setDirty(false);
  };

  const handleSave = () => {
    if (!selectedUserId) {
      Alert.alert('Missing details', 'Select a Branch Executive first.');
      return;
    }
    if (effectiveDistricts.length === 0) {
      Alert.alert('Missing details', 'Select at least one district.');
      return;
    }
    assignMutation.mutate({
      userId: selectedUserId,
      districtIds: effectiveDistricts,
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([formQuery.refetch(), assignedQuery.refetch()]);
    setRefreshing(false);
  };

  if (!userCanAccess) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.centerContainer}>
          <Ionicons name="lock-closed-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.errorText}>
            You do not have access to district mapping.
          </Text>
        </View>
        <AppFooter />
      </SafeAreaView>
    );
  }

  if (formQuery.isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
        <AppFooter />
      </SafeAreaView>
    );
  }

  if (formQuery.isError) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={styles.errorText}>
            {formQuery.error?.message || 'Failed to load mapping data'}
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={handleRefresh}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
        <AppFooter />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Assign Districts</Text>
            <Text style={styles.headerSubtitle}>
              Map districts to a Branch Executive
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.card}>
          <ModalSelectField<number>
            label="Branch Executive"
            value={selectedUserId ?? undefined}
            options={executives.map((e) => ({
              label: e.Text,
              value: parseInt(e.Value, 10),
            }))}
            onChange={handleSelectExecutive}
            modalTitle="Select Branch Executive"
            required
          />

          {selectedUserId !== null && (
            <>
              {assignedQuery.isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                  style={{ marginVertical: spacing.md }}
                />
              ) : (
                <>
                  <Text style={styles.sectionLabel}>Districts</Text>
                  <View style={styles.districtList}>
                    {districts.map((d) => {
                      const id = parseInt(d.Value, 10);
                      const checked = effectiveDistricts.includes(id);
                      return (
                        <TouchableOpacity
                          key={d.Value}
                          style={styles.districtRow}
                          onPress={() => toggleDistrict(id)}
                          activeOpacity={0.7}
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked }}
                        >
                          <Ionicons
                            name={checked ? 'checkbox' : 'square-outline'}
                            size={22}
                            color={checked ? colors.primary : colors.textSecondary}
                          />
                          <Text style={styles.districtText}>{d.Text}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.saveBtn,
                      (assignMutation.isPending || effectiveDistricts.length === 0) &&
                        styles.saveBtnDisabled,
                    ]}
                    onPress={handleSave}
                    disabled={assignMutation.isPending}
                    activeOpacity={0.8}
                  >
                    {assignMutation.isPending ? (
                      <ActivityIndicator size="small" color={colors.card} />
                    ) : (
                      <Text style={styles.saveBtnText}>
                        Save Mapping ({effectiveDistricts.length})
                      </Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <AppFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: spacing.sm,
    padding: spacing.xs,
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: platform.normalize.fontSize.h2,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: platform.normalize.fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  content: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    ...(platform.elevation.card as any),
  },
  sectionLabel: {
    fontSize: platform.normalize.fontSize.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  districtList: {
    gap: spacing.xs,
  },
  districtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    minHeight: 44,
  },
  districtText: {
    fontSize: platform.normalize.fontSize.body,
    color: colors.textPrimary,
    flex: 1,
  },
  saveBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: colors.card,
    fontSize: platform.normalize.fontSize.body,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: platform.normalize.fontSize.body,
    color: colors.textSecondary,
  },
  errorText: {
    marginTop: spacing.md,
    fontSize: platform.normalize.fontSize.body,
    color: colors.error,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryBtnText: {
    color: colors.card,
    fontSize: platform.normalize.fontSize.body,
    fontWeight: '600',
  },
});
