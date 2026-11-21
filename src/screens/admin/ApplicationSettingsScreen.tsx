/**
 * Application Settings Screen (Update Last Date to Apply)
 *
 * Web menu: "Update Last Date to Apply" admin page.
 * Lists the four program deadline rows (PUC, New Professional,
 * Semi Professional, Payana) and edits ApplicationSettings.LastDateToApply.
 * Available to Program Manager, Admin, Admin(CEO).
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
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    applicationSettingsApi,
    ApplicationSetting,
} from '@/api/applicationSettingsApi';
import AppFooter from '@/components/common/AppFooter';
import VPInputField from '@/components/common/VPInputField';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { canManageSettings } from '@/utils/roleUtils';
import { safeGoBack } from '@/utils/navigateToDashboard';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default function ApplicationSettingsScreen() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [editing, setEditing] = useState<ApplicationSetting | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const userCanManage = canManageSettings(user?.Role);

  const listQuery = useQuery({
    queryKey: applicationSettingsApi.queryKeys.list(),
    queryFn: () => applicationSettingsApi.list(),
    enabled: userCanManage,
  });

  const settings = listQuery.data || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await listQuery.refetch();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: ApplicationSetting }) => (
    <View style={styles.card}>
      <View style={styles.cardBody}>
        <Text style={styles.formName}>{item.FormName}</Text>
        <Text style={styles.subText}>
          Last date to apply: {item.LastDateToApply || 'Not set'}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.actionBtn, styles.editBtn]}
        onPress={() => setEditing(item)}
        activeOpacity={0.8}
      >
        <Ionicons name="create-outline" size={18} color={colors.card} />
        <Text style={styles.actionBtnText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  if (!userCanManage) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.centerContainer}>
          <Ionicons name="lock-closed-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.errorText}>
            You do not have access to application settings.
          </Text>
        </View>
        <AppFooter />
      </SafeAreaView>
    );
  }

  if (listQuery.isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
        <AppFooter />
      </SafeAreaView>
    );
  }

  if (listQuery.isError) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={styles.errorText}>
            {listQuery.error?.message || 'Failed to load settings'}
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
            <Text style={styles.headerTitle}>Update Last Date</Text>
            <Text style={styles.headerSubtitle}>
              Application deadlines per program
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={settings}
        keyExtractor={(item) => item.FormType || item.Id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No application settings found</Text>
          </View>
        }
      />

      <EditDateModal
        key={editing?.FormType ?? 'closed'}
        setting={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          queryClient.invalidateQueries({ queryKey: ['applicationSettings'] });
        }}
      />

      <AppFooter />
    </SafeAreaView>
  );
}

interface EditDateModalProps {
  setting: ApplicationSetting | null;
  onClose: () => void;
  onSaved: () => void;
}

function EditDateModal({ setting, onClose, onSaved }: EditDateModalProps) {
  const [date, setDate] = useState(setting?.LastDateToApply ?? '');

  const saveMutation = useMutation({
    mutationFn: (vars: { formType: string; lastDate: string }) =>
      applicationSettingsApi.updateLastDate(vars.formType, vars.lastDate),
    onSuccess: () => {
      Alert.alert('Success', 'Last date updated.');
      onSaved();
    },
    onError: (err: any) =>
      Alert.alert('Error', err?.message || 'Failed to update last date'),
  });

  if (!setting) return null;

  const handleSave = () => {
    const value = date.trim();
    if (!DATE_RE.test(value) || isNaN(Date.parse(value))) {
      Alert.alert(
        'Invalid date',
        'Enter the date in YYYY-MM-DD format (e.g. 2026-08-31).'
      );
      return;
    }
    saveMutation.mutate({ formType: setting.FormType, lastDate: value });
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{setting.FormName}</Text>
          <VPInputField
            label="Last Date to Apply (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
            placeholder="2026-08-31"
            keyboardType="numbers-and-punctuation"
            required
          />
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalBtn, styles.modalCancelBtn]}
              onPress={onClose}
              disabled={saveMutation.isPending}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, styles.modalSaveBtn]}
              onPress={handleSave}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? (
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
  listContent: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...(platform.elevation.card as any),
  },
  cardBody: {
    flex: 1,
    marginRight: spacing.sm,
  },
  formName: {
    fontSize: platform.normalize.fontSize.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  subText: {
    fontSize: platform.normalize.fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    gap: 4,
    minHeight: 44,
  },
  editBtn: {
    backgroundColor: colors.primary,
  },
  actionBtnText: {
    color: colors.card,
    fontSize: platform.normalize.fontSize.caption,
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
    paddingVertical: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  modalCancelBtn: {
    backgroundColor: colors.border,
  },
  modalSaveBtn: {
    backgroundColor: colors.primary,
  },
  modalCancelText: {
    color: colors.textPrimary,
    fontSize: platform.normalize.fontSize.body,
    fontWeight: '600',
  },
  modalActionText: {
    color: colors.card,
    fontSize: platform.normalize.fontSize.body,
    fontWeight: '600',
  },
});
