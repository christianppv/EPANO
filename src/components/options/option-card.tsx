import { Image } from 'expo-image';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { GlassCard } from '@/components/ui/glass-card';
import type { Option } from '@/features/options/types/option.types';

const CATEGORY_ICON: Record<string, string> = {
  accommodation: '🏠',
  flight: '✈️',
  activity: '🎯',
  car: '🚗',
  other: '🔗',
};

type Props = {
  option: Option;
  onPress?: () => void;
};

export function OptionCard({ option, onPress }: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
    translateY.value = withTiming(0, { duration: 400 });
  }, [opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const decided = option.status === 'decided';
  const icon = CATEGORY_ICON[option.category] ?? '🔗';

  return (
    <Animated.View style={animatedStyle}>
      <GlassCard
        onPress={onPress}
        style={{
          padding: 12,
          borderWidth: decided ? 1.5 : 1,
          borderColor: decided ? '#1A9E8F' : 'rgba(255,255,255,0.70)',
        }}
      >
        {/* DECIDED badge */}
        {decided ? (
          <View
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
              borderRadius: 8,
              backgroundColor: 'rgba(26,158,143,0.12)',
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#1A9E8F' }}>✓ DECIDED</Text>
          </View>
        ) : null}

        <View style={{ flexDirection: 'row', gap: 12 }}>
          {/* Left: image or category emoji */}
          <View style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden' }}>
            {option.imageUrl ? (
              <Image
                source={{ uri: option.imageUrl }}
                style={{ width: 64, height: 64 }}
                contentFit="cover"
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0,0.03)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 28 }}>{icon}</Text>
              </View>
            )}
          </View>

          {/* Right: metadata */}
          <View
            style={{
              flex: 1,
              paddingVertical: 2,
              // Reserve space for DECIDED badge when present
              paddingRight: decided ? 72 : 0,
            }}
          >
            {option.sourceDomain ? (
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '500',
                  color: '#9B9B9B',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  marginBottom: 2,
                }}
                numberOfLines={1}
              >
                {option.sourceDomain}
              </Text>
            ) : null}

            <Text
              style={{ fontSize: 14, fontWeight: '600', color: '#1A1A1A', lineHeight: 20 }}
              numberOfLines={2}
            >
              {option.title}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
              {option.price ? (
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1A9E8F' }}>
                  {option.price}
                </Text>
              ) : null}
              {option.rating ? (
                <Text style={{ fontSize: 12, color: '#6B6B6B' }}>⭐ {option.rating}</Text>
              ) : null}
            </View>

            {/* Vote buttons — placeholder, disabled (Sprint 3 will wire these) */}
            {!decided ? (
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
                <Pressable
                  disabled
                  style={{
                    paddingVertical: 4,
                    paddingHorizontal: 14,
                    borderRadius: 8,
                    backgroundColor: 'rgba(26,158,143,0.10)',
                    opacity: 0.5,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#1A9E8F' }}>👍 0</Text>
                </Pressable>
                <Pressable
                  disabled
                  style={{
                    paddingVertical: 4,
                    paddingHorizontal: 14,
                    borderRadius: 8,
                    backgroundColor: 'rgba(232,92,74,0.10)',
                    opacity: 0.5,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#E85C4A' }}>👎 0</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
}
