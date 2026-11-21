/**
 * Semi Professional Courses Screen
 *
 * Web menu: "Semi Professional Courses" admin page.
 * CRUD over /api/semi-professional-courses.
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

import { semiProfessionalCoursesApi } from '@/api/semiProfessionalCoursesApi';
import AppFooter from '@/components/common/AppFooter';
import VPInputField from '@/components/common/VPInputField';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { SemiProfessionalCourseDto } from '@/types/semiProfessionalCourses';
import { canManageSettings } from '@/utils/roleUtils';
import { safeGoBack } from '@/utils/navigateToDashboard';

export default function SemiProfessionalCoursesScreen() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [editing, setEditing] = useState<SemiProfessionalCourseDto | 'new' | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const userCanManage = canManageSettings(user?.Role);

  const listQuery = useQuery({
    queryKey: semiProfessionalCoursesApi.queryKeys.list(),
    queryFn: () => semiProfessionalCoursesApi.list(),
    enabled: userCanManage,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => semiProfessionalCoursesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semiProfessionalCourses'] });
      Alert.alert('Success', 'Course deleted.');
    },
    onError: (err: any) =>
      Alert.alert('Error', err?.message || 'Failed to delete course'),
  });

  const courses: SemiProfessionalCourseDto[] = listQuery.data?.data || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await listQuery.refetch();
    setRefreshing(false);
  };

  const confirmDelete = (course: SemiProfessionalCourseDto) => {
    Alert.alert('Delete Course', `Delete "${course.CourseName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteMutation.mutate(course.CourseId),
      },
    ]);
  };

  const renderItem = ({ item }: { item: SemiProfessionalCourseDto }) => (
    <View style={styles.card}>
      <View style={styles.cardBody}>
        <Text style={styles.courseName} numberOfLines={2}>
          {item.CourseName}
        </Text>
        <Text style={styles.subText}>ID: {item.CourseId}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => setEditing(item)}
        >
          <Ionicons name="create-outline" size={18} color={colors.card} />
          <Text style={styles.actionBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => confirmDelete(item)}
          disabled={deleteMutation.isPending}
        >
          <Ionicons name="trash-outline" size={18} color={colors.card} />
          <Text style={styles.actionBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!userCanManage) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.centerContainer}>
          <Ionicons name="lock-closed-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.errorText}>
            You do not have access to manage courses.
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
          <Text style={styles.loadingText}>Loading courses...</Text>
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
            {listQuery.error?.message || 'Failed to load courses'}
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
            <Text style={styles.headerTitle}>Semi Professional Courses</Text>
            <Text style={styles.headerSubtitle}>
              {courses.length} course{courses.length === 1 ? '' : 's'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setEditing('new')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Add course"
          >
            <Ionicons name="add-circle" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.CourseId.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="school-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No courses found</Text>
          </View>
        }
      />

      <CourseModal
        key={editing === 'new' ? 'new' : editing?.CourseId ?? 'closed'}
        course={editing === 'new' ? null : editing}
        visible={editing !== null}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          queryClient.invalidateQueries({ queryKey: ['semiProfessionalCourses'] });
        }}
      />

      <AppFooter />
    </SafeAreaView>
  );
}

interface CourseModalProps {
  course: SemiProfessionalCourseDto | null;
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
}

function CourseModal({ course, visible, onClose, onSaved }: CourseModalProps) {
  const [name, setName] = useState(course?.CourseName ?? '');

  const saveMutation = useMutation({
    mutationFn: (courseName: string) =>
      course
        ? semiProfessionalCoursesApi.update({
            CourseId: course.CourseId,
            CourseName: courseName,
          })
        : semiProfessionalCoursesApi.create({ CourseName: courseName }),
    onSuccess: () => {
      Alert.alert('Success', course ? 'Course updated.' : 'Course added.');
      onSaved();
    },
    onError: (err: any) =>
      Alert.alert('Error', err?.message || 'Failed to save course'),
  });

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Missing details', 'Course name is required.');
      return;
    }
    saveMutation.mutate(name.trim());
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {course ? 'Edit Course' : 'Add Course'}
          </Text>
          <VPInputField
            label="Course Name"
            value={name}
            onChangeText={setName}
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
  addButton: {
    padding: spacing.xs,
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
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
  courseName: {
    fontSize: platform.normalize.fontSize.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  subText: {
    fontSize: platform.normalize.fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
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
  deleteBtn: {
    backgroundColor: colors.error,
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
