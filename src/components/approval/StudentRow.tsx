import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TABLE_WIDTH } from './StudentRowSkeleton';
import { colors } from '@/theme/colors';

export interface Student {
  id: string | number;
  name: string;
  mobile: string;
  address: string;
  taluka: string;
  district: string;
  pinCode: string;
  college: string;
  income: string;
  percentage: string;
  houseVisitLink: string;
}

interface StudentRowProps {
  student: Student;
  onApprove: (id: Student['id']) => void;
  onReject: (id: Student['id']) => void;
}

export default function StudentRow({ student, onApprove, onReject }: StudentRowProps) {
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
      <Text style={[styles.cell, styles.w120]} numberOfLines={1}>{student.houseVisitLink}</Text>
      <View style={[styles.actionCell, styles.w140]}>
        <TouchableOpacity
          style={[styles.actionButton, styles.approveButton]}
          onPress={() => onApprove(student.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.approveText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={() => onReject(student.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.rejectText}>Reject</Text>
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
  actionCell: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    gap: 6,
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    minHeight: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: colors.success,
  },
  rejectButton: {
    backgroundColor: colors.error,
  },
  approveText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  rejectText: {
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
