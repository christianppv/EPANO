import { Database } from '@/types/database';
import { Trip, TripStatus } from '../types/trip.types';
import { tripAccentColor } from './accent-color';
import { defaultEndDate, defaultStartDate } from './parse-date-input';

type DbTrip = Database['public']['Tables']['trips']['Row'];

export function dbTripToTrip(row: DbTrip): Trip {
  const startDate = row.date_from ?? defaultStartDate();
  return {
    id: row.id,
    title: row.name,
    destination: row.destination,
    startDate,
    endDate: row.date_to ?? defaultEndDate(startDate),
    memberCount: row.planned_members,
    status: row.status as TripStatus,
    inviteCode: row.invite_code,
    accentColor: tripAccentColor(row.id),
  };
}
