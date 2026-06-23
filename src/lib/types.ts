export type UserRole = "customer" | "hobbyist";
export type ListingStatus = "active" | "paused";
export type PriceUnit = "fixed" | "hour" | "session" | "item";

export interface Profile {
  id: string; // == auth.users.id
  role: UserRole;
  name: string;
  phone: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string; // Hebrew display name
  slug: string;
  created_at: string;
}

export interface Listing {
  id: string;
  hobbyist_id: string;
  category_id: string;
  title: string;
  description: string;
  price: number;
  price_unit: PriceUnit;
  location: string | null;
  image_url: string | null;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

// Joined shapes returned by browse/detail queries (Supabase embedded selects)
export interface ListingWithRelations extends Listing {
  categories: Category | null;
  profiles: Pick<Profile, "id" | "name" | "phone" | "location" | "bio"> | null;
}

export const PRICE_UNIT_LABELS: Record<PriceUnit, string> = {
  fixed: "מחיר קבוע",
  hour: "לשעה",
  session: "למפגש",
  item: "ליחידה",
};
