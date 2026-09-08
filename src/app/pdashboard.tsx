import { dashboardApi } from '@/api/dashboardApi';
import AppFooter from '@/components/common/AppFooter';
import { DASHBOARD_MENU_ITEMS, DASHBOARD_MENU_SECTIONS } from '@/config/appContent';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { DashboardError, DashboardErrorCode, PDashboardResponseDto } from '@/types/dashboard';
import { canCreatePayana } from '@/utils/roleUtils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DRAWER_WIDTH = 280;

interface StatCardConfig {
  label: string;
  field: keyof PDashboardResponseDto['notifications'];
  icon: React.ComponentProps<typeof Ionicons>['name'];
  route: string;
}

const STAT_CARDS: StatCardConfig[] = [
  { label: 'Pending PUC Apps',          field: 'pendingPUC',          icon: 'school-outline',         route: '/approval/puc' },
  { label: 'Pending Payana Apps',       field: 'pendingPayana',        icon: 'bicycle-outline',        route: '/approval/payana' },
  { label: 'Pending Prof Apps',         field: 'pendingProfessional',  icon: 'briefcase-outline',      route: '/approval/professional' },
  { label: 'Pending Semi Prof Apps',    field: 'pendingSemiProfessional', icon: 'book-outline',        route: '/approval/semi-professional' },
];

interface DrawerNavItem {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  badge: number;
  route: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function SkeletonCard() {
  return <View style={styles.skeletonCard} />;
}

interface DrawerProps {
  open: boolean;
  slideAnim: Animated.Value;
  backdropAnim: Animated.Value;
  onClose: () => void;
  onNavigate: (route: string) => void;
  onLogout: () => void;
  user: { UserName: string; Role: string; District: string } | null;
  dashboard: PDashboardResponseDto | null;
}

function DrawerSidebar({
  open,
  slideAnim,
  backdropAnim,
  onClose,
  onNavigate,
  onLogout,
  user,
  dashboard,
}: DrawerProps) {
  const navItems: DrawerNavItem[] = [
    {
      icon: 'school-outline',
      label: 'Pending PUC Apps',
      badge: dashboard?.notifications?.pendingPUC ?? 0,
      route: '/approval/puc',
    },
    {
      icon: 'bicycle-outline',
      label: 'Pending Payana Apps',
      badge: dashboard?.notifications?.pendingPayana ?? 0,
      route: '/approval/payana',
    },
    {
      icon: 'briefcase-outline',
      label: 'Pending Prof Apps',
      badge: dashboard?.notifications?.pendingProfessional ?? 0,
      route: '/approval/professional',
    },
    {
      icon: 'book-outline',
      label: 'Pending Semi Prof Apps',
      badge: dashboard?.notifications?.pendingSemiProfessional ?? 0,
      route: '/approval/semi-professional',
    },
  ];

  const initials = getInitials(user?.UserName ?? 'VP');

  if (!open) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
      >
        <View style={styles.drawerHeader}>
          <View style={styles.drawerAvatar}>
            <Text style={styles.drawerAvatarText}>{initials}</Text>
          </View>
          <Text style={styles.drawerName}>{user?.UserName ?? '—'}</Text>
          <Text style={styles.drawerRole}>{user?.Role ?? '—'}</Text>
          <Text style={styles.drawerDistrict}>Global View</Text>
        </View>

        <ScrollView style={styles.drawerNav} showsVerticalScrollIndicator={false}>
          <Text style={styles.drawerSectionLabel}>{DASHBOARD_MENU_SECTIONS.approvals.toUpperCase()}</Text>
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.drawerItem}
              onPress={() => onNavigate(item.route)}
              activeOpacity={0.7}
            >
              <Ionicons name={item.icon} size={20} color={colors.primary} />
              <Text style={styles.drawerItemLabel}>{item.label}</Text>
              {item.badge > 0 && (
                <View style={styles.drawerBadge}>
                  <Text style={styles.drawerBadgeText}>
                    {item.badge > 99 ? '99+' : String(item.badge)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}

          <View style={styles.drawerDivider} />

          <Text style={styles.drawerSectionLabel}>{DASHBOARD_MENU_SECTIONS.renewals.toUpperCase()}</Text>
          {[
            { ...DASHBOARD_MENU_ITEMS.renewalPuc, icon: 'refresh-outline' as const },
            { ...DASHBOARD_MENU_ITEMS.renewalProfessional, icon: 'refresh-outline' as const },
            { ...DASHBOARD_MENU_ITEMS.renewalPayana, icon: 'refresh-outline' as const },
          ].map((item) => (
            <TouchableOpacity
              key={item.route}
              style={styles.drawerItem}
              onPress={() => onNavigate(item.route)}
              activeOpacity={0.7}
            >
              <Ionicons name={item.icon} size={20} color={colors.success} />
              <Text style={styles.drawerItemLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}

          <View style={styles.drawerDivider} />

          <TouchableOpacity style={styles.drawerItem} onPress={onLogout} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={[styles.drawerItemLabel, { color: colors.error }]}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

export default function PDashboardScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dashboard, setDashboard] = useState<PDashboardResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const openDrawer = useCallback(() => {
    setDrawerOpen(true);
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
      Animated.timing(backdropAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start();
  }, [slideAnim, backdropAnim]);

  const closeDrawer = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: -DRAWER_WIDTH, duration: 240, useNativeDriver: true }),
      Animated.timing(backdropAnim, { toValue: 0, duration: 240, useNativeDriver: true }),
    ]).start(() => setDrawerOpen(false));
  }, [slideAnim, backdropAnim]);

  const handleDrawerNavigate = useCallback(
    (route: string) => {
      closeDrawer();
      setTimeout(() => (router.push as any)(route), 260);
    },
    [closeDrawer, router],
  );

  const handleDrawerLogout = useCallback(() => {
    closeDrawer();
    setTimeout(() => {
      logout();
      router.replace('/');
    }, 260);
  }, [closeDrawer, logout, router]);

  const fetchDashboard = useCallback(async () => {
    try {
      setError(null);
      const data = await dashboardApi.getPDashboard();
      setDashboard(data);
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
        setError('Unable to load dashboard. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [logout, router]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboard();
  }, [fetchDashboard]);

  const getCountForCard = (field: StatCardConfig['field']): number => {
    return dashboard?.notifications?.[field] ?? 0;
  };

  const renderStatCard = ({ item }: { item: StatCardConfig }) => (
    <TouchableOpacity
      style={styles.statCard}
      onPress={() => (router.push as any)(item.route)}
      activeOpacity={0.75}
    >
      <Ionicons name={item.icon} size={24} color={colors.primary} style={styles.statIcon} />
      <Text style={styles.statCount}>
        {loading ? '—' : String(getCountForCard(item.field))}
      </Text>
      <Text style={styles.statLabel}>{item.label}</Text>
      <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} style={styles.statChevron} />
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>
          {user?.Role ?? '—'} Dashboard
        </Text>
        <Text style={styles.welcomeSub}>
          Welcome, {user?.UserName ?? '—'}!  ·  Global View
        </Text>
      </View>

      {error && (
        <View style={styles.errorCard}>
          <Ionicons name="alert-circle-outline" size={20} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchDashboard} style={styles.retryButton} activeOpacity={0.7}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && !refreshing && (
        <View style={styles.skeletonGrid}>
          {Array.from({ length: 7 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      )}

      {!loading && !error && canCreatePayana(user?.Role) && (
        <>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => (router.push as any)(DASHBOARD_MENU_ITEMS.newPayana.route)}
            activeOpacity={0.75}
          >
            <Ionicons name="star-outline" size={24} color={colors.primary} />
            <Text style={styles.quickActionLabel}>{DASHBOARD_MENU_ITEMS.newPayana.label}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </>
      )}

      {!loading && !error && (
        <Text style={styles.sectionTitle}>Pending Approvals</Text>
      )}
    </>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <AppFooter compact />
      <Text style={styles.footerCopyright}>Copyright © Vidya Poshak 2026</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topBarIcon} onPress={openDrawer} activeOpacity={0.7}>
          <Ionicons name="menu-outline" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.brandName}>Vidya Poshak</Text>

        <TouchableOpacity
          style={styles.topBarIcon}
          onPress={() => (router.push as any)('/notifications')}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <FlatList
          data={!loading && !error ? STAT_CARDS : []}
          keyExtractor={(item) => item.field}
          renderItem={renderStatCard}
          numColumns={2}
          ListHeaderComponent={renderHeader}
          columnWrapperStyle={styles.columnWrapper}
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
          style={styles.flatList}
        />
        
        {/* Sticky Footer */}
        {renderFooter()}
      </View>

      <DrawerSidebar
        open={drawerOpen}
        slideAnim={slideAnim}
        backdropAnim={backdropAnim}
        onClose={closeDrawer}
        onNavigate={handleDrawerNavigate}
        onLogout={handleDrawerLogout}
        user={user}
        dashboard={dashboard}
      />
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
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    minHeight: 52,
  },
  brandName: {
    fontSize: platform.normalize.fontSize.h3,
    lineHeight: platform.normalize.lineHeight.h3,
    color: '#FFFFFF',
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  topBarIcon: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  columnWrapper: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  welcomeCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  welcomeTitle: {
    fontSize: platform.normalize.fontSize.h2,
    lineHeight: platform.normalize.lineHeight.h2,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  welcomeSub: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: platform.normalize.fontSize.h3,
    lineHeight: platform.normalize.lineHeight.h3,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  statIcon: { marginBottom: spacing.xs },
  statCount: {
    fontSize: platform.normalize.fontSize.h1,
    lineHeight: platform.normalize.lineHeight.h1,
    color: colors.primary,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: platform.normalize.fontSize.small,
    lineHeight: platform.normalize.lineHeight.small,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  statChevron: { marginTop: spacing.xs },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  skeletonCard: {
    width: '47%',
    height: 100,
    backgroundColor: colors.border,
    borderRadius: 12,
    opacity: 0.5,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  errorText: {
    flex: 1,
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.error,
  },
  retryButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.error,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: platform.normalize.fontSize.caption,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  footerContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerCopyright: {
    fontSize: platform.normalize.fontSize.small,
    lineHeight: platform.normalize.lineHeight.small,
    color: colors.textSecondary,
  },
  // ── Drawer ──────────────────────────────────────────────
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: colors.card,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.18, shadowRadius: 16 },
      android: { elevation: 16 },
    }),
  },
  drawerHeader: {
    backgroundColor: colors.primary,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  drawerAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  drawerAvatarText: { fontSize: 26, fontWeight: '700', color: '#FFFFFF' },
  drawerName: {
    fontSize: platform.normalize.fontSize.h3,
    lineHeight: platform.normalize.lineHeight.h3,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
  },
  drawerRole: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
    textAlign: 'center',
  },
  drawerDistrict: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
    textAlign: 'center',
  },
  drawerNav: { flex: 1, paddingTop: spacing.sm },
  drawerSectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    gap: spacing.md,
    minHeight: 48,
  },
  drawerItemLabel: { flex: 1, fontSize: 15, color: colors.textPrimary, fontWeight: '500' },
  drawerBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  drawerBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  drawerDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  quickActionLabel: {
    flex: 1,
    fontSize: platform.normalize.fontSize.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
});
