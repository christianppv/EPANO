/**
 * Database type definitions for ENAPO.
 *
 * Regenerate with:
 *   supabase gen types typescript --local > src/types/database.ts
 *
 * These manual types serve as a fallback until Supabase is connected.
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; name: string | null; email: string | null; avatar_url: string | null; created_at: string };
        Insert: { id: string; name?: string; email?: string; avatar_url?: string };
        Update: { name?: string; email?: string; avatar_url?: string };
      };
      trips: {
        Row: { id: string; name: string; date_from: string | null; date_to: string | null; invite_code: string; created_by: string | null; status: string; created_at: string };
        Insert: { name: string; date_from?: string; date_to?: string; created_by: string };
        Update: { name?: string; date_from?: string; date_to?: string; status?: string };
      };
      trip_members: {
        Row: { trip_id: string; user_id: string; role: 'organizer' | 'member'; joined_at: string };
        Insert: { trip_id: string; user_id: string; role?: 'organizer' | 'member' };
        Update: { role?: 'organizer' | 'member' };
      };
      options: {
        Row: { id: string; trip_id: string; url: string | null; title: string | null; image_url: string | null; price: string | null; rating: string | null; source_domain: string | null; category: string; notes: string | null; added_by: string | null; status: string; created_at: string };
        Insert: { trip_id: string; url?: string; title?: string; image_url?: string; price?: string; rating?: string; source_domain?: string; category?: string; notes?: string; added_by?: string };
        Update: { title?: string; image_url?: string; price?: string; rating?: string; category?: string; notes?: string; status?: string };
      };
      polls: {
        Row: { id: string; trip_id: string; title: string; category: string | null; deadline: string | null; status: string; created_by: string | null; created_at: string };
        Insert: { trip_id: string; title: string; category?: string; deadline?: string; created_by?: string };
        Update: { title?: string; deadline?: string; status?: string };
      };
      poll_options: {
        Row: { id: string; poll_id: string; option_id: string };
        Insert: { poll_id: string; option_id: string };
        Update: never;
      };
      votes: {
        Row: { id: string; poll_id: string; poll_option_id: string; user_id: string; value: 'yes' | 'no' | 'maybe'; created_at: string };
        Insert: { poll_id: string; poll_option_id: string; user_id: string; value?: 'yes' | 'no' | 'maybe' };
        Update: { value?: 'yes' | 'no' | 'maybe' };
      };
      comments: {
        Row: { id: string; trip_id: string; option_id: string | null; poll_id: string | null; user_id: string; text: string; created_at: string };
        Insert: { trip_id: string; user_id: string; text: string; option_id?: string; poll_id?: string };
        Update: { text?: string };
      };
    };
  };
}
