/**
 * Volunteer Picker Modal
 *
 * Bottom-sheet style modal for selecting a volunteer to assign/reassign.
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { SelectListItemDto } from '@/types/payana';

interface VolunteerPickerModalProps {
  visible: boolean;
  volunteers: SelectListItemDto[];
  loading: boolean;
  selectedVolunteerId: number | null;
  onSelect: (volunteer: SelectListItemDto) => void;
  onClose: () => void;
}

export default function VolunteerPickerModal({
  visible,
  volunteers,
  loading,
  selectedVolunteerId,
  onSelect,
  onClose,
}: VolunteerPickerModalProps) {
  const [search, setSearch] = useState('');

  const filtered = volunteers.filter((v) =>
    v.Text.toLowerCase().includes(search.toLowerCase()),
  );

  const renderItem = ({ item }: { item: SelectListItemDto }) => (
    <TouchableOpacity
      style={[
        styles.volunteerItem,
        Number(item.Value) === selectedVolunteerId && styles.volunteerItemSelected,
      ]}
      onPress={() => onSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.volunteerAvatar}>
        <Text style={styles.volunteerAvatarText}>
          {item.Text.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={styles.volunteerName}>{item.Text}</Text>
      <Ionicons
        name={Number(item.Value) === selectedVolunteerId ? 'checkmark-circle' : 'radio-button-off'}
        size={22}
        color={Number(item.Value) === selectedVolunteerId ? colors.primary : colors.textSecondary}
      />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Volunteer</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Search volunteer by name"
              placeholderTextColor={colors.textSecondary}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* List */}
          {loading ? (
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>Loading volunteers...</Text>
            </View>
          ) : filtered.length === 0 ? (
            <View style={styles.messageContainer}>
              <Ionicons name="people-outline" size={40} color={colors.textSecondary} />
              <Text style={styles.messageText}>
                {search ? 'No volunteers match your search' : 'No volunteers available for this district'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filtered}
              renderItem={renderItem}
              keyExtractor={(item) => item.Value}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: platform.normalize.fontSize.h3,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: spacing.md,
    backgroundColor: colors.background,
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
  listContent: {
    paddingHorizontal: spacing.md,
  },
  volunteerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  volunteerItemSelected: {
    backgroundColor: colors.primary + '0A',
  },
  volunteerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  volunteerAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  volunteerName: {
    flex: 1,
    fontSize: platform.normalize.fontSize.body,
    color: colors.textPrimary,
  },
  messageContainer: {
    paddingVertical: spacing.xl * 2,
    alignItems: 'center',
    gap: spacing.sm,
  },
  messageText: {
    fontSize: platform.normalize.fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
