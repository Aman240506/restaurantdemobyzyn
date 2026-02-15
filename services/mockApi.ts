
import { Reservation, Order, User, ReservationStatus, MenuItem } from '../types';
import { MENU_ITEMS } from '../constants';

const STORAGE_KEYS = {
  RESERVATIONS: 'royal_spice_reservations',
  ORDERS: 'royal_spice_orders',
  USER: 'royal_spice_user',
  USERS_LIST: 'royal_spice_users_all',
  MENU: 'royal_spice_menu_items'
};

const getFromStorage = <T,>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveToStorage = <T,>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Seed menu if not exists
if (!localStorage.getItem(STORAGE_KEYS.MENU)) {
  saveToStorage(STORAGE_KEYS.MENU, MENU_ITEMS);
}

export const api = {
  // --- Auth Backend ---
  register: async (userData: Omit<User, 'id' | 'role'> & { password?: string }): Promise<User> => {
    const users = getFromStorage<User & { password?: string }>(STORAGE_KEYS.USERS_LIST);
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Email already registered.');
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.email.includes('admin') ? 'ADMIN' : 'USER'
    };

    saveToStorage(STORAGE_KEYS.USERS_LIST, [...users, { ...newUser, password: userData.password }]);
    return newUser;
  },

  login: async (email: string, password?: string): Promise<User> => {
    const users = getFromStorage<User & { password?: string }>(STORAGE_KEYS.USERS_LIST);
    let user = users.find(u => u.email === email);

    if (!user) {
      // For demo purposes, we auto-register simple users, but check password if it was registered
      user = await api.register({ name: email.split('@')[0], email, phone: '0000000000' });
    } else if (password && user.password && user.password !== password) {
      throw new Error('Invalid credentials.');
    }

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // --- Menu Backend ---
  getMenu: async (): Promise<MenuItem[]> => {
    return getFromStorage<MenuItem>(STORAGE_KEYS.MENU);
  },

  // --- QR Code Backend ---
  getMenuItemQr: async (itemId: string): Promise<string> => {
    // Simulated backend call to generate a QR code for a specific menu item
    // Returns a URL to the QR code generator with the specific item deep link
    const baseUrl = window.location.origin;
    const deepLink = `${baseUrl}#item-${itemId}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(deepLink)}`;
  },

  // --- Reservations Backend ---
  getReservations: async (): Promise<Reservation[]> => {
    return getFromStorage<Reservation>(STORAGE_KEYS.RESERVATIONS);
  },

  createReservation: async (data: Omit<Reservation, 'id' | 'status'>): Promise<Reservation> => {
    const reservations = getFromStorage<Reservation>(STORAGE_KEYS.RESERVATIONS);
    const conflict = reservations.some(r => r.date === data.date && r.timeSlot === data.timeSlot && r.status !== ReservationStatus.CANCELLED);
    if (conflict) throw new Error('Selected time slot is already fully booked.');

    const newReservation: Reservation = {
      ...data,
      id: 'RES' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      status: ReservationStatus.PENDING
    };

    saveToStorage(STORAGE_KEYS.RESERVATIONS, [...reservations, newReservation]);
    return newReservation;
  },

  updateReservationStatus: async (id: string, status: ReservationStatus): Promise<void> => {
    const reservations = getFromStorage<Reservation>(STORAGE_KEYS.RESERVATIONS);
    const updated = reservations.map(r => r.id === id ? { ...r, status } : r);
    saveToStorage(STORAGE_KEYS.RESERVATIONS, updated);
  },

  // --- Orders Backend ---
  getOrders: async (): Promise<Order[]> => {
    return getFromStorage<Order>(STORAGE_KEYS.ORDERS);
  },

  createOrder: async (order: Omit<Order, 'id' | 'createdAt' | 'paymentStatus'>): Promise<Order> => {
    const orders = getFromStorage<Order>(STORAGE_KEYS.ORDERS);
    const newOrder: Order = {
      ...order,
      id: 'ORD' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      paymentStatus: 'PAID',
      createdAt: new Date().toISOString()
    };
    saveToStorage(STORAGE_KEYS.ORDERS, [...orders, newOrder]);
    return newOrder;
  }
};
