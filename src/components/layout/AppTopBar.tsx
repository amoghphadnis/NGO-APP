import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BrandLogo from '@/components/common/BrandLogo';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { safeGoBack } from '@/utils/navigateToDashboard';

interface AppTopBarProps {
  /** 'menu' shows the drawer icon (dashboards); 'back' shows a back arrow. Default 'back'. */
  variant?: 'menu' | 'back';
  onMenuPress?: () => void;
  /** Override the default router.back() behavior for the back variant. */
  onBackPress?: () => void;
  /** Hide the notifications bell (e.g. inside form flows). */
  hideBell?: boolean;
  /** Notification badge count — shown only when > 0. */
  badgeCount?: number;
}

export default function AppTopBar({
  variant = 'back',
  onMenuPress,
  onBackPress,
  hideBell = false,
  badgeCount = 0,
}: AppTopBarProps) {
  const router = useRouter();

  return (
    <View style={styles.topBar}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={variant === 'menu' ? onMenuPress : (onBackPress ?? (() => safeGoBack('/pdashboard')))}
        activeOpacity={0.7}
        accessibilityLabel={variant === 'menu' ? 'Open menu' : 'Go back'}
      >
        <Ionicons
          name={variant === 'menu' ? 'menu-outline' : 'arrow-back'}
          size={variant === 'menu' ? 26 : 22}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      <View style={styles.brandContainer}>
        <BrandLogo size={26} onPrimary />
        <Text style={styles.brandName} numberOfLines={1}>
          Vidya Poshak
        </Text>
      </View>

      {!hideBell ? (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => (router.push as any)('/notifications')}
          activeOpacity={0.7}
          accessibilityLabel="Notifications"
        >
          <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
          {badgeCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {badgeCount > 99 ? '99+' : String(badgeCount)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.iconButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 52,
    gap: spacing.sm,
  },
  iconButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: 0,
  },
  brandName: {
    fontSize: platform.normalize.fontSize.h3,
    lineHeight: platform.normalize.lineHeight.h3,
    color: '#FFFFFF',
    fontWeight: '700',
    flexShrink: 1,
    minWidth: 0,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.error,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
