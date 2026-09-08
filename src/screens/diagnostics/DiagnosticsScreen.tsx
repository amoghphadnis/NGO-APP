import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppFooter from '@/components/common/AppFooter';
import { clearEvents, loadEvents, exportDiagnostics } from '@/diagnostics';
import { getAppVersion, getBuildNumber, getSessionId, flushNow } from '@/diagnostics';
import { DiagnosticEvent } from '@/diagnostics/diagnosticTypes';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';

const LEVEL_COLORS: Record<string, string> = {
  error: colors.error,
  warn: colors.warning,
  info: colors.textSecondary,
  debug: colors.textSecondary,
};

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  } catch {
    return iso;
  }
}

export default function DiagnosticsScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<DiagnosticEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      // Flush any pending buffered events first.
      await flushNow();
      const all = await loadEvents();
      // Display newest-first (last 100).
      const recent = all.slice(-100).reverse();
      setEvents(recent);
    } catch {
      // Best-effort.
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEvents();
  }, [fetchEvents]);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      await exportDiagnostics();
    } finally {
      setExporting(false);
    }
  }, []);

  const handleClear = useCallback(() => {
    Alert.alert(
      'Clear Diagnostics',
      'This will permanently delete all recorded diagnostic events on this device. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearEvents();
            setEvents([]);
          },
        },
      ]
    );
  }, []);

  const renderItem = ({ item }: { item: DiagnosticEvent }) => {
    const levelColor = LEVEL_COLORS[item.level] || colors.textSecondary;
    return (
      <View style={styles.eventRow}>
        <Text style={styles.eventTime}>{formatTime(item.timestamp)}</Text>
        <Text style={[styles.eventLevel, { color: levelColor }]}>
          {item.level.toUpperCase()}
        </Text>
        <Text style={styles.eventCategory}>{item.category}</Text>
        <Text style={styles.eventName} numberOfLines={1}>{item.event}</Text>
        {(item.method || item.endpoint) && (
          <Text style={styles.eventMeta} numberOfLines={1}>
            {item.method || ''} {item.endpoint || ''}
            {item.statusCode !== undefined ? ` ${item.statusCode}` : ''}
            {item.durationMs !== undefined ? ` ${item.durationMs}ms` : ''}
          </Text>
        )}
        {item.requestId && (
          <Text style={styles.eventMeta} numberOfLines={1}>{item.requestId}</Text>
        )}
        {item.submissionId && (
          <Text style={styles.eventMeta} numberOfLines={1}>{item.submissionId}</Text>
        )}
        {item.errorCode && (
          <Text style={styles.eventMeta} numberOfLines={1}>[{item.errorCode}]</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Diagnostics</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>App Version</Text>
          <Text style={styles.infoValue}>{getAppVersion()} ({getBuildNumber()})</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Session</Text>
          <Text style={styles.infoValue}>{getSessionId()}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Platform</Text>
          <Text style={styles.infoValue}>{Platform.OS}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Events (last 100)</Text>
          <Text style={styles.infoValue}>{events.length}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.exportButton]}
          onPress={handleExport}
          disabled={exporting}
          activeOpacity={0.7}
        >
          {exporting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Ionicons name="share-outline" size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Export</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.clearButton]}
          onPress={handleClear}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={18} color={colors.error} />
          <Text style={[styles.actionButtonText, { color: colors.error }]}>Clear</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No diagnostic events recorded.</Text>
            </View>
          }
        />
      )}

      <AppFooter />
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
    fontSize: platform.normalize.fontSize.h3,
    lineHeight: platform.normalize.lineHeight.h3,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    minWidth: 44,
  },
  infoCard: {
    backgroundColor: colors.card,
    margin: spacing.md,
    borderRadius: 12,
    padding: spacing.md,
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  infoLabel: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    minWidth: 120,
    justifyContent: 'center',
  },
  exportButton: {
    backgroundColor: colors.primary,
  },
  clearButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.error,
  },
  actionButtonText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  eventRow: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.xs,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.xs,
  },
  eventTime: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.textSecondary,
    fontFamily: Platform.select({ android: 'monospace', ios: 'Menlo' }),
  },
  eventLevel: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    fontWeight: '700',
    minWidth: 44,
  },
  eventCategory: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.primary,
    fontWeight: '500',
    minWidth: 80,
  },
  eventName: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  eventMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: Platform.select({ android: 'monospace', ios: 'Menlo' }),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
  },
});
