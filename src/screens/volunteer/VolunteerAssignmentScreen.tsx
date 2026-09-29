/**
 * Volunteer Assignment Screen
 *
 * Uses the volunteerAssignmentApi to:
 * 1. Load districts
 * 2. Load students by district (pending house visit)
 * 3. Load volunteers by district
 * 4. Assign / Reassign / Cancel volunteer for a student
 *
 * Program-specific API differences (body casing, reassign method, cancel mode)
 * are handled by the API factory — this screen stays program-agnostic.
 */

import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { houseVisitApi } from '@/api/houseVisitApi';
import { houseVisitApprovalApis } from '@/api/houseVisitApprovalApi';
import { VolunteerAssignmentApi } from '@/api/volunteerAssignmentApi';
import AppFooter from '@/components/common/AppFooter';
import VolunteerPickerModal from '@/components/volunteer/VolunteerPickerModal';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { SelectListItemDto } from '@/types/payana';
import {
    AssignVolunteerRequest,
    CancelVolunteerAssignmentRequest,
    VOLUNTEER_ASSIGNMENT_SOURCES,
    VolunteerAssignmentProgram,
    VolunteerAssignmentStudentDto,
} from '@/types/volunteerAssignment';
import { canAssignVolunteers } from '@/utils/roleUtils';

// ── Program metadata ────────────────────────────────────────────────────────

const PROGRAM_META: Record<
  VolunteerAssignmentProgram,
  { title: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  puc: { title: 'PUC — Volunteer Assignment', icon: 'school-outline' },
  payana: { title: 'Payana — Volunteer Assignment', icon: 'bicycle-outline' },
  professional: { title: 'Professional — Volunteer Assignment', icon: 'briefcase-outline' },
  semiProfessional: { title: 'Semi Professional — Volunteer Assignment', icon: 'book-outline' },
};

// ── Props ────────────────────────────────────────────────────────────────────

interface VolunteerAssignmentScreenProps {
  program: VolunteerAssignmentProgram;
  api: VolunteerAssignmentApi;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function VolunteerAssignmentScreen({
  program,
  api,
}: VolunteerAssignmentScreenProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const userCanAssign = canAssignVolunteers(user?.Role);
  const meta = PROGRAM_META[program];

  const [selectedDistrictId, setSelectedDistrictId] = useState<number | undefined>();
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [activeStudent, setActiveStudent] = useState<VolunteerAssignmentStudentDto | null>(null);
  const [pickedVolunteerId, setPickedVolunteerId] = useState<number | null>(null);

  // ── Queries ──────────────────────────────────────────────────────────────

  const districtsQuery = useQuery({
    queryKey: api.queryKeys.districts(),
    queryFn: () => api.getDistricts(),
    staleTime: 5 * 60 * 1000,
  });

  const studentsQuery = useQuery({
    queryKey: api.queryKeys.students(selectedDistrictId ?? 0),
    queryFn: () => api.getStudents(selectedDistrictId!),
    enabled: selectedDistrictId !== undefined,
    staleTime: 30 * 1000,
  });

  const volunteersQuery = useQuery({
    queryKey: api.queryKeys.volunteers(selectedDistrictId ?? 0),
    queryFn: () => api.getVolunteers(selectedDistrictId!),
    enabled: selectedDistrictId !== undefined,
    staleTime: 30 * 1000,
  });

  // ── Mutations ────────────────────────────────────────────────────────────

  const invalidateStudents = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: api.queryKeys.students(selectedDistrictId ?? 0) });
  }, [queryClient, api, selectedDistrictId]);

  const assignMutation = useMutation({
    mutationFn: (req: AssignVolunteerRequest) => api.assign(req),
    onSuccess: (res: { success: boolean; message: string }) => {
      Alert.alert('Success', res.message || 'Volunteer assigned successfully');
      invalidateStudents();
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.message || 'Failed to assign volunteer');
    },
  });

  const reassignMutation = useMutation({
    mutationFn: (req: AssignVolunteerRequest) => api.reassign(req),
    onSuccess: (res: { success: boolean; message: string }) => {
      Alert.alert('Success', res.message || 'Volunteer reassigned successfully');
      invalidateStudents();
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.message || 'Failed to reassign volunteer');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (req: CancelVolunteerAssignmentRequest) => api.cancel(req),
    onSuccess: (res: { success: boolean; message: string }) => {
      Alert.alert('Success', res.message || 'Assignment cancelled successfully');
      invalidateStudents();
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.message || 'Failed to cancel assignment');
    },
  });

  // ── Derived data ─────────────────────────────────────────────────────────

  const districts = districtsQuery.data?.data ?? [];
  const students = studentsQuery.data?.data ?? [];
  // "Pending" means not yet visited — visited students are listed but excluded
  // from the count.
  const pendingCount = students.filter((s) => !s.IsHouseVisitCompleted).length;
  const volunteers = volunteersQuery.data?.data ?? [];

  const isMutating = assignMutation.isPending || reassignMutation.isPending || cancelMutation.isPending;

  // Auto-select user district or first district when districts load
  useEffect(() => {
    if (selectedDistrictId === undefined && districts.length > 0) {
      if (user?.District) {
        const match = districts.find(
          (d: SelectListItemDto) => d.Text?.trim().toLowerCase() === user.District?.trim().toLowerCase()
        );
        if (match) {
          setSelectedDistrictId(Number(match.Value));
          return;
        }
      }
      setSelectedDistrictId(Number(districts[0].Value));
    }
  }, [districts, user?.District, selectedDistrictId]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleDistrictSelect = (districtId: number | undefined) => {
    setSelectedDistrictId(districtId);
    setShowDistrictDropdown(false);
  };

  const handleOpenPicker = (student: VolunteerAssignmentStudentDto) => {
    setActiveStudent(student);
    setPickedVolunteerId(null);
    setPickerVisible(true);
  };

  const handleHouseVisit = (student: VolunteerAssignmentStudentDto) => {
    const link = houseVisitApi.getLink(
      student.StudentID,
      program,
      student.StudentName ?? undefined,
    );
    router.push(link as any);
  };

  const handleEditHouseVisit = async (student: VolunteerAssignmentStudentDto) => {
    let visitId = student.HouseVisitID ?? null;

    // Some program controllers mark a visit complete without returning its
    // record id. Resolve it from the program's approval grid, which does
    // expose HouseVisitID per student.
    if (!visitId) {
      try {
        const approvalApi = houseVisitApprovalApis[program];
        const items = await approvalApi.getList();
        const match = items.find((i) => Number(i.studentId) === Number(student.StudentID));
        visitId = match?.id ?? null;
      } catch {
        // Fall through to the not-found alert below.
      }
    }

    if (!visitId) {
      Alert.alert(
        'House visit record not found',
        `No saved house visit record was found for ${student.StudentName || 'this student'}. Please contact your coordinator.`
      );
      return;
    }
    const link = `/housevisit/edit?houseVisitId=${visitId}&program=${program}`;
    router.push(link as any);
  };

  const handlePickVolunteer = (volunteer: { Value: string; Text: string }) => {
    setPickedVolunteerId(Number(volunteer.Value));
  };

  const handleConfirmAssignment = () => {
    if (!activeStudent || pickedVolunteerId === null) return;

    const source = (activeStudent.Source as typeof VOLUNTEER_ASSIGNMENT_SOURCES[number]) ?? 'New Student';
    const isAssigned = Boolean(activeStudent.IsAssigned);

    const req: AssignVolunteerRequest = {
      studentId: activeStudent.StudentID,
      volunteerId: pickedVolunteerId,
      source,
    };

    if (isAssigned) {
      reassignMutation.mutate(req);
    } else {
      assignMutation.mutate(req);
    }

    setPickerVisible(false);
  };

  const handleCancelAssignment = (student: VolunteerAssignmentStudentDto) => {
    const source = (student.Source as typeof VOLUNTEER_ASSIGNMENT_SOURCES[number]) ?? 'New Student';

    Alert.alert(
      'Cancel Assignment',
      `Remove volunteer assignment for ${student.StudentName ?? 'this student'}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            cancelMutation.mutate({
              studentId: student.StudentID,
              source,
            });
          },
        },
      ],
    );
  };

  // ── Render helpers ───────────────────────────────────────────────────────

  const renderDistrictDropdown = () => (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowDistrictDropdown(!showDistrictDropdown)}
        activeOpacity={0.8}
      >
        <Ionicons name="location-outline" size={18} color={colors.primary} />
        <Text style={styles.dropdownButtonText} numberOfLines={1}>
          {selectedDistrictId
            ? districts.find((d: SelectListItemDto) => Number(d.Value) === selectedDistrictId)?.Text ?? 'District'
            : 'Select District'}
        </Text>
        <Ionicons
          name={showDistrictDropdown ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {showDistrictDropdown && (
        <ScrollView
          style={styles.dropdownMenu}
          nestedScrollEnabled
          showsVerticalScrollIndicator
        >
          {districts.map((d: SelectListItemDto) => (
            <TouchableOpacity
              key={d.Value}
              style={[
                styles.dropdownItem,
                selectedDistrictId === Number(d.Value) && styles.dropdownItemActive,
              ]}
              onPress={() => handleDistrictSelect(Number(d.Value))}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  selectedDistrictId === Number(d.Value) && styles.dropdownItemTextActive,
                ]}
              >
                {d.Text}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderStudentCard = ({ item }: { item: VolunteerAssignmentStudentDto }) => {
    const isAssigned = Boolean(item.IsAssigned);
    const isVisited = Boolean(item.IsHouseVisitCompleted);

    return (
      <View style={styles.studentCard}>
        {/* Top row: name + status badge */}
        <View style={styles.cardTopRow}>
          <View style={styles.cardNameRow}>
            <Ionicons name="person-circle-outline" size={22} color={colors.primary} />
            <Text style={styles.studentName} numberOfLines={2}>
              {item.StudentName ?? 'Unknown'}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              isVisited
                ? styles.statusVisited
                : isAssigned
                  ? styles.statusAssigned
                  : styles.statusPending,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isVisited
                  ? styles.statusTextVisited
                  : isAssigned
                    ? styles.statusTextAssigned
                    : styles.statusTextPending,
              ]}
            >
              {isVisited ? 'Visited' : isAssigned ? 'Assigned' : 'Pending'}
            </Text>
          </View>
        </View>

        {/* Info grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Ionicons name="call-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.infoText}>{item.ContactNumber ?? '—'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.infoText}>{item.Taluka ?? '—'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="school-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.infoText} numberOfLines={1}>{item.CollegeName ?? '—'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="cash-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.infoText}>
              {item.FamilyIncome != null ? `₹${item.FamilyIncome.toLocaleString()}` : '—'}
            </Text>
          </View>
        </View>

        {/* Assigned volunteer */}
        {isAssigned && item.VolunteerName && (
          <View style={styles.assignedRow}>
            <Ionicons name="person-outline" size={14} color={colors.success} />
            <Text style={styles.assignedText}>Volunteer: {item.VolunteerName}</Text>
          </View>
        )}

        {/* Source badge */}
        <View style={styles.sourceRow}>
          <Text style={styles.sourceText}>Source: {item.Source ?? '—'}</Text>
        </View>

        {/* Action buttons (Assign / Reassign / Cancel) — only for coordinators/admins */}
        {userCanAssign && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, isAssigned ? styles.reassignBtn : styles.assignBtn]}
              onPress={() => handleOpenPicker(item)}
              disabled={isMutating}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isAssigned ? 'swap-horizontal-outline' : 'person-add-outline'}
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.actionBtnText}>
                {isAssigned ? 'Reassign' : 'Assign'}
              </Text>
            </TouchableOpacity>

            {isAssigned && !isVisited && (
              <TouchableOpacity
                style={[styles.actionBtn, styles.cancelBtn]}
                onPress={() => handleCancelAssignment(item)}
                disabled={isMutating}
                activeOpacity={0.7}
              >
                <Ionicons name="remove-circle-outline" size={16} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* House Visit action — only for assigned, not-yet-visited students */}
        {isAssigned && !isVisited && (
          <TouchableOpacity
            style={styles.houseVisitBtn}
            onPress={() => handleHouseVisit(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="home-outline" size={16} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>Create House Visit</Text>
          </TouchableOpacity>
        )}

        {/* View/Edit House Visit — for visited students */}
        {isVisited && (
          <TouchableOpacity
            style={styles.editHouseVisitBtn}
            onPress={() => handleEditHouseVisit(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={16} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>Edit House Visit</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={48} color={colors.textSecondary} />
      <Text style={styles.emptyText}>
        {selectedDistrictId
          ? 'No students pending house visit in this district'
          : 'Select a district to view students'}
      </Text>
    </View>
  );

  const renderError = (message: string) => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
      <Text style={styles.errorText}>{message}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => {
          districtsQuery.refetch();
          if (selectedDistrictId !== undefined) {
            studentsQuery.refetch();
            volunteersQuery.refetch();
          }
        }}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  // ── Main render ──────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Ionicons name={meta.icon} size={20} color="#FFFFFF" style={styles.topBarIcon} />
        <Text style={styles.topBarTitle} numberOfLines={1}>
          {meta.title}
        </Text>
      </View>

      <View style={styles.body}>
        {/* District selector */}
        {districtsQuery.isLoading ? (
          <View style={styles.districtLoading}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.districtLoadingText}>Loading districts...</Text>
          </View>
        ) : districtsQuery.error ? (
          renderError('Failed to load districts')
        ) : (
          renderDistrictDropdown()
        )}

        {/* Students count */}
        {selectedDistrictId !== undefined && !studentsQuery.isLoading && !studentsQuery.error && (
          <Text style={styles.resultsCount}>
            {pendingCount} student{pendingCount !== 1 ? 's' : ''} pending house visit
          </Text>
        )}

        {/* Student list */}
        <FlatList
          data={students}
          renderItem={renderStudentCard}
          keyExtractor={(item, index) => `${item.StudentID}-${index}`}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            studentsQuery.isLoading
              ? undefined
              : studentsQuery.error
                ? renderError('Failed to load students')
                : renderEmpty()
          }
          ListHeaderComponent={
            studentsQuery.isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading students...</Text>
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={studentsQuery.isFetching}
              onRefresh={() => studentsQuery.refetch()}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />

        <AppFooter compact />
      </View>

      {/* Volunteer Picker Modal */}
      <VolunteerPickerModal
        visible={pickerVisible}
        volunteers={volunteers}
        loading={volunteersQuery.isLoading}
        selectedVolunteerId={pickedVolunteerId}
        onSelect={handlePickVolunteer}
        onClose={() => {
          setPickerVisible(false);
          setPickedVolunteerId(null);
          setActiveStudent(null);
        }}
      />

      {/* Confirm button overlay when a volunteer is picked */}
      {pickerVisible && pickedVolunteerId !== null && (
        <View style={styles.confirmOverlay}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmAssignment}
            disabled={isMutating}
            activeOpacity={0.8}
          >
            {isMutating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                <Text style={styles.confirmButtonText}>
                  {activeStudent && Boolean(activeStudent.IsAssigned) ? 'Confirm Reassign' : 'Confirm Assign'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 52,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  topBarIcon: {
    marginRight: spacing.xs,
  },
  topBarTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  body: {
    flex: 1,
    padding: spacing.md,
  },
  // ── District dropdown ──────────────────────────────────────────────────
  dropdownContainer: {
    position: 'relative',
    zIndex: 10,
    marginBottom: spacing.md,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 48,
    gap: spacing.xs,
    ...platform.elevation.card,
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: platform.normalize.fontSize.body,
    color: colors.textPrimary,
  },
  dropdownMenu: {
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xs,
    maxHeight: 220,
    overflow: 'hidden',
    ...platform.elevation.card,
  },
  dropdownItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  dropdownItemActive: {
    backgroundColor: colors.primary + '0A',
  },
  dropdownItemText: {
    fontSize: platform.normalize.fontSize.body,
    color: colors.textPrimary,
  },
  dropdownItemTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  districtLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  districtLoadingText: {
    fontSize: platform.normalize.fontSize.body,
    color: colors.textSecondary,
  },
  // ── Results count ──────────────────────────────────────────────────────
  resultsCount: {
    fontSize: platform.normalize.fontSize.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  // ── Student card ───────────────────────────────────────────────────────
  listContent: {
    paddingBottom: spacing.xl,
  },
  studentCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...platform.elevation.card,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  cardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
  },
  studentName: {
    flex: 1,
    fontSize: platform.normalize.fontSize.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: colors.warning + '20',
  },
  statusAssigned: {
    backgroundColor: colors.primary + '15',
  },
  statusVisited: {
    backgroundColor: colors.success + '20',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusTextPending: {
    color: colors.warning,
  },
  statusTextAssigned: {
    color: colors.primary,
  },
  statusTextVisited: {
    color: colors.success,
  },
  // ── Info grid ──────────────────────────────────────────────────────────
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  // ── Assigned volunteer ─────────────────────────────────────────────────
  assignedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  assignedText: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '500',
  },
  // ── Source ─────────────────────────────────────────────────────────────
  sourceRow: {
    marginBottom: spacing.sm,
  },
  sourceText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  // ── Actions ────────────────────────────────────────────────────────────
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    minHeight: 40,
    flex: 1,
  },
  assignBtn: {
    backgroundColor: colors.primary,
  },
  reassignBtn: {
    backgroundColor: colors.primaryDark,
  },
  cancelBtn: {
    backgroundColor: colors.error,
    flex: 0.6,
  },
  actionBtnText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // ── Empty / Error / Loading ────────────────────────────────────────────
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: platform.normalize.fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    gap: spacing.md,
  },
  errorText: {
    fontSize: platform.normalize.fontSize.body,
    color: colors.error,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: platform.normalize.fontSize.body,
    color: colors.textSecondary,
  },
  // ── Confirm overlay ────────────────────────────────────────────────────
  confirmOverlay: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.md,
    right: spacing.md,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.success,
    borderRadius: 12,
    paddingVertical: spacing.md,
    ...platform.elevation.button,
  },
  confirmButtonText: {
    fontSize: platform.normalize.fontSize.body,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  houseVisitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    minHeight: 40,
    backgroundColor: colors.success,
  },
  editHouseVisitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    minHeight: 40,
    backgroundColor: colors.primary,
  },
  visitedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  visitedRowText: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '500',
  },
});
