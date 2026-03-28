import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { OptionCard } from '@/components/options/option-card';
import { LinkInputSheet } from '@/components/options/link-input-sheet';
import { AvatarStack } from '@/components/common/avatar-stack';
import { ProgressDots } from '@/components/common/progress-dots';
import { GlassCard } from '@/components/ui/glass-card';
import { LabeledInput } from '@/components/ui/labeled-input';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { Pill } from '@/components/ui/pill';
import { LiquidBackground } from '@/components/ui/liquid-background';
import { PollsList } from '@/features/options/components/polls-list';
import { useOptions } from '@/features/options/hooks/useOptions';
import { usePolls } from '@/features/options/hooks/usePolls';
import type { Option, OptionCategory } from '@/features/options/types/option.types';
import { supabase } from '@/lib/supabase';
import { colors, spacing, typography } from '@/theme';
import { DecisionBoardMini } from './decision-board-mini';
import { useTripById } from '../hooks/useTrips';
import { useTripMembers } from '../hooks/useTripMembers';

type TabId = 'options' | 'votes';
type FilterId = 'all' | OptionCategory;

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez',
];

const FILTER_PILLS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'Alle' },
  { id: 'accommodation', label: '🏠 Unterkunft' },
  { id: 'flight', label: '✈️ Flug' },
  { id: 'activity', label: '🎯 Aktivität' },
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()}. ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

type Props = {
  tripId: string;
};

export function TripDashboard({ tripId }: Props) {
  const queryClient = useQueryClient();
  const trip = useTripById(tripId);
  const { members } = useTripMembers(tripId);
  const { options, isLoading: optionsLoading } = useOptions(tripId);
  const { polls, isLoading: pollsLoading } = usePolls(tripId);

  // ─── UI state ─────────────────────────────────────
  const [activeTab, setActiveTab] = useState<TabId>('options');
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const [sheetVisible, setSheetVisible] = useState(false);

  // Edit trip state
  const [editVisible, setEditVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDateFrom, setEditDateFrom] = useState<string | null>(null);
  const [editDateTo, setEditDateTo] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // ─── Derived values ───────────────────────────────
  const filteredOptions: Option[] =
    activeFilter === 'all'
      ? options
      : options.filter((o) => o.category === activeFilter);

  // ProgressDots: total = 3 categories, decided = decided options count (capped at 3)
  const decidedCount = Math.min(options.filter((o) => o.status === 'decided').length, 3);

  const tabs: { id: TabId; label: string }[] = [
    { id: 'options', label: `Optionen (${options.length})` },
    { id: 'votes', label: 'Abstimmung' },
  ];

  // ─── Handlers ─────────────────────────────────────
  function handleShare() {
    if (!trip) return;
    Share.share({
      message: `Tritt unserer Reise "${trip.title}" bei!\n\nepano://join/${trip.inviteCode}`,
    });
  }

  function openEditSheet() {
    if (!trip) return;
    setEditName(trip.title);
    setEditDateFrom(trip.startDate ?? null);
    setEditDateTo(trip.endDate ?? null);
    setEditError(null);
    setEditVisible(true);
  }

  async function saveTrip() {
    if (!editName.trim()) {
      setEditError('Bitte gib einen Trip-Namen ein.');
      return;
    }
    setEditSaving(true);
    setEditError(null);
    try {
      const { error } = await supabase
        .from('trips')
        .update({
          name: editName.trim(),
          date_from: editDateFrom ?? null,
          date_to: editDateTo ?? null,
        })
        .eq('id', tripId);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      setEditVisible(false);
    } catch {
      setEditError('Speichern fehlgeschlagen. Bitte erneut versuchen.');
    } finally {
      setEditSaving(false);
    }
  }

  // ─── Render ───────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LiquidBackground>

        {/* ── Header ── */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            gap: spacing.sm,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            hitSlop={12}
          >
            <Ionicons name="arrow-back" size={22} color={colors.primary} />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text style={{ ...typography.heading, color: colors.text }} numberOfLines={1}>
              {trip?.title ?? '…'}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 2 }}>
              {trip ? (
                <>
                  <Text style={{ ...typography.caption, color: colors.textMuted }}>
                    {formatDate(trip.startDate)}
                  </Text>
                  <AvatarStack names={members.map((m) => m.name)} size={18} max={4} />
                </>
              ) : (
                <Text style={{ ...typography.caption, color: colors.textMuted }}>Wird geladen…</Text>
              )}
            </View>
            <View style={{ marginTop: 4 }}>
              <ProgressDots decided={decidedCount} voting={0} total={3} showLabel />
            </View>
          </View>

          {/* Edit icon */}
          <Pressable
            onPress={openEditSheet}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            hitSlop={12}
          >
            <Ionicons name="create-outline" size={22} color={colors.textSecondary} />
          </Pressable>

          {/* Share icon */}
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            hitSlop={12}
          >
            <Ionicons name="share-outline" size={22} color={colors.text} />
          </Pressable>
        </View>

        {/* ── Decision Board ── */}
        <DecisionBoardMini options={options} />

        {/* ── Tab Bar ── */}
        <View
          style={{
            flexDirection: 'row',
            marginTop: spacing.md,
            marginHorizontal: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0,0,0,0.06)',
          }}
        >
          {tabs.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: spacing.sm + 2,
                  borderBottomWidth: 2,
                  borderBottomColor: selected ? colors.primary : 'transparent',
                }}
              >
                <Text
                  style={{
                    ...typography.caption,
                    fontWeight: selected ? '600' : '400',
                    color: selected ? colors.primary : colors.textMuted,
                  }}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ── Tab Content ── */}
        <View style={{ flex: 1 }}>
          {activeTab === 'options' ? (
            <>
              {/* Filter Pills */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: spacing.sm,
                  paddingHorizontal: spacing.md,
                  paddingTop: spacing.md,
                  paddingBottom: spacing.sm,
                }}
              >
                {FILTER_PILLS.map((pill) => (
                  <Pill
                    key={pill.id}
                    label={pill.label}
                    active={activeFilter === pill.id}
                    onPress={() => setActiveFilter(pill.id)}
                  />
                ))}
              </ScrollView>

              {/* Options FlatList */}
              <FlatList
                data={filteredOptions}
                keyExtractor={(o) => o.id}
                contentContainerStyle={{
                  paddingHorizontal: spacing.md,
                  paddingBottom: 100,
                }}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                ListEmptyComponent={
                  optionsLoading ? (
                    <ActivityIndicator
                      color={colors.primary}
                      style={{ marginTop: 40 }}
                    />
                  ) : (
                    <Text
                      style={{
                        ...typography.body,
                        color: colors.textMuted,
                        textAlign: 'center',
                        marginTop: 40,
                      }}
                    >
                      Noch keine Optionen — füge deinen ersten Link hinzu 🔗
                    </Text>
                  )
                }
                renderItem={({ item }) => <OptionCard option={item} />}
              />
            </>
          ) : (
            <PollsList polls={polls} isLoading={pollsLoading} memberCount={members.length} />
          )}
        </View>

        {/* ── FAB ── */}
        {activeTab === 'options' ? (
          <Pressable
            onPress={() => setSheetVisible(true)}
            style={({ pressed }) => ({
              position: 'absolute',
              right: 24,
              bottom: 24,
              width: 52,
              height: 52,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.accent,
              opacity: pressed ? 0.86 : 1,
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 20,
              elevation: 6,
            })}
          >
            <Text style={{ fontSize: 14, color: colors.white, fontWeight: '700' }}>🔗+</Text>
          </Pressable>
        ) : null}

      </LiquidBackground>

      {/* ── Link Input Sheet ── */}
      <LinkInputSheet
        tripId={tripId}
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
      />

      {/* ── Edit Trip Modal ── */}
      <Modal
        transparent
        visible={editVisible}
        animationType="slide"
        onRequestClose={() => setEditVisible(false)}
        statusBarTranslucent
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }}
          onPress={() => setEditVisible(false)}
        />

        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: Platform.OS === 'ios' ? 40 : spacing.lg,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 12,
          }}
        >
          {/* Handle */}
          <View
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              backgroundColor: 'rgba(0,0,0,0.14)',
              alignSelf: 'center',
              marginBottom: spacing.md,
            }}
          />

          <Text style={{ ...typography.subheading, color: colors.text, marginBottom: spacing.lg }}>
            Trip bearbeiten
          </Text>

          <View style={{ gap: spacing.md }}>
            <LabeledInput
              label="Trip-Name"
              value={editName}
              onChangeText={setEditName}
              placeholder="z. B. Lissabon Sommer"
              autoCapitalize="words"
            />

            <DatePickerField
              label="Startdatum (optional)"
              value={editDateFrom}
              onChange={setEditDateFrom}
              placeholder="Datum wählen"
            />

            <DatePickerField
              label="Enddatum (optional)"
              value={editDateTo}
              onChange={setEditDateTo}
              placeholder="Datum wählen"
              minimumDate={editDateFrom ? new Date(editDateFrom) : undefined}
            />
          </View>

          {editError ? (
            <Text
              style={{
                fontSize: 13,
                color: '#E85C4A',
                marginTop: spacing.sm,
              }}
            >
              {editError}
            </Text>
          ) : null}

          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
            <Pressable
              onPress={() => setEditVisible(false)}
              style={({ pressed }) => ({
                flex: 1,
                height: 48,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.glass,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={{ ...typography.body, color: colors.textSecondary, fontWeight: '500' }}>
                Abbrechen
              </Text>
            </Pressable>

            <Pressable
              onPress={saveTrip}
              disabled={editSaving}
              style={({ pressed }) => ({
                flex: 2,
                height: 48,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.primary,
                opacity: editSaving || pressed ? 0.8 : 1,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 4,
              })}
            >
              {editSaving ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={{ ...typography.body, color: colors.white, fontWeight: '600' }}>
                  Speichern
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
