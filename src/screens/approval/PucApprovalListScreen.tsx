/**
 * PUC Approval List Screen
 *
 * Displays the PUC student approval grid from GET /api/students/getall.
 * Allows authorized roles (Program Manager, Admin, Admin(CEO)) to:
 * - View student details and approval status
 * - Approve a student (POST /api/students/approve?id=...&remark=...)
 * - Reject a student with a remark (POST /api/students/reject?id=...&remark=...)
 *
 * Branch Executives are filtered by their mapped districts (role + userId passed as query params).
 */

import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { pucApprovalApi } from '@/api/pucApprovalApi';
import AppFooter from '@/components/common/AppFooter';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { PucApprovalStudent } from '@/types/pucApproval';
import { canApprove } from '@/utils/roleUtils';

const STATUS_COLORS: Record<string, string> = {
  Pending: colors.warning,
  Approved: colors.success,
  Rejected: colors.error,
};

export default function PucApprovalListScreen() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [refreshing, setRefreshing] = useState(false);
  const [actionModal, setActionModal] = useState<{
    student: PucApprovalStudent;
    action: 'approve' | 'reject';
  } | null>(null);
  const [remark, setRemark] = useState('');

  const isBranchExecutive = user?.Role === 'Branch Executives';
  const userCanApprove = canApprove(user?.Role);

  const { data: students, isLoading, isError, error, refetch } = useQuery({
    queryKey: pucApprovalApi.queryKeys.list(
      isBranchExecutive
        ? { role: user?.Role, userId: user?.UserID }
        : undefined
    ),
    queryFn: () =>
      pucApprovalApi.getList(
        isBranchExecutive
          ? { role: user?.Role, userId: user?.UserID }
          : undefined
      ),
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, remark }: { id: number; remark?: string }) =>
      pucApprovalApi.approve(id, remark),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pucApproval'] });
      setActionModal(null);
      setRemark('');
      Alert.alert('Success', 'Student Approved Successfully');
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.message || 'Failed to approve student');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, remark }: { id: number; remark?: string }) =>
      pucApprovalApi.reject(id, remark),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pucApproval'] });
      setActionModal(null);
      setRemark('');
      Alert.alert('Success', 'Student Rejected Successfully');
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.message || 'Failed to reject student');
    },
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const openApprove = (student: PucApprovalStudent) => {
    setRemark(student.Remark || '');
    setActionModal({ student, action: 'approve' });
  };

  const openReject = (student: PucApprovalStudent) => {
    setRemark('');
    setActionModal({ student, action: 'reject' });
  };

  const handleConfirm = () => {
    if (!actionModal) return;
    const { student, action } = actionModal;
    if (action === 'approve') {
      approveMutation.mutate({ id: student.StudentID, remark: remark || undefined });
    } else {
      rejectMutation.mutate({ id: student.StudentID, remark: remark || undefined });
    }
  };

  const isMutating = approveMutation.isPending || rejectMutation.isPending;

  const renderItem = ({ item }: { item: PucApprovalStudent }) => {
    const statusColor = STATUS_COLORS[item.ApprovalStatus] || colors.textSecondary;
    const isPending = item.ApprovalStatus === 'Pending';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.studentName} numberOfLines={1}>
              {item.StudentName || 'Unknown'}
            </Text>
            <Text style={styles.subText} numberOfLines={1}>
              {item.Email || 'No email'}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{item.ApprovalStatus}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <InfoRow label="District" value={item.District} />
          <InfoRow label="College" value={item.CollegeName} />
          <InfoRow label="Course" value={item.CourseName} />
          <InfoRow label="Percentage" value={item.SecuredPercentage?.toString()} />
          <InfoRow label="Family Income" value={item.FamilyIncome?.toString()} />
          <InfoRow label="Contact" value={item.ContactNumber} />
          {item.Remark ? <InfoRow label="Remark" value={item.Remark} /> : null}
        </View>

        {isPending && userCanApprove && (
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.approveBtn]}
              onPress={() => openApprove(item)}
              disabled={isMutating}
            >
              <Ionicons name="checkmark-circle" size={18} color={colors.card} />
              <Text style={styles.actionBtnText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.rejectBtn]}
              onPress={() => openReject(item)}
              disabled={isMutating}
            >
              <Ionicons name="close-circle" size={18} color={colors.card} />
              <Text style={styles.actionBtnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (!userCanApprove && !isBranchExecutive) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.errorContainer}>
          <Ionicons name="lock-closed-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.errorText}>
            You do not have permission to access the approval list.
          </Text>
        </View>
        <AppFooter />
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading approval list...</Text>
        </View>
        <AppFooter />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={styles.errorText}>
            {error?.message || 'Failed to load approval list'}
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
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PUC Approval</Text>
        <Text style={styles.headerSubtitle}>
          {students?.length || 0} student{students?.length === 1 ? '' : 's'}
        </Text>
      </View>

      <FlatList
        data={students || []}
        keyExtractor={(item) => item.StudentID.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No students pending approval</Text>
          </View>
        }
      />

      {/* Approve / Reject Modal */}
      <Modal
        visible={!!actionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setActionModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {actionModal?.action === 'approve' ? 'Approve Student' : 'Reject Student'}
            </Text>
            <Text style={styles.modalStudentName}>
              {actionModal?.student.StudentName}
            </Text>
            <Text style={styles.modalLabel}>Remark</Text>
            <TextInput
              style={styles.modalInput}
              value={remark}
              onChangeText={setRemark}
              placeholder="Enter remark (optional for approve, recommended for reject)"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => {
                  setActionModal(null);
                  setRemark('');
                }}
                disabled={isMutating}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  actionModal?.action === 'approve'
                    ? styles.modalApproveBtn
                    : styles.modalRejectBtn,
                ]}
                onPress={handleConfirm}
                disabled={isMutating}
              >
                {isMutating ? (
                  <ActivityIndicator size="small" color={colors.card} />
                ) : (
                  <Text style={styles.modalActionText}>
                    {actionModal?.action === 'approve' ? 'Approve' : 'Reject'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  studentName: {
    fontSize: platform.normalize.fontSize.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  subText: {
    fontSize: platform.normalize.fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
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
  approveBtn: {
    backgroundColor: colors.success,
  },
  rejectBtn: {
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
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: platform.normalize.fontSize.h2,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  modalStudentName: {
    fontSize: platform.normalize.fontSize.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  modalLabel: {
    fontSize: platform.normalize.fontSize.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    fontSize: platform.normalize.fontSize.body,
    color: colors.textPrimary,
    minHeight: 80,
    marginBottom: spacing.md,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
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
  modalApproveBtn: {
    backgroundColor: colors.success,
  },
  modalRejectBtn: {
    backgroundColor: colors.error,
  },
  modalActionText: {
    color: colors.card,
    fontSize: platform.normalize.fontSize.body,
    fontWeight: '600',
  },
});
