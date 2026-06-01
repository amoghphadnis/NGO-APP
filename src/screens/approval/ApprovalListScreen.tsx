import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import StudentRowSkeleton, { TABLE_WIDTH } from '@/components/approval/StudentRowSkeleton';
import StudentRow, { Student } from '@/components/approval/StudentRow';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

const COLUMNS = [
  { label: 'Name',             width: 120 },
  { label: 'Mobile',           width: 100 },
  { label: 'Address',          width: 140 },
  { label: 'Taluka',           width: 90  },
  { label: 'District',         width: 100 },
  { label: 'Pin Code',         width: 80  },
  { label: 'College',          width: 140 },
  { label: 'Income',           width: 90  },
  { label: '%',                width: 60  },
  { label: 'House Visit Link', width: 120 },
  { label: 'Action',           width: 140 },
];

const SKELETON_COUNT = 5;
const SKELETON_KEYS = Array.from({ length: SKELETON_COUNT }, (_, i) => String(i));

interface Props {
  title: string;
}

export default function ApprovalListScreen({ title }: Props) {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const isLoading = true;
  const students: Student[] = [];

  const handleApprove = (id: Student['id']) => {
    // TODO: wire to POST /api/students/approve
  };

  const handleReject = (id: Student['id']) => {
    // TODO: wire to POST /api/students/reject
  };

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
        <Text style={styles.topBarTitle} numberOfLines={1}>{title}</Text>
      </View>

      <View style={styles.body}>
        {/* Page heading */}
        <Text style={styles.pageHeading}>{title}</Text>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search by student name"
            placeholderTextColor={colors.textSecondary}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchButton} activeOpacity={0.8}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Table — single horizontal scroll wrapping header + list */}
        <View style={styles.tableContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ width: TABLE_WIDTH }}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                {COLUMNS.map(({ label, width }) => (
                  <Text
                    key={label}
                    style={[styles.headerCell, { width }]}
                    numberOfLines={1}
                  >
                    {label}
                  </Text>
                ))}
              </View>

              {/* Rows */}
              {isLoading ? (
                <FlatList
                  data={SKELETON_KEYS}
                  keyExtractor={(item) => item}
                  renderItem={() => <StudentRowSkeleton />}
                  scrollEnabled={false}
                />
              ) : (
                <FlatList
                  data={students}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={({ item }) => (
                    <StudentRow
                      student={item}
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  )}
                  scrollEnabled={false}
                  ListEmptyComponent={
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyText}>No students found.</Text>
                    </View>
                  }
                />
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

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
    gap: spacing.sm,
  },
  backButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    flex: 1,
    fontSize: platform.normalize.fontSize.h3,
    lineHeight: platform.normalize.lineHeight.h3,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  body: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  pageHeading: {
    fontSize: platform.normalize.fontSize.h2,
    lineHeight: platform.normalize.lineHeight.h2,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    fontSize: platform.normalize.fontSize.body,
    color: colors.textPrimary,
    ...Platform.select({
      android: { paddingVertical: 0 },
    }),
  },
  searchButton: {
    height: 44,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: platform.normalize.fontSize.body,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 8,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  tableHeader: {
    flexDirection: 'row',
    width: TABLE_WIDTH,
    backgroundColor: '#1E2A3A',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  headerCell: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: platform.normalize.fontSize.body,
    color: colors.textSecondary,
  },
});
