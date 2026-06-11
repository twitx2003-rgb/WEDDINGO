export type UserRole = "admin" | "tenant";
export type PaymentStatus = "paid" | "unpaid";
export type IssueStatus = "open" | "in_progress" | "resolved";

export interface Building {
  id: string;
  address: string;
  total_apartments: number;
  monthly_fee: number;
  created_at: string;
}

export interface User {
  id: string;
  building_id: string;
  auth_id: string | null;
  name: string;
  apartment_number: string;
  phone: string | null;
  role: UserRole;
  access_token: string;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  month: number;
  year: number;
  amount: number;
  status: PaymentStatus;
  created_at: string;
}

export interface Expense {
  id: string;
  building_id: string;
  description: string;
  amount: number;
  date: string;
  created_at: string;
}

export interface Issue {
  id: string;
  building_id: string;
  reported_by_user_id: string;
  description: string;
  status: IssueStatus;
  created_at: string;
}
