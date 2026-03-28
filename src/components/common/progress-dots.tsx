import { Text, View } from 'react-native';
import { colors, typography } from '@/theme';

type Props = {
  decided: number;
  voting: number;
  total: number;
  showLabel?: boolean;
};

export function ProgressDots({ decided, voting, total, showLabel = false }: Props) {
  if (total === 0) return null;

  return (
    <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => {
        let bg: string = colors.statusCompleted; // grau = offen
        if (i < decided) bg = colors.statusConfirmed;       // grün = decided
        else if (i < decided + voting) bg = colors.statusPlanning; // amber = voting
        return (
          <View
            key={i}
            style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: bg }}
          />
        );
      })}
      {showLabel ? (
        <Text style={{ ...typography.caption, color: colors.textMuted, marginLeft: 4 }}>
          {decided}/{total} entschieden
        </Text>
      ) : null}
    </View>
  );
}
