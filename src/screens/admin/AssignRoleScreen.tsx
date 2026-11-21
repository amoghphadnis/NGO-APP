/**
 * Assign Role Screen (Admin / Admin(CEO))
 *
 * Web menu: "Assign Role" admin page.
 * Pick an active user → pick a role → PUT /api/registration/assign-role/{id}
 * updates Users.Role + Users.AssignedRole.
 * Admin-only per web parity.
 */

import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
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

import { userManagementApi } from '@/api/userManagementApi';
import AppFooter from '@/components/common/AppFooter';
import ModalSelectField from '@/components/common/ModalSelectField';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { canAssignRoles } from '@/utils/roleUtils';
import { safeGoBack } from '@/utils/navigateToDashboard';

export default function AssignRoleScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const userCanAssign = canAssignRoles(user?.Role);

  const usersQuery = useQuery({
    queryKey: ['userManagement', 'active'],
    queryFn: () => userManagementApi.getActiveUsers(),
    enabled: userCanAssign,
  });

  const rolesQuery = useQuery({
    queryKey: ['userManagement', 'roles'],
    queryFn: () => userManagementApi.getRoles(),
    enabled: userCanAssign,
  });

  const assignMutation = useMutation({
    mutationFn: (vars: { id: number; role: string }) =>
      userManagementApi.assignRole(vars.id, vars.role),
    onSuccess: () => {
      Alert.alert('Success', 'Role assigned successfully.');
      usersQuery.refetch();
    },
    onError: (err: any) =>
      Alert.alert('Error', err?.message || 'Failed to assign role'),
  });

  const users = usersQuery.data || [];
  const roles = rolesQuery.data || [];
  const selectedUser = users.find((u) => u.Id === selectedUserId);

  const handleAssign = () => {
    if (!selectedUserId || !selectedRole) {
      Alert.alert('Missing details', 'Select a user and a role.');
      return;
    }
    assignMutation.mutate({ id: selectedUserId, role: selectedRole });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([usersQuery.refetch(), rolesQuery.refetch()]);
    setRefreshing(false);
  };

  if (!userCanAssign) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.centerContainer}>
          <Ionicons name="lock-closed-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.errorText}>
            Only Admin accounts can assign roles.
          </Text>
        </View>
        <AppFooter />
      </SafeAreaView>
    );
  }

  if (usersQuery.isLoading || rolesQuery.isLoading) {
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

  if (usersQuery.isError || rolesQuery.isError) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={styles.errorText}>
            {usersQuery.error?.message ||
              rolesQuery.error?.message ||
              'Failed to load data'}
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
            onPress={() => safeGoBack('/pdashboard')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Assign Role</Text>
            <Text style={styles.headerSubtitle}>
              Change a user&rsquo;s role
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
            label="User"
            value={selectedUserId ?? undefined}
            options={users.map((u) => ({
              label: `${u.Name} (${u.Role || 'no role'})`,
              value: u.Id,
            }))}
            onChange={setSelectedUserId}
            modalTitle="Select User"
            required
          />

          {selectedUser && (
            <Text style={styles.currentRole}>
              Current role: {selectedUser.Role || 'None'}
            </Text>
          )}

          <ModalSelectField<string>
            label="New Role"
            value={selectedRole ?? undefined}
            options={roles.map((r) => ({ label: r.Name, value: r.Name }))}
            onChange={setSelectedRole}
            modalTitle="Select Role"
            required
          />

          <TouchableOpacity
            style={[
              styles.saveBtn,
              (assignMutation.isPending || !selectedUserId || !selectedRole) &&
                styles.saveBtnDisabled,
            ]}
            onPress={handleAssign}
            disabled={assignMutation.isPending}
            activeOpacity={0.8}
          >
            {assignMutation.isPending ? (
              <ActivityIndicator size="small" color={colors.card} />
            ) : (
              <Text style={styles.saveBtnText}>Assign Role</Text>
            )}
          </TouchableOpacity>
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
  currentRole: {
    fontSize: platform.normalize.fontSize.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
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
