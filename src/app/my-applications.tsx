import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApplicationStatusItem, lookupApplications } from '@/api/applicationStatusApi';
import AppFooter from '@/components/common/AppFooter';
import EmptyState from '@/components/common/EmptyState';
import AppTopBar from '@/components/layout/AppTopBar';
import { DraftSummary, listDrafts } from '@/services/draftStorage';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';

type Row =
  | { kind: 'remote'; item: ApplicationStatusItem }
  | { kind: 'draft'; draft: DraftSummary };

function statusColors(status: string): { bg: string; fg: string; icon: string } {
  switch (status) {
    case 'Approved':
      return { bg: '#E8F5E9', fg: '#2E7D32', icon: 'checkmark-circle' };
    case 'Rejected':
      return { bg: '#FFEBEE', fg: '#C62828', icon: 'close-circle' };
    case 'Draft':
      return { bg: '#ECEFF1', fg: '#546E7A', icon: 'create-outline' };
    default:
      return { bg: '#FFF8E1', fg: '#F9A825', icon: 'time-outline' };
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function MyApplicationsScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [drafts, setDrafts] = useState<DraftSummary[]>([]);

  useEffect(() => {
    listDrafts().then(setDrafts).catch(() => setDrafts([]));
  }, []);

  const draftRows: Row[] = drafts.map((draft) => ({ kind: 'draft', draft }));

  const search = async () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('Enter the 10-digit mobile number used on the application.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await lookupApplications(digits);
      const remote: Row[] = (res.applications ?? []).map((item) => ({
        kind: 'remote',
        item,
      }));
      setRows(remote);
      setSearched(true);
    } catch (e: any) {
      setError(e?.message ?? 'Could not fetch application status.');
      setRows([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const renderRow = ({ item }: { item: Row }) => {
    if (item.kind === 'draft') {
      const c = statusColors('Draft');
      return (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.program}>{item.draft.formType}</Text>
            <View style={[styles.badge, { backgroundColor: c.bg }]}>
              <Ionicons name={c.icon as any} size={14} color={c.fg} />
              <Text style={[styles.badgeText, { color: c.fg }]}>Draft</Text>
            </View>
          </View>
          <Text style={styles.meta}>
            Saved on this device · {formatDate(item.draft.savedAt)}
          </Text>
          <Text style={styles.hint}>Open the form to finish and submit.</Text>
        </View>
      );
    }

    const { item: app } = item;
    const c = statusColors(app.status);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.program}>
            {app.program}
            {app.applicationType === 'Renewal' ? ' · Renewal' : ''}
          </Text>
          <View style={[styles.badge, { backgroundColor: c.bg }]}>
            <Ionicons name={c.icon as any} size={14} color={c.fg} />
            <Text style={[styles.badgeText, { color: c.fg }]}>{app.status}</Text>
          </View>
        </View>
        {!!app.studentName && <Text style={styles.name}>{app.studentName}</Text>}
        {!!app.appliedDate && (
          <Text style={styles.meta}>Applied on {formatDate(app.appliedDate)}</Text>
        )}
        {!!app.remark && <Text style={styles.remark}>Note: {app.remark}</Text>}
        {app.status === 'Rejected' && !app.remark && (
          <Text style={styles.remark}>
            Contact your Vidya Poshak coordinator for details.
          </Text>
        )}
      </View>
    );
  };

  const allRows = [...draftRows, ...rows];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppTopBar />

      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Registered mobile number"
          placeholderTextColor={colors.textSecondary}
          keyboardType="phone-pad"
          maxLength={10}
          value={phone}
          onChangeText={setPhone}
        />
        <TouchableOpacity
          style={[styles.searchButton, loading && { opacity: 0.6 }]}
          onPress={search}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.searchButtonText}>Track</Text>
          )}
        </TouchableOpacity>
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={allRows}
        keyExtractor={(r, i) =>
          r.kind === 'draft' ? `draft-${r.draft.formType}` : `remote-${i}`
        }
        renderItem={renderRow}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            showLogo
            title={searched ? 'No applications found' : 'Track your applications'}
            subtitle={
              searched
                ? 'No applications were found for this mobile number. Check the number and try again.'
                : 'Enter the mobile number used while applying to see the status of your applications.'
            }
          />
        }
      />
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
  searchBar: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: platform.normalize.fontSize.body,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    minWidth: 90,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: platform.normalize.fontSize.body,
  },
  error: {
    color: '#C62828',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    fontSize: platform.normalize.fontSize.body,
  },
  list: {
    padding: spacing.md,
    gap: spacing.md,
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  program: {
    fontSize: platform.normalize.fontSize.body,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: platform.normalize.fontSize.small,
    fontWeight: '600',
  },
  name: {
    fontSize: platform.normalize.fontSize.body,
    color: colors.textPrimary,
    marginTop: 6,
  },
  meta: {
    fontSize: platform.normalize.fontSize.small,
    color: colors.textSecondary,
    marginTop: 4,
  },
  hint: {
    fontSize: platform.normalize.fontSize.small,
    color: colors.primary,
    marginTop: 6,
  },
  remark: {
    fontSize: platform.normalize.fontSize.small,
    color: '#C62828',
    marginTop: 6,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: platform.normalize.fontSize.h3,
    color: colors.textPrimary,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  emptyText: {
    fontSize: platform.normalize.fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
  },
});
