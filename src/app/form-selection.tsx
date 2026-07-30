import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppFooter from '@/components/common/AppFooter';
import type { HomeSection, ScholarshipCardItem } from '@/config/homeSections';
import { homeSections } from '@/config/homeSections';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { navigateToDashboard } from '@/utils/navigateToDashboard';

const { width: screenWidth } = Dimensions.get('window');

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const BOTTOM_NAV_ITEMS: {
  id: string;
  label: string;
  icon: IoniconsName;
  activeIcon: IoniconsName;
  route: string;
}[] = [
  { id: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home', route: '/' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications-outline', activeIcon: 'notifications', route: '/notifications' },
  { id: 'applications', label: 'My Applications', icon: 'document-text-outline', activeIcon: 'document-text', route: '/my-applications' },
  { id: 'help', label: 'Help', icon: 'help-circle-outline', activeIcon: 'help-circle', route: '/help' },
];

export default function FormSelectionScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const handleFormSelect = (formType: string) => {
    (router.push as any)(`/form-engine?formType=${formType}`);
  };

  const handlePrimaryLogin = () => {
    (router.push as any)('/login');
  };

  const handlePrimaryDashboard = () => {
    if (user) {
      navigateToDashboard(user.Role);
    } else {
      (router.push as any)('/login');
    }
  };

  const handleApplyNow = () => {
    // Scroll to the new scholarships section is not implemented; direct navigation is sufficient
    // Find the first new scholarship item and navigate
    const firstSection = homeSections.find((s) => s.id === 'new-scholarships');
    if (firstSection && firstSection.items.length > 0) {
      const firstItem = firstSection.items[0] as ScholarshipCardItem;
      handleFormSelect(firstItem.formType);
    }
  };

  const handleNavPress = (route: string) => {
    if (route === '/') return; // already on home
    (router.push as any)(route);
  };

  const renderSection = (section: HomeSection) => {
    const isNew = section.id === 'new-scholarships';

    return (
      <View key={section.id} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
        </View>
        {isNew && (
          <View style={styles.cardsGrid}>
            {(section.items as ScholarshipCardItem[]).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.scholarshipCard}
                onPress={() => handleFormSelect(item.formType)}
                activeOpacity={0.8}
              >
                <View style={styles.scholarshipCardHeader}>
                  <View style={styles.scholarshipIconContainer}>
                    <Ionicons name={item.icon} size={24} color={colors.primary} />
                  </View>
                  <Text style={styles.scholarshipCardTitle}>{item.title}</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.textSecondary}
                    style={styles.chevron}
                  />
                </View>
                <Text style={styles.scholarshipDescription}>{item.description}</Text>
                <View style={styles.benefitsContainer}>
                  {item.benefits.map((benefit, index) => (
                    <View key={index} style={styles.benefitPill}>
                      <Text style={styles.benefitPillText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Header */}
        <View style={styles.heroContainer}>
          <View style={styles.heroBackground}>
            <Image
              source={require('@/assets/hero-banner.png')}
              style={styles.heroBackgroundImage}
              resizeMode="cover"
            />
            <View style={styles.heroGradientOverlay} />
            <View style={styles.heroTopRow}>
              <View>
                {/* <Text style={styles.brandTitle}>VIDYA POSHAK</Text>
                <Text style={styles.brandTagline}>Empowering Education, Enriching Lives</Text> */}
              </View>
              {/* <TouchableOpacity
                style={styles.heroLoginButton}
                onPress={isLoggedIn ? handlePrimaryDashboard : handlePrimaryLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.heroLoginButtonText}>
                  {isLoggedIn ? 'My Dashboard' : 'Login'}
                </Text>
              </TouchableOpacity> */}
            </View>

            <View style={styles.heroContent}>
              <View style={styles.heroTextContainer}>
                {/* <Text style={styles.heroTitle}>
                  {isLoggedIn ? `Welcome back, ${user?.UserName?.split(' ')[0] ?? 'Scholar'}!` : 'Welcome!'}
                </Text>
                <Text style={styles.heroSubtitle}>
                  What would you like to do today?
                </Text> */}
              </View>
            </View>
          </View>
        </View>

        {/* Primary Actions */}
        <View style={styles.primaryActions}>
          <TouchableOpacity
            style={styles.primaryActionCard}
            onPress={isLoggedIn ? handlePrimaryDashboard : handlePrimaryLogin}
            activeOpacity={0.8}
          >
            <View style={[styles.primaryActionIcon, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons
                name={isLoggedIn ? 'grid-outline' : 'log-in-outline'}
                size={28}
                color={colors.primary}
              />
            </View>
            <View style={styles.primaryActionTextContainer}>
              <Text style={styles.primaryActionTitle}>
                {isLoggedIn ? 'My Dashboard' : 'Login'}
              </Text>
              <Text style={styles.primaryActionSubtitle}>
                {isLoggedIn ? 'View your dashboard and tasks' : 'Access your VP account'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.primaryActionCard}
            onPress={handleApplyNow}
            activeOpacity={0.8}
          >
            <View style={[styles.primaryActionIcon, { backgroundColor: colors.success + '15' }]}>
              <Ionicons name="create-outline" size={28} color={colors.success} />
            </View>
            <View style={styles.primaryActionTextContainer}>
              <Text style={styles.primaryActionTitle}>{APP_TITLES.applyScholarship}</Text>
              <Text style={styles.primaryActionSubtitle}>Start a new application</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity> */}
        </View>

        {/* Scholarship Sections */}
        {homeSections.map(renderSection)}

        {/* Support Section */}
        <View style={styles.supportCard}>
          <View style={styles.supportIconContainer}>
            <Ionicons name="headset-outline" size={36} color={colors.primary} />
          </View>
          <View style={styles.supportContent}>
            <Text style={styles.supportTitle}>Need Help?</Text>
            <Text style={styles.supportSubtitle}>
              Not sure which scholarship is right for you?
            </Text>
          </View>
          <TouchableOpacity
            style={styles.supportButton}
            onPress={() => (router.push as any)('/help')}
            activeOpacity={0.8}
          >
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        <AppFooter />

        {/* Bottom spacing to account for fixed bottom nav */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = item.route === '/';
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.bottomNavItem}
              onPress={() => handleNavPress(item.route)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive ? item.activeIcon : item.icon}
                size={24}
                color={isActive ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[styles.bottomNavLabel, isActive && styles.bottomNavLabelActive]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xl,
  },

  // Hero
  heroContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  heroBackground: {
    borderRadius: 25,
    padding: spacing.xs,
    overflow: 'hidden',
    minHeight: screenWidth * 0.50,
    ...platform.elevation.button,
  },
  heroBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  brandTitle: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  brandTagline: {
    fontSize: platform.normalize.fontSize.small,
    lineHeight: platform.normalize.lineHeight.small,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  heroLoginButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    ...platform.elevation.card,
  },
  heroLoginButtonText: {
    top: 0,
    color: colors.primary,
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    fontWeight: '700',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroTextContainer: {
    width: '100%',
  },
  heroTitle: {
    fontSize: platform.normalize.fontSize.h1,
    lineHeight: platform.normalize.lineHeight.h1,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: 'rgba(255, 255, 255, 0.9)',
  },

  // Primary Actions
  primaryActions: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  primaryActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.md,
    ...platform.elevation.card,
  },
  primaryActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionTextContainer: {
    flex: 1,
  },
  primaryActionTitle: {
    fontSize: platform.normalize.fontSize.h3,
    lineHeight: platform.normalize.lineHeight.h3,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  primaryActionSubtitle: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Sections
  section: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: platform.normalize.fontSize.h2,
    lineHeight: platform.normalize.lineHeight.h2,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
    marginTop: 4,
  },

  // Scholarship Cards
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  scholarshipCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.sm,
    width: '47.5%',
    ...platform.elevation.card,
  },
  scholarshipCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  scholarshipIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  scholarshipCardTitle: {
    flex: 1,
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  chevron: {
    marginLeft: spacing.xs,
    display: 'none',
  },
  scholarshipDescription: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  benefitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  benefitPill: {
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  benefitPillText: {
    fontSize: platform.normalize.fontSize.small,
    lineHeight: platform.normalize.lineHeight.small,
    color: colors.textSecondary,
  },

  // Support
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    ...platform.elevation.card,
  },
  supportIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: platform.normalize.fontSize.h3,
    lineHeight: platform.normalize.lineHeight.h3,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  supportSubtitle: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  supportButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 10,
  },
  supportButtonText: {
    color: '#FFFFFF',
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    fontWeight: '600',
  },

  // Bottom nav
  bottomSpacer: {
    height: 80,
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: colors.card,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...platform.elevation.button,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    gap: 4,
  },
  bottomNavLabel: {
    fontSize: platform.normalize.fontSize.small,
    lineHeight: platform.normalize.lineHeight.small,
    color: colors.textSecondary,
  },
  bottomNavLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
