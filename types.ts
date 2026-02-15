
export enum Category {
  THALIS = 'Thalis',
  MAIN_VEG = 'Main Course (Veg)',
  MAIN_NON_VEG = 'Main Course (Non-Veg)',
  STARTERS = 'Starters/Tandoor',
  CHINESE = 'Chinese & Snacks',
  BREADS = 'Breads & Sides'
}

export enum SpiceLevel {
  MILD = 'Mild',
  MEDIUM = 'Medium',
  HOT = 'Hot',
  EXTRA_HOT = 'Extra Hot'
}

export interface MenuItem {
  id: string;
  category: Category;
  name: string;
  description: string;
  priceMin: number;
  priceMax?: number;
  isVeg: boolean;
  spiceLevel: SpiceLevel;
  image: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'USER';
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export interface Reservation {
  id: string;
  userId: string;
  userName: string;
  date: string;
  timeSlot: string;
  guestCount: number;
  specialRequest?: string;
  status: ReservationStatus;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: 'PAID' | 'UNPAID';
  createdAt: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}
