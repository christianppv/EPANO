export type OptionCategory = 'accommodation' | 'flight' | 'activity' | 'car' | 'other';
export type OptionStatus = 'active' | 'decided' | 'rejected';

export type ParsedLinkResult = {
  url: string;
  title: string;
  imageUrl: string | null;
  price: string | null;
  rating: string | null;
  sourceDomain: string | null;
  category: OptionCategory;
  notes: string | null;
};

export type Option = {
  id: string;
  tripId: string;
  url: string | null;
  title: string;
  imageUrl: string | null;
  price: string | null;
  rating: string | null;
  sourceDomain: string | null;
  category: OptionCategory;
  notes: string | null;
  addedBy: string | null;
  status: OptionStatus;
  createdAt: string;
};