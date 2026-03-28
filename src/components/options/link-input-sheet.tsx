import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAddOption } from '@/features/options/hooks/useAddOption';

type Props = {
  tripId: string;
  visible: boolean;
  onClose: () => void;
};

export function LinkInputSheet({ tripId, visible, onClose }: Props) {
  const [url, setUrl] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const slideAnim = useRef(new Animated.Value(500)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const { addOption, isParsing, error, reset } = useAddOption();

  // Slide in when visible, slide out when hidden
  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 65,
        friction: 11,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 240,
        useNativeDriver: true,
      }).start(() => {
        setMounted(false);
        setUrl('');
        setShowToast(false);
        reset();
      });
    }
  }, [visible, slideAnim, reset]);

  function handleClose() {
    Animated.timing(slideAnim, {
      toValue: 500,
      duration: 240,
      useNativeDriver: true,
    }).start(() => {
      setUrl('');
      setShowToast(false);
      reset();
      onClose();
    });
  }

  async function handleSubmit() {
    const trimmed = url.trim();
    if (!trimmed || isParsing) return;

    try {
      await addOption({ tripId, url: trimmed });

      // Success: toast → auto-close
      setShowToast(true);
      Animated.sequence([
        Animated.timing(toastOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.delay(1400),
        Animated.timing(toastOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start(() => {
        setShowToast(false);
        handleClose();
      });
    } catch {
      // error surface is handled by useMutation — shown inline below input
    }
  }

  if (!mounted) return null;

  const canSubmit = url.trim().length > 0 && !isParsing;

  return (
    <Modal
      transparent
      visible={mounted}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Backdrop */}
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }}
          onPress={handleClose}
        />

        {/* Sheet */}
        <Animated.View
          style={{
            backgroundColor: 'rgba(255,255,255,0.98)',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: Platform.OS === 'ios' ? 40 : 24,
            transform: [{ translateY: slideAnim }],
            // Subtle top shadow
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 12,
          }}
        >
          {/* Drag handle */}
          <View
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              backgroundColor: 'rgba(0,0,0,0.14)',
              alignSelf: 'center',
              marginBottom: 16,
            }}
          />

          {/* Title */}
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#1A1A1A',
              marginBottom: 16,
            }}
          >
            Link hinzufügen
          </Text>

          {/* URL Input */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.04)',
              borderRadius: 10,
              paddingHorizontal: 12,
              marginBottom: error ? 6 : 14,
            }}
          >
            <Text style={{ fontSize: 18, marginRight: 8 }}>🔗</Text>
            <TextInput
              value={url}
              onChangeText={(text) => setUrl(text)}
              placeholder="Link einfügen (Booking, Airbnb...)"
              placeholderTextColor="#9B9B9B"
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              returnKeyType="go"
              onSubmitEditing={handleSubmit}
              editable={!isParsing}
              style={{
                flex: 1,
                height: 48,
                fontSize: 15,
                color: '#1A1A1A',
              }}
            />
          </View>

          {/* Inline error */}
          {error ? (
            <Text
              style={{
                fontSize: 12,
                color: '#E85C4A',
                marginBottom: 10,
              }}
            >
              {error}
            </Text>
          ) : null}

          {/* Loading indicator (separate from button when parsing) */}
          {isParsing ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginBottom: 10,
              }}
            >
              <ActivityIndicator size="small" color="#1A9E8F" />
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#1A9E8F' }}>
                Link wird analysiert…
              </Text>
            </View>
          ) : null}

          {/* Submit button */}
          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={({ pressed }) => ({
              height: 48,
              borderRadius: 12,
              backgroundColor: '#1A9E8F',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: !canSubmit ? 0.6 : pressed ? 0.88 : 1,
              shadowColor: '#1A9E8F',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: canSubmit ? 0.35 : 0,
              shadowRadius: 14,
              elevation: canSubmit ? 4 : 0,
            })}
          >
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#FFFFFF' }}>
              Hinzufügen
            </Text>
          </Pressable>

          {/* Success toast */}
          {showToast ? (
            <Animated.View
              style={{
                position: 'absolute',
                bottom: Platform.OS === 'ios' ? 52 : 36,
                left: 20,
                right: 20,
                backgroundColor: '#1A9E8F',
                borderRadius: 12,
                paddingVertical: 10,
                paddingHorizontal: 16,
                alignItems: 'center',
                opacity: toastOpacity,
                shadowColor: '#1A9E8F',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 6,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>
                Option hinzugefügt ✓
              </Text>
            </Animated.View>
          ) : null}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
