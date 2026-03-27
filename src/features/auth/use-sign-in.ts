import * as AppleAuthentication from 'expo-apple-authentication';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';

const redirectUri = makeRedirectUri({
  scheme: 'epano',
  path: 'auth/callback',
});

export function useSignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signInWithApple() {
    setError(null);
    setLoading(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (!credential.identityToken) throw new Error('No identity token');
      const { error: sbError } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });
      if (sbError) throw sbError;
    } catch (e: unknown) {
      if ((e as { code?: string }).code !== 'ERR_REQUEST_CANCELED') {
        setError('Apple Sign-In fehlgeschlagen. Bitte erneut versuchen.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    setError(null);
    setLoading(true);
    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
        },
      });
      if (oauthError || !data.url) throw oauthError ?? new Error('No OAuth URL');

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
      if (result.type === 'success') {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(result.url);
        if (exchangeError) throw exchangeError;
      }
    } catch {
      setError('Google Sign-In fehlgeschlagen. Bitte erneut versuchen.');
    } finally {
      setLoading(false);
    }
  }

  const appleAvailable = Platform.OS === 'ios';

  return { signInWithApple, signInWithGoogle, loading, error, appleAvailable };
}
