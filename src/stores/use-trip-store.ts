import { create } from 'zustand';

interface TripState {
  activeTripId: string | null;
  optionFilter: 'all' | 'accommodation' | 'flight' | 'activity' | 'car' | 'other';
  setActiveTripId: (id: string | null) => void;
  setOptionFilter: (filter: TripState['optionFilter']) => void;
}

export const useTripStore = create<TripState>((set) => ({
  activeTripId: null,
  optionFilter: 'all',
  setActiveTripId: (activeTripId) => set({ activeTripId }),
  setOptionFilter: (optionFilter) => set({ optionFilter }),
}));
