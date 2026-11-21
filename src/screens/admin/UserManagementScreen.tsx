/**
 * User Management Screen (Admin / Admin(CEO))
 *
 * Lists registered users in two tabs — Pending (awaiting activation) and
 * Active. Admins can activate/deactivate, edit, or delete accounts.
 */

import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  DistrictOption,
  ManagedUser,
  RoleOption,
  UpdateUserPayload,
  userManagementApi,
} from '@/api/userManagementApi';
import AppFooter from '@/components/common/AppFooter';
import ModalSelectField from '@/components/common/ModalSelectField';
import VPInputField from '@/components/common/VPInputField';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { canManageUsers, isDistrictScopedRole } from '@/utils/roleUtils';
import { safeGoBack } from '@/utils/navigateToDashboard';

type Tab = 'pending' | 'active';

export default function UserManagementScreen() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<Tab>('pending');
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState<ManagedUser | null>(null);

  const userCanManage = canManageUsers(user?.Role);

  const pendingQuery = useQuery({
    queryKey: ['userManagement', 'pending'],
    queryFn: () => userManagementApi.getPendingUsers(),
    enabled: userCanManage,
  });

  const activeQuery = useQuery({
    queryKey: ['userManagement', 'active'],
    queryFn: () => userManagementApi.getActiveUsers(),
    enabled: userCanManage,
  });

  const rolesQuery = useQuery({
    queryKey: ['userManagement', 'roles'],
    queryFn: () => userManagementApi.getRoles(),
    enabled: userCanManage,
  });

  const districtsQuery = useQuery({
    queryKey: ['userManagement', 'districts'],
    queryFn: () => userManagementApi.getDistricts(),
    enabled: userCanManage,
  });

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: ['userManagement'] });
  };

  const toggleMutation = useMutation({
    mutationFn: (id: number) => userManagementApi.toggleStatus(id),
    onSuccess: (result) => {
      invalidateUsers();
      Alert.alert('Success', result.newStatus ? 'User approved & activated.' : 'User deactivated.');
    },
    onError: (err: any) => Alert.alert('Error', err?.message || 'Failed to update user status'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => userManagementApi.deleteUser(id),
    onSuccess: () => {
      invalidateUsers();
      Alert.alert('Success', 'User deleted.');
    },
    onError: (err: any) => Alert.alert('Error', err?.message || 'Failed to delete user'),
  });

  const activeList = tab === 'pending' ? pendingQuery : activeQuery;
  const users = activeList.data || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([pendingQuery.refetch(), activeQuery.refetch()]);
    setRefreshing(false);
  };

  const confirmRemove = (u: ManagedUser) => {
    const isPending = tab === 'pending';
    Alert.alert(
      isPending ? 'Reject User' : 'Delete User',
      isPending
        ? `Reject ${u.Name} (${u.Email})? The registration will be deleted.`
        : `Delete ${u.Name} (${u.Email})? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: isPending ? 'Reject' : 'Delete',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(u.Id),
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: ManagedUser }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.userName} numberOfLines={1}>{item.Name}</Text>
          <Text style={styles.subText} numberOfLines={1}>{item.Email}</Text>
        </View>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>{item.Role || '—'}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        {item.Mobile ? <InfoRow label="Mobile" value={item.Mobile} /> : null}
        {item.District || item.OtherDistrict ? (
          <InfoRow label="District" value={item.District || item.OtherDistrict} />
        ) : null}
        {item.Taluk ? <InfoRow label="Taluk" value={item.Taluk} /> : null}
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionBtn, tab === 'pending' ? styles.activateBtn : styles.deactivateBtn]}
          onPress={() => toggleMutation.mutate(item.Id)}
          disabled={toggleMutation.isPending || deleteMutation.isPending}
        >
          <Ionicons
            name={tab === 'pending' ? 'checkmark-circle' : 'pause-circle'}
            size={18}
            color={colors.card}
          />
          <Text style={styles.actionBtnText}>
            {tab === 'pending' ? 'Approve' : 'Deactivate'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => setEditing(item)}
          disabled={toggleMutation.isPending || deleteMutation.isPending}
        >
          <Ionicons name="create-outline" size={18} color={colors.card} />
          <Text style={styles.actionBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => confirmRemove(item)}
          disabled={toggleMutation.isPending || deleteMutation.isPending}
        >
          <Ionicons
            name={tab === 'pending' ? 'close-circle' : 'trash-outline'}
            size={18}
            color={colors.card}
          />
          <Text style={styles.actionBtnText}>
            {tab === 'pending' ? 'Reject' : 'Delete'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!userCanManage) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.errorContainer}>
          <Ionicons name="lock-closed-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.errorText}>
            Only Admin accounts can manage users.
          </Text>
        </View>
        <AppFooter />
      </SafeAreaView>
    );
  }

  if (activeList.isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
        <AppFooter />
      </SafeAreaView>
    );
  }

  if (activeList.isError) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={styles.errorText}>
            {activeList.error?.message || 'Failed to load users'}
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
            <Text style={styles.headerTitle}>User Management</Text>
            <Text style={styles.headerSubtitle}>
              {pendingQuery.data?.length ?? 0} pending · {activeQuery.data?.length ?? 0} active
            </Text>
          </View>
        </View>

        <View style={styles.tabRow}>
          {(['pending', 'active'] as Tab[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === t && styles.tabActive]}
              onPress={() => setTab(t)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'pending' ? `Pending (${pendingQuery.data?.length ?? 0})` : `Active (${activeQuery.data?.length ?? 0})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.Id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>
              {tab === 'pending' ? 'No users awaiting approval' : 'No active users'}
            </Text>
          </View>
        }
      />

      <EditUserModal
        key={editing?.Id ?? 'closed'}
        user={editing}
        roles={rolesQuery.data || []}
        districts={districtsQuery.data || []}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          invalidateUsers();
        }}
      />

      <AppFooter />
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

interface EditUserModalProps {
  user: ManagedUser | null;
  roles: RoleOption[];
  districts: DistrictOption[];
  onClose: () => void;
  onSaved: () => void;
}

function EditUserModal({ user, roles, districts, onClose, onSaved }: EditUserModalProps) {
  const [form, setForm] = useState<UpdateUserPayload | null>(() =>
    user
      ? {
          Name: user.Name,
          Email: user.Email,
          Mobile: user.Mobile ?? '',
          Role: user.Role,
          District: user.District,
          Taluk: user.Taluk ?? '',
          Address: '',
          Password: '',
        }
      : null
  );

  const updateMutation = useMutation({
    mutationFn: (payload: { id: number; data: UpdateUserPayload }) =>
      userManagementApi.updateUser(payload.id, payload.data),
    onSuccess: () => {
      Alert.alert('Success', 'User updated.');
      onSaved();
    },
    onError: (err: any) => Alert.alert('Error', err?.message || 'Failed to update user'),
  });

  if (!user || !form) return null;

  const districtOptions = districts.map((d) => ({ label: d.DistrictName, value: d.DistrictID }));
  const selectedDistrictId =
    districts.find((d) => d.DistrictName === form.District)?.DistrictID;

  const handleSave = () => {
    if (!form.Name.trim() || !form.Email.trim() || !form.Role) {
      Alert.alert('Missing details', 'Name, Email and Role are required.');
      return;
    }
    const payload: UpdateUserPayload = {
      Name: form.Name.trim(),
      Email: form.Email.trim(),
      Mobile: form.Mobile?.trim() || undefined,
      Role: form.Role,
      Taluk: form.Taluk?.trim() || undefined,
      Address: form.Address?.trim() || undefined,
      DistrictID: isDistrictScopedRole(form.Role) ? selectedDistrictId ?? null : null,
    };
    if (form.Password?.trim()) {
      payload.Password = form.Password.trim();
    }
    updateMutation.mutate({ id: user.Id, data: payload });
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit User</Text>
          <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
            <VPInputField
              label="Name"
              value={form.Name}
              onChangeText={(t) => setForm({ ...form, Name: t })}
              required
            />
            <VPInputField
              label="Email"
              value={form.Email}
              onChangeText={(t) => setForm({ ...form, Email: t })}
              keyboardType="email-address"
              autoCapitalize="none"
              required
            />
            <VPInputField
              label="Mobile"
              value={form.Mobile ?? ''}
              onChangeText={(t) => setForm({ ...form, Mobile: t })}
              keyboardType="phone-pad"
            />
            <ModalSelectField<string>
              label="Role"
              value={form.Role}
              options={roles.map((r) => ({ label: r.Name, value: r.Name }))}
              onChange={(v) => setForm({ ...form, Role: v })}
              modalTitle="Select Role"
              required
            />
            {isDistrictScopedRole(form.Role) && (
              <>
                <ModalSelectField<number>
                  label="District"
                  value={selectedDistrictId}
                  options={districtOptions}
                  onChange={(v) =>
                    setForm({
                      ...form,
                      District: districts.find((d) => d.DistrictID === v)?.DistrictName,
                    })
                  }
                  modalTitle="Select District"
                  required
                />
                <VPInputField
                  label="Taluk"
                  value={form.Taluk ?? ''}
                  onChangeText={(t) => setForm({ ...form, Taluk: t })}
                />
              </>
            )}
            <VPInputField
              label="New Password"
              value={form.Password ?? ''}
              onChangeText={(t) => setForm({ ...form, Password: t })}
              placeholder="Leave blank to keep current password"
              secureTextEntry
            />
          </ScrollView>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalBtn, styles.modalCancelBtn]}
              onPress={onClose}
              disabled={updateMutation.isPending}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, styles.modalSaveBtn]}
              onPress={handleSave}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <ActivityIndicator size="small" color={colors.card} />
              ) : (
                <Text style={styles.modalActionText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
  tabRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: platform.normalize.fontSize.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.card,
  },
  listContent: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...(platform.elevation.card as any),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  userName: {
    fontSize: platform.normalize.fontSize.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  subText: {
    fontSize: platform.normalize.fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  roleBadgeText: {
    color: colors.card,
    fontSize: platform.normalize.fontSize.caption,
    fontWeight: '600',
  },
  cardBody: {
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  infoLabel: {
    fontSize: platform.normalize.fontSize.caption,
    color: colors.textSecondary,
    flex: 0.4,
  },
  infoValue: {
    fontSize: platform.normalize.fontSize.caption,
    color: colors.textPrimary,
    flex: 0.6,
    textAlign: 'right',
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 8,
    gap: 6,
  },
  activateBtn: {
    backgroundColor: colors.success,
  },
  deactivateBtn: {
    backgroundColor: colors.warning,
  },
  editBtn: {
    backgroundColor: colors.primary,
  },
  deleteBtn: {
    backgroundColor: colors.error,
  },
  actionBtnText: {
    color: colors.card,
    fontSize: platform.normalize.fontSize.caption,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: platform.normalize.fontSize.body,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xxxl,
  },
  emptyText: {
    marginTop: spacing.md,
    fontSize: platform.normalize.fontSize.body,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
  },
  modalScroll: {
    flexGrow: 0,
  },
  modalTitle: {
    fontSize: platform.normalize.fontSize.h2,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelBtn: {
    backgroundColor: colors.disabled,
  },
  modalCancelText: {
    color: colors.textPrimary,
    fontSize: platform.normalize.fontSize.body,
    fontWeight: '600',
  },
  modalSaveBtn: {
    backgroundColor: colors.primary,
  },
  modalActionText: {
    color: colors.card,
    fontSize: platform.normalize.fontSize.body,
    fontWeight: '600',
  },
});
