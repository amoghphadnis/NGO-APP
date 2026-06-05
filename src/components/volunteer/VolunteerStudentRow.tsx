import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TABLE_WIDTH } from '@/components/approval/StudentRowSkeleton';
import { colors } from '@/theme/colors';
import { StudentListViewModel, StudentType } from '@/types/studentList';

interface VolunteerStudentRowProps {
  student: StudentListViewModel;
  onHouseVisit: (studentId: number, studentType: StudentType) => void;
}

export default function VolunteerStudentRow({ student, onHouseVisit }: VolunteerStudentRowProps) {
  const handleHouseVisit = () => {
    onHouseVisit(student.id, student.studentType);
  };

  return (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.w120]} numberOfLines={2}>{student.name}</Text>
      <Text style={[styles.cell, styles.w100]} numberOfLines={1}>{student.mobile}</Text>
      <Text style={[styles.cell, styles.w140]} numberOfLines={2}>{student.address}</Text>
      <Text style={[styles.cell, styles.w90]}  numberOfLines={1}>{student.taluka}</Text>
      <Text style={[styles.cell, styles.w100]} numberOfLines={1}>{student.district}</Text>
      <Text style={[styles.cell, styles.w80]}  numberOfLines={1}>{student.pinCode}</Text>
      <Text style={[styles.cell, styles.w140]} numberOfLines={2}>{student.college}</Text>
      <Text style={[styles.cell, styles.w90]}  numberOfLines={1}>{student.income}</Text>
      <Text style={[styles.cell, styles.w60]}  numberOfLines={1}>{student.percentage}</Text>
      
      {/* Visit Status */}
      <View style={[styles.cell, styles.w120, styles.statusCell]}>
        {student.isVisited ? (
          <View style={styles.visitedBadge}>
            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            <Text style={styles.visitedText}>Visited</Text>
          </View>
        ) : (
          <Text style={styles.pendingText}>Pending</Text>
        )}
      </View>
      
      {/* House Visit Action */}
      <View style={[styles.actionCell, styles.w140]}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            student.isVisited ? styles.visitedButton : styles.visitButton
          ]}
          onPress={handleHouseVisit}
          activeOpacity={0.8}
          disabled={student.isVisited}
        >
          <Ionicons 
            name={student.isVisited ? "eye" : "home"} 
            size={14} 
            color="#FFFFFF" 
          />
          <Text style={styles.actionButtonText}>
            {student.isVisited ? 'View' : 'Visit'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: TABLE_WIDTH,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  cell: {
    paddingHorizontal: 4,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  statusCell: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  visitedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  visitedText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
  pendingText: {
    fontSize: 12,
    color: colors.warning || '#F59E0B',
    fontWeight: '500',
  },
  actionCell: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minHeight: 32,
    minWidth: 80,
  },
  visitButton: {
    backgroundColor: colors.primary,
  },
  visitedButton: {
    backgroundColor: colors.success,
    opacity: 0.8,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  w60:  { width: 60 },
  w80:  { width: 80 },
  w90:  { width: 90 },
  w100: { width: 100 },
  w120: { width: 120 },
  w140: { width: 140 },
});
