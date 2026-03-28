import { View } from 'react-native';
import { colors } from '@/theme';

type Props = {
  decided: number;
  voting: number;
  total: number;
};

export function ProgressDots({ decided, voting, total }: Props) {
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
    </View>
  );
}
