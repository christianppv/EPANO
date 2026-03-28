import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useSignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  async function sendOtp(inputEmail: string) {
    setError(null);
    setLoading(true);
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: inputEmail.trim(),
        options: { shouldCreateUser: true },
      });
      if (otpError) throw otpError;
      setEmail(inputEmail.trim());
      setSent(true);
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message ?? String(e);
      setError(`Fehler: ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(code: string) {
    setError(null);
    setLoading(true);
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code.trim(),
        type: 'email',
      });
      if (verifyError) throw verifyError;
    } catch {
      setError('Ungültiger Code. Bitte erneut versuchen.');
    } finally {
      setLoading(false);
    }
  }

  return { sendOtp, verifyOtp, loading, error, sent };
}
