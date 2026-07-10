import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { dashboardApi } from '@/api/dashboardApi';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import {
  DashboardError,
  DashboardErrorCode,
  DashboardResponseDto
} from '@/types/dashboard';

interface NotificationItem {
  id: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  count: number;
  route: string;
  color: string;
}

const P_MANAGER_ROLES = ['Program Manager', 'Admin', 'Admin(CEO)'];

export default function NotificationsScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const isPManager = user ? P_MANAGER_ROLES.includes(user.Role) : false;

  const fetchNotifications = useCallback(async () => {
    try {
      setError(null);
      const data = isPManager
        ? await dashboardApi.getPDashboard()
        : await dashboardApi.getDashboard();

      const items: NotificationItem[] = [
        {
          id: 'pendingPUC',
          icon: 'school-outline',
          title: 'Pending PUC Approvals',
          count: data.PendingPUC ?? 0,
          route: '/approval/puc',
          color: colors.primary,
        },
        {
          id: 'pendingPayana',
          icon: 'bicycle-outline',
          title: 'Pending Payana Approvals',
          count: data.PendingPayana ?? 0,
          route: '/approval/payana',
          color: colors.primary,
        },
        {
          id: 'pendingProfessional',
          icon: 'briefcase-outline',
          title: 'Pending Professional Approvals',
          count: data.PendingProfessional ?? 0,
          route: '/approval/professional',
          color: colors.primary,
        },
        {
          id: 'pendingSemiProfessional',
          icon: 'book-outline',
          title: 'Pending Semi Professional Approvals',
          count: data.PendingSemiProfessional ?? 0,
          route: '/approval/semi-professional',
          color: colors.primary,
        },
        {
          id: 'pendingHousePUC',
          icon: 'home-outline',
          title: 'Pending PUC House Visits',
          count: data.PendingHousePUC ?? 0,
          route: '/volunteer/puc',
          color: colors.warning,
        },
        {
          id: 'pendingHousePayana',
          icon: 'home-outline',
          title: 'Pending Payana House Visits',
          count: data.PendingHousePayana ?? 0,
          route: '/volunteer/payana',
          color: colors.warning,
        },
        {
          id: 'pendingPUCRenewal',
          icon: 'refresh-outline',
          title: 'Pending PUC Renewals',
          count: data.PendingPUCRenewal ?? 0,
          route: '/renewal-puc',
          color: colors.warning,
        },
        {
          id: 'pendingPayanaRenewal',
          icon: 'refresh-outline',
          title: 'Pending Payana Renewals',
          count: data.PendingPayanaRenewal ?? 0,
          route: '/renewal-payana',
          color: colors.warning,
        },
      ];

      // Only show Visit Assignment notifications for dashboard (non-pmanager) users
      if (!isPManager) {
        const dashData = data as DashboardResponseDto;
        items.push(
          {
            id: 'pendingVisitPUC',
            icon: 'walk-outline',
            title: 'Pending Visit Assignments (PUC)',
            count: dashData.PendingVisitPUC ?? 0,
            route: '/volunteer/puc',
            color: colors.error,
          },
          {
            id: 'pendingVisitPayana',
            icon: 'walk-outline',
            title: 'Pending Visit Assignments (Payana)',
            count: dashData.PendingVisitPayana ?? 0,
            route: '/volunteer/payana',
            color: colors.error,
          }
        );
      }

      // Filter out zero-count items
      setNotifications(items.filter((item) => item.count > 0));
    } catch (e) {
      if (e instanceof DashboardError) {
        if (
          e.code === DashboardErrorCode.SESSION_EXPIRED ||
          e.code === DashboardErrorCode.SESSION_INVALID
        ) {
          logout();
          router.replace('/');
          return;
        }
        setError(e.message);
      } else {
        setError('Unable to load notifications. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isPManager, logout, router]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationPress = (route: string) => {
    router.push(route as any);
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      style={styles.notificationCard}
      onPress={() => handleNotificationPress(item.route)}
      activeOpacity={0.75}
    >
      <View style={[styles.notificationIcon, { backgroundColor: item.color + '15' }]}>
        <Ionicons name={item.icon} size={22} color={item.color} />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationSub}>
          {item.count} pending item{item.count !== 1 ? 's' : ''}
        </Text>
      </View>
      <View style={styles.notificationBadge}>
        <Text style={styles.notificationBadgeText}>{item.count}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off-outline" size={56} color={colors.primary} />
      <Text style={styles.emptyHeading}>No Notifications</Text>
      <Text style={styles.emptySub}>
        You're all caught up! New notifications will appear here.
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
      <Text style={styles.errorText}>
        {error || 'Failed to load notifications'}
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={fetchNotifications}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        renderError()
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}
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
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
    ...platform.elevation.card,
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  notificationSub: {
    fontSize: platform.normalize.fontSize.small,
    lineHeight: platform.normalize.lineHeight.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  notificationBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minWidth: 28,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  emptyHeading: {
    fontSize: platform.normalize.fontSize.h2,
    lineHeight: platform.normalize.lineHeight.h2,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  emptySub: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  errorText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.error,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: platform.normalize.fontSize.body,
    fontWeight: '600',
  },
});
