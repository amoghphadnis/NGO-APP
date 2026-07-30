import { dashboardApi } from '@/api/dashboardApi';
import { payanaStudentApi } from '@/api/payanaStudentApi';
import { professionalStudentApi } from '@/api/professionalStudentApi';
import { pucStudentApi } from '@/api/pucStudentApi';
import { semiProfessionalStudentApi } from '@/api/semiProfessionalStudentApi';
import AppFooter from '@/components/common/AppFooter';
import { DASHBOARD_MENU_ITEMS, DASHBOARD_MENU_SECTIONS } from '@/config/appContent';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { DashboardError, DashboardErrorCode, DashboardResponseDto } from '@/types/dashboard';
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
  field: keyof Omit<DashboardResponseDto, 'Name' | 'Role' | 'District'>;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  route: string;
}

const STAT_CARDS: StatCardConfig[] = [
  { label: 'Pending PUC',          field: 'PendingPUC',          icon: 'school-outline',         route: '/approval/puc' },
  { label: 'Pending Payana',       field: 'PendingPayana',        icon: 'bicycle-outline',        route: '/approval/payana' },
  { label: 'Pending Professional', field: 'PendingProfessional',  icon: 'briefcase-outline',      route: '/approval/professional' },
  { label: 'Pending Semi Prof',    field: 'PendingSemiProfessional', icon: 'book-outline',        route: '/approval/semi-professional' },
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

interface RealTimeCounts {
  pendingPUC: number;
  pendingPayana: number;
  pendingProfessional: number;
  pendingSemiProfessional: number;
}

interface DrawerProps {
  open: boolean;
  slideAnim: Animated.Value;
  backdropAnim: Animated.Value;
  onClose: () => void;
  onNavigate: (route: string) => void;
  onLogout: () => void;
  user: { UserName: string; Role: string; District: string } | null;
  dashboard: DashboardResponseDto | null;
  realTimeCounts: RealTimeCounts;
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
  realTimeCounts,
}: DrawerProps) {
  const navItems: DrawerNavItem[] = [
    {
      icon: 'school-outline',
      label: 'Pending PUC',
      badge: realTimeCounts.pendingPUC,
      route: '/approval/puc',
    },
    {
      icon: 'bicycle-outline',
      label: 'Pending Payana',
      badge: realTimeCounts.pendingPayana,
      route: '/approval/payana',
    },
    {
      icon: 'briefcase-outline',
      label: 'Pending Professional',
      badge: realTimeCounts.pendingProfessional,
      route: '/approval/professional',
    },
    {
      icon: 'book-outline',
      label: 'Pending Semi Prof',
      badge: realTimeCounts.pendingSemiProfessional,
      route: '/approval/semi-professional',
    },
  ];

  const initials = getInitials(user?.UserName ?? 'VP');

  if (!open) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]} />
      </TouchableWithoutFeedback>

      {/* Drawer panel */}
      <Animated.View
        style={[
          styles.drawer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        {/* Header */}
        <View style={styles.drawerHeader}>
          <View style={styles.drawerAvatar}>
            <Text style={styles.drawerAvatarText}>{initials}</Text>
          </View>
          <Text style={styles.drawerName}>{user?.UserName ?? '—'}</Text>
          <Text style={styles.drawerRole}>{user?.Role ?? '—'}</Text>
          <Text style={styles.drawerDistrict}>{user?.District ?? '—'}</Text>
        </View>

        {/* Nav items */}
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

          {/* Logout */}
          <TouchableOpacity style={styles.drawerItem} onPress={onLogout} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={[styles.drawerItemLabel, { color: colors.error }]}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

export default function DashboardScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardResponseDto | null>(null);
  const [realTimeCounts, setRealTimeCounts] = useState<RealTimeCounts>({
    pendingPUC: 0,
    pendingPayana: 0,
    pendingProfessional: 0,
    pendingSemiProfessional: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const openDrawer = useCallback(() => {
    setDrawerOpen(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, backdropAnim]);

  const closeDrawer = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }),
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

  const fetchRealTimeCounts = useCallback(async () => {
    try {
      console.log('[Dashboard] Fetching real-time student counts...');
      
      // Fetch all three student lists in parallel
      const [pucResult, payanaResult, professionalResult, semiProfResult] = await Promise.allSettled([
        pucStudentApi.getList(),
        payanaStudentApi.getList(),
        professionalStudentApi.getList(),
        semiProfessionalStudentApi.getList(),
      ]);

      const counts: RealTimeCounts = {
        pendingPUC: 0,
        pendingPayana: 0,
        pendingProfessional: 0,
        pendingSemiProfessional: 0,
      };

      // Process PUC results
      if (pucResult.status === 'fulfilled') {
        counts.pendingPUC = pucResult.value.students?.length || 0;
        console.log('[Dashboard] PUC students count:', counts.pendingPUC);
      } else {
        console.error('[Dashboard] Failed to fetch PUC students:', pucResult.reason);
      }

      // Process Payana results
      if (payanaResult.status === 'fulfilled') {
        counts.pendingPayana = payanaResult.value.students?.length || 0;
        console.log('[Dashboard] Payana students count:', counts.pendingPayana);
        console.log('[Dashboard] Payana students data:', JSON.stringify(payanaResult.value.students, null, 2));
      } else {
        console.error('[Dashboard] Failed to fetch Payana students:', payanaResult.reason);
      }

      // Process Professional results
      if (professionalResult.status === 'fulfilled') {
        counts.pendingProfessional = professionalResult.value.students?.length || 0;
        console.log('[Dashboard] Professional students count:', counts.pendingProfessional);
      } else {
        console.error('[Dashboard] Failed to fetch Professional students:', professionalResult.reason);
      }

      if (semiProfResult.status === 'fulfilled') {
        counts.pendingSemiProfessional = semiProfResult.value.students?.length || 0;
        console.log('[Dashboard] Semi Professional students count:', counts.pendingSemiProfessional);
      } else {
        console.error('[Dashboard] Failed to fetch Semi Professional students:', semiProfResult.reason);
      }

      setRealTimeCounts(counts);
      console.log('[Dashboard] Real-time counts updated:', counts);
    } catch (err) {
      console.error('[Dashboard] Error fetching real-time counts:', err);
    }
  }, []);

  const fetchDashboard = useCallback(async () => {
    try {
      setError(null);
      const data = await dashboardApi.getDashboard();
      setDashboard(data);
      
      // Also fetch real-time counts from student list APIs
      await fetchRealTimeCounts();
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
  }, [logout, router, fetchRealTimeCounts]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboard();
  }, [fetchDashboard]);

  const getCountForCard = (field: StatCardConfig['field']): number => {
    switch (field) {
      case 'PendingPUC':
        return realTimeCounts.pendingPUC;
      case 'PendingPayana':
        return realTimeCounts.pendingPayana;
      case 'PendingProfessional':
        return realTimeCounts.pendingProfessional;
      case 'PendingSemiProfessional':
        return realTimeCounts.pendingSemiProfessional;
      default:
        return dashboard?.[field] ?? 0;
    }
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
          Welcome to {user?.Role ?? '—'} Dashboard
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
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
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
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.topBarIcon}
          onPress={openDrawer}
          activeOpacity={0.7}
        >
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

      {/* Main content */}
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

      {/* Overlay Drawer */}
      <DrawerSidebar
        open={drawerOpen}
        slideAnim={slideAnim}
        backdropAnim={backdropAnim}
        onClose={closeDrawer}
        onNavigate={handleDrawerNavigate}
        onLogout={handleDrawerLogout}
        user={user}
        dashboard={dashboard}
        realTimeCounts={realTimeCounts}
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
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
      },
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
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  statIcon: {
    marginBottom: spacing.xs,
  },
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
  statChevron: {
    marginTop: spacing.xs,
  },
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
    ...StyleSheet.absoluteFillObject,
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
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
      },
      android: { elevation: 16 },
    }),
  },
  drawerHeader: {
    backgroundColor: colors.primary,
    paddingTop: spacing.xxxl,
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
  drawerAvatarText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
  },
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
  drawerNav: {
    flex: 1,
    paddingTop: spacing.sm,
  },
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
  drawerItemLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  drawerBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  drawerBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  drawerDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
});
