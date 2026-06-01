import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

const APPROVAL_ITEMS = [
  { label: 'Students Approval House Visit (PUC Students)', route: '/approval/puc' },
  { label: 'Students Approval House Visit (Payana Students)', route: '/approval/payana' },
  { label: 'Students Approval House Visit (Professional Students)', route: '/approval/professional' },
  { label: 'Students Approval House Visit (Semi Professional Students)', route: '/approval/semi-professional' },
] as const;

const INFO_CARDS = [
  { label: 'USER NAME', icon: 'person-outline' as const, key: 'UserName' },
  { label: 'ROLE', icon: 'id-card-outline' as const, key: 'Role' },
  { label: 'DISTRICT', icon: 'location-outline' as const, key: 'District' },
] as const;

export default function DashboardScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.brandName}>Vidya Poshak</Text>
        <View style={styles.topBarActions}>
          <TouchableOpacity
            style={styles.topBarIcon}
            onPress={() => (router.push as any)('/notifications')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => setShowUserMenu((v) => !v)}
            activeOpacity={0.7}
          >
            <Ionicons name="person-circle" size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Avatar dropdown menu */}
      {showUserMenu && (
        <View style={styles.userMenu}>
          <Text style={styles.userMenuName}>{user?.UserName ?? '—'}</Text>
          <Text style={styles.userMenuRole}>{user?.Role ?? '—'}</Text>
          <View style={styles.userMenuDivider} />
          <TouchableOpacity style={styles.userMenuLogout} onPress={handleLogout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={16} color={colors.error} />
            <Text style={styles.userMenuLogoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Banner */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome to Volunteer Dashboard</Text>
        </View>

        {/* User Info Cards — horizontal scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.infoCardsRow}
        >
          {INFO_CARDS.map(({ label, icon, key }) => (
            <View key={key} style={styles.infoCard}>
              <View style={styles.infoCardAccent} />
              <Ionicons name={icon} size={28} color={colors.primary} style={styles.infoCardIcon} />
              <Text style={styles.infoCardLabel}>{label}</Text>
              <Text style={styles.infoCardValue}>{user?.[key] ?? '—'}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Quick Actions */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Approval Students List For House Visit</Text>
          {APPROVAL_ITEMS.map(({ label, route }) => (
            <TouchableOpacity
              key={route}
              style={styles.actionRow}
              onPress={() => (router.push as any)(route)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionRowText}>{label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer Note */}
        <View style={styles.footerNote}>
          <Text style={styles.footerLoggedIn}>
            Logged in as:{' '}
            <Text style={styles.footerLoggedInName}>{user?.UserName ?? '—'}</Text>
          </Text>
          <Text style={styles.footerCopyright}>Copyright © Vidya Poshak 2026</Text>
        </View>
      </ScrollView>
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 52,
  },
  brandName: {
    fontSize: platform.normalize.fontSize.h3,
    lineHeight: platform.normalize.lineHeight.h3,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  topBarIcon: {
    padding: spacing.xs,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMenu: {
    position: 'absolute',
    top: 52 + (Platform.OS === 'ios' ? 54 : 24),
    right: spacing.md,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    zIndex: 100,
    minWidth: 180,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  userMenuName: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  userMenuRole: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  userMenuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  userMenuLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  userMenuLogoutText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.error,
    fontWeight: '500',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  welcomeCard: {
    backgroundColor: colors.card,
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
  welcomeTitle: {
    fontSize: platform.normalize.fontSize.h2,
    lineHeight: platform.normalize.lineHeight.h2,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  infoCardsRow: {
    gap: spacing.sm,
    paddingRight: spacing.xs,
  },
  infoCard: {
    width: 140,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingTop: 0,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    alignItems: 'center',
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
  infoCardAccent: {
    height: 3,
    backgroundColor: colors.primary,
    alignSelf: 'stretch',
    marginBottom: spacing.md,
  },
  infoCardIcon: {
    marginBottom: spacing.sm,
  },
  infoCardLabel: {
    fontSize: platform.normalize.fontSize.small,
    lineHeight: platform.normalize.lineHeight.small,
    color: colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  infoCardValue: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
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
  sectionTitle: {
    fontSize: platform.normalize.fontSize.h3,
    lineHeight: platform.normalize.lineHeight.h3,
    color: colors.textPrimary,
    fontWeight: '600',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    minHeight: 48,
  },
  actionRowText: {
    flex: 1,
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  footerNote: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  footerLoggedIn: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.textSecondary,
  },
  footerLoggedInName: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  footerCopyright: {
    fontSize: platform.normalize.fontSize.small,
    lineHeight: platform.normalize.lineHeight.small,
    color: colors.textSecondary,
  },
});
