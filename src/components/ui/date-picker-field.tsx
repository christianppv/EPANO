import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Modal, Platform, Pressable, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';

type Props = {
  label: string;
  value: string | null;
  onChange: (iso: string) => void;
  placeholder?: string;
  minimumDate?: Date;
};

function formatDisplay(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isoToDate(iso: string | null): Date {
  if (!iso) return new Date();
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function DatePickerField({ label, value, onChange, placeholder = 'Datum wählen', minimumDate }: Props) {
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState<Date>(isoToDate(value));

  function handleChange(_event: DateTimePickerEvent, date?: Date) {
    if (Platform.OS === 'android') {
      setOpen(false);
      if (date) {
        const iso = date.toISOString().split('T')[0];
        onChange(iso);
      }
      return;
    }
    if (date) setTemp(date);
  }

  function confirm() {
    const iso = temp.toISOString().split('T')[0];
    onChange(iso);
    setOpen(false);
  }

  return (
    <View style={{ gap: 4 }}>
      <Text style={{ ...typography.caption, color: colors.textSecondary, fontWeight: '600' }}>{label}</Text>
      <Pressable
        onPress={() => {
          setTemp(isoToDate(value));
          setOpen(true);
        }}
        style={({ pressed }) => ({
          backgroundColor: colors.background,
          borderRadius: 10,
          height: 44,
          paddingHorizontal: spacing.md,
          borderWidth: 1,
          borderColor: '#C8C4BE',
          justifyContent: 'center',
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Text style={{ ...typography.body, color: value ? colors.text : colors.textMuted }}>
          {value ? formatDisplay(value) : placeholder}
        </Text>
      </Pressable>

      {Platform.OS === 'ios' && (
        <Modal transparent animationType="slide" visible={open} onRequestClose={() => setOpen(false)}>
          <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)} />
          <View
            style={{
              backgroundColor: colors.white,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingBottom: spacing.xl,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.md,
                borderBottomWidth: 1,
                borderBottomColor: colors.backgroundCard,
              }}
            >
              <Pressable onPress={() => setOpen(false)}>
                <Text style={{ ...typography.body, color: colors.textSecondary }}>Abbrechen</Text>
              </Pressable>
              <Pressable onPress={confirm}>
                <Text style={{ ...typography.body, color: colors.primary, fontWeight: '600' }}>Fertig</Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={temp}
              mode="date"
              display="spinner"
              onChange={handleChange}
              minimumDate={minimumDate}
              locale="de-DE"
              textColor="#1A1A1A"
            />
          </View>
        </Modal>
      )}

      {Platform.OS === 'android' && open && (
        <DateTimePicker
          value={temp}
          mode="date"
          display="default"
          onChange={handleChange}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
}
