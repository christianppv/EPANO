export type TripStatus = 'planning' | 'confirmed' | 'completed';

export type Trip = {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  memberCount: number;
  status: TripStatus;
  inviteCode: string;
  accentColor: string;
  members: string[];
};
