import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import StudentRowSkeleton, { TABLE_WIDTH } from '@/components/approval/StudentRowSkeleton';
import VolunteerStudentRow from '@/components/volunteer/VolunteerStudentRow';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';
import {
  StudentType,
  StudentListViewModel,
  StudentListQueryParams,
  District,
} from '@/types/studentList';
import { professionalStudentApi } from '@/api/professionalStudentApi';
import { pucStudentApi } from '@/api/pucStudentApi';
import { houseVisitApi } from '@/api/houseVisitApi';

// ============================================================================
// Types
// ============================================================================

interface StudentListScreenProps {
  studentType: StudentType;
  title: string;
}

// ============================================================================
// Columns Configuration
// ============================================================================

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
  { label: 'Visit Status',     width: 120 },
  { label: 'Action',           width: 140 },
];

const SKELETON_COUNT = 5;
const SKELETON_KEYS = Array.from({ length: SKELETON_COUNT }, (_, i) => `skeleton-${i}`);

// ============================================================================
// Helper Functions
// ============================================================================

function formatIncome(income: number): string {
  return `₹${income.toLocaleString()}`;
}

function formatPercentage(percentage: number): string {
  return percentage.toFixed(1);
}

function mapToViewModel(
  student: any,
  studentType: StudentType
): StudentListViewModel {
  return {
    id: student.studentID,
    name: student.studentName,
    mobile: student.contactNumber,
    address: student.address,
    place: student.place,
    taluka: student.taluka,
    pinCode: student.pinCode,
    district: student.districtName,
    college: student.collegeName,
    income: formatIncome(student.familyIncome),
    percentage: formatPercentage(student.securedPercentage),
    isVisited: student.isVisited,
    houseVisitLink: student.houseVisitLink,
    studentType,
  };
}

// ============================================================================
// Main Component
// ============================================================================

export default function StudentListScreen({ studentType, title }: StudentListScreenProps) {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | undefined>();
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);

  // Build query params
  const queryParams: StudentListQueryParams = {
    ...(searchText && { search: searchText }),
    ...(selectedDistrictId !== undefined && { districtId: selectedDistrictId }),
  };

  // Fetch student list
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: studentType === 'professional' 
      ? professionalStudentApi.queryKeys.list(queryParams)
      : pucStudentApi.queryKeys.list(queryParams),
    queryFn: () => studentType === 'professional'
      ? professionalStudentApi.getList(queryParams)
      : pucStudentApi.getList(queryParams),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  });

  const students: StudentListViewModel[] = data?.students.map((s) => 
    mapToViewModel(s, studentType)
  ) || [];
  
  const districts: District[] = data?.districts || [];

  // Handle house visit navigation
  const handleHouseVisit = useCallback((studentId: number, type: StudentType) => {
    const link = houseVisitApi.getLink(studentId, type);
    router.push(link as any);
  }, [router]);

  // Handle search
  const handleSearch = () => {
    // Search is debounced automatically via useQuery
    refetch();
  };

  // Handle district selection
  const handleDistrictSelect = (districtId: number | undefined) => {
    setSelectedDistrictId(districtId);
    setShowDistrictDropdown(false);
    refetch();
  };

  // Render table header
  const renderHeader = () => (
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
  );

  // Render student row
  const renderStudentRow = ({ item }: { item: StudentListViewModel }) => (
    <VolunteerStudentRow
      student={item}
      onHouseVisit={handleHouseVisit}
    />
  );

  // Render skeleton loading
  const renderSkeleton = () => (
    <>
      {SKELETON_KEYS.map((key) => (
        <StudentRowSkeleton key={key} />
      ))}
    </>
  );

  // Render empty state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={48} color={colors.textSecondary} />
      <Text style={styles.emptyText}>
        {searchText || selectedDistrictId
          ? 'No students found matching your filters'
          : 'No students assigned to you'}
      </Text>
      {(searchText || selectedDistrictId) && (
        <TouchableOpacity
          style={styles.clearFiltersButton}
          onPress={() => {
            setSearchText('');
            setSelectedDistrictId(undefined);
            refetch();
          }}
        >
          <Text style={styles.clearFiltersText}>Clear Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Render error state
  const renderError = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
      <Text style={styles.errorText}>
        {error instanceof Error ? error.message : 'Failed to load students'}
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

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

        {/* Search & Filter Row */}
        <View style={styles.filterRow}>
          {/* Search Input */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search by student name"
              placeholderTextColor={colors.textSecondary}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
                <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* District Filter Dropdown */}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowDistrictDropdown(!showDistrictDropdown)}
              activeOpacity={0.8}
            >
              <Text style={styles.dropdownButtonText} numberOfLines={1}>
                {selectedDistrictId 
                  ? districts.find(d => d.districtID === selectedDistrictId)?.districtName || 'District'
                  : 'All Districts'}
              </Text>
              <Ionicons 
                name={showDistrictDropdown ? "chevron-up" : "chevron-down"} 
                size={16} 
                color={colors.textPrimary} 
              />
            </TouchableOpacity>

            {/* Dropdown Menu */}
            {showDistrictDropdown && districts.length > 0 && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    selectedDistrictId === undefined && styles.dropdownItemActive
                  ]}
                  onPress={() => handleDistrictSelect(undefined)}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    selectedDistrictId === undefined && styles.dropdownItemTextActive
                  ]}>
                    All Districts
                  </Text>
                </TouchableOpacity>
                {districts.map((district) => (
                  <TouchableOpacity
                    key={district.districtID}
                    style={[
                      styles.dropdownItem,
                      selectedDistrictId === district.districtID && styles.dropdownItemActive
                    ]}
                    onPress={() => handleDistrictSelect(district.districtID)}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      selectedDistrictId === district.districtID && styles.dropdownItemTextActive
                    ]}>
                      {district.districtName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Results Count */}
        {!isLoading && !error && (
          <Text style={styles.resultsCount}>
            {students.length} student{students.length !== 1 ? 's' : ''} found
          </Text>
        )}

        {/* Table */}
        <View style={styles.tableContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={{ width: TABLE_WIDTH }}>
              {/* Table Header */}
              {renderHeader()}

              {/* Content */}
              {isLoading ? (
                renderSkeleton()
              ) : error ? (
                renderError()
              ) : students.length === 0 ? (
                renderEmpty()
              ) : (
                <FlatList
                  data={students}
                  renderItem={renderStudentRow}
                  keyExtractor={(item) => item.id.toString()}
                  refreshControl={
                    <RefreshControl
                      refreshing={isFetching}
                      onRefresh={refetch}
                      colors={[colors.primary]}
                      tintColor={colors.primary}
                    />
                  }
                  contentContainerStyle={styles.listContent}
                />
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ============================================================================
// Styles
// ============================================================================

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
    ...platform.elevation.card,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  topBarTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  body: {
    flex: 1,
    padding: spacing.md,
  },
  pageHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    zIndex: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    height: 44,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  clearButton: {
    padding: spacing.xs,
  },
  dropdownContainer: {
    width: 150,
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    height: 44,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.xs,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    ...platform.elevation.card,
    maxHeight: 200,
    zIndex: 100,
  },
  dropdownItem: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  dropdownItemActive: {
    backgroundColor: colors.primary + '10',
  },
  dropdownItemText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  dropdownItemTextActive: {
    color: colors.primary,
    fontWeight: '500',
  },
  resultsCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '10',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerCell: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    paddingHorizontal: 4,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  clearFiltersButton: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  clearFiltersText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    gap: spacing.md,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
