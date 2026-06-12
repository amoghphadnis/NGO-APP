import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StudentListViewModel } from '@/types/studentList';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface StudentDetailModalProps {
  visible: boolean;
  student: StudentListViewModel | null;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export default function StudentDetailModal({ visible, student, onClose }: StudentDetailModalProps) {
  if (!student) return null;

  const DetailRow = ({ label, value, icon }: { label: string; value: string; icon?: string }) => (
    <View style={styles.detailRow}>
      <View style={styles.labelContainer}>
        {icon && <Ionicons name={icon as any} size={16} color={colors.primary} style={styles.icon} />}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value} numberOfLines={3}>{value || '—'}</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Student Details</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={true}
          >
            {/* Student Name Card */}
            <View style={styles.nameCard}>
              <Ionicons name="person-circle" size={60} color={colors.primary} />
              <Text style={styles.studentName}>{student.name}</Text>
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{student.studentType.toUpperCase()}</Text>
              </View>
            </View>

            {/* Visit Status */}
            <View style={[styles.statusCard, student.isVisited ? styles.visitedCard : styles.pendingCard]}>
              <Ionicons
                name={student.isVisited ? "checkmark-circle" : "time"}
                size={24}
                color={student.isVisited ? colors.success : colors.warning}
              />
              <Text style={[styles.statusText, student.isVisited ? styles.visitedText : styles.pendingText]}>
                {student.isVisited ? 'House Visit Completed' : 'House Visit Pending'}
              </Text>
            </View>

            {/* Details Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <DetailRow label="Mobile" value={student.mobile} icon="call" />
              <DetailRow label="Address" value={student.address} icon="location" />
              <DetailRow label="Place" value={student.place} icon="map" />
              <DetailRow label="Taluka" value={student.taluka} icon="navigate" />
              <DetailRow label="District" value={student.district} icon="business" />
              <DetailRow label="Pin Code" value={student.pinCode} icon="mail" />
            </View>

            {/* Education Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education Details</Text>
              <DetailRow label="College" value={student.college} icon="school" />
              <DetailRow label="Percentage" value={student.percentage} icon="trending-up" />
            </View>

            {/* Financial Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Financial Information</Text>
              <DetailRow label="Family Income" value={student.income} icon="cash" />
            </View>

            {/* House Visit Link */}
            {student.houseVisitLink && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>House Visit</Text>
                <DetailRow label="Link" value={student.houseVisitLink} icon="link" />
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.background,
    marginTop: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeButton: {
    padding: spacing.xs,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  nameCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  typeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    marginTop: spacing.sm,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  visitedCard: {
    backgroundColor: '#ECFDF5',
  },
  pendingCard: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  visitedText: {
    color: colors.success,
  },
  pendingText: {
    color: colors.warning,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.4,
  },
  icon: {
    marginRight: spacing.xs,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 0.6,
    textAlign: 'right',
  },
});
