import { addTrip, getTrips } from '../store/trips.store';
import { CreateTripInput } from '../types/create-trip.input';
import { Trip } from '../types/trip.types';
import { defaultEndDate, defaultStartDate, parseGermanDate } from '../utils/parse-date-input';

const ACCENT_PALETTE = ['#4F46E5', '#F5A623', '#22C55E', '#EF4444', '#8B5CF6', '#0EA5E9'];

export function useCreateTrip(): { createTrip: (input: CreateTripInput) => Trip } {
  function createTrip(input: CreateTripInput): Trip {
    const startIso =
      (input.startDate ? parseGermanDate(input.startDate) : null) ?? defaultStartDate();
    const endIso =
      (input.endDate ? parseGermanDate(input.endDate) : null) ?? defaultEndDate(startIso);

    const accentColor = ACCENT_PALETTE[getTrips().length % ACCENT_PALETTE.length];

    const trip: Trip = {
      id: Date.now().toString(),
      title: input.title.trim(),
      destination: input.destination.trim(),
      startDate: startIso,
      endDate: endIso,
      memberCount: input.memberCount,
      status: 'planning',
      accentColor,
    };

    addTrip(trip);
    return trip;
  }

  return { createTrip };
}
