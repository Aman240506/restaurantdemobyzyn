
import { MenuItem, Category, SpiceLevel } from './types';

export const MENU_ITEMS: MenuItem[] = [
  // Thalis
  {
    id: 't1',
    category: Category.THALIS,
    name: 'Veg Deluxe Thali',
    description: 'A royal spread featuring Paneer, Dal Makhani, Mixed Veg, Rice, Naan, Raita, and Sweets.',
    priceMin: 350,
    priceMax: 440,
    isVeg: true,
    spiceLevel: SpiceLevel.MEDIUM,
    image: 'https://images.unsplash.com/photo-1601050638917-3d0663023196?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 't2',
    category: Category.THALIS,
    name: 'Non-Veg Deluxe Thali',
    description: 'A feast with Chicken Curry, Biryani, Mutton Sekh, Raita, and authentic desserts.',
    priceMin: 450,
    priceMax: 495,
    isVeg: false,
    spiceLevel: SpiceLevel.MEDIUM,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
  },
  // Main Course Veg
  {
    id: 'mv1',
    category: Category.MAIN_VEG,
    name: 'Dal Makhani',
    description: 'Black lentils slow-cooked overnight with cream and butter for ultimate richness.',
    priceMin: 300,
    isVeg: true,
    spiceLevel: SpiceLevel.MILD,
    image: 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mv2',
    category: Category.MAIN_VEG,
    name: 'Paneer Tikka Masala',
    description: 'Char-grilled paneer cubes in a rich tomato and cashew gravy.',
    priceMin: 375,
    isVeg: true,
    spiceLevel: SpiceLevel.MEDIUM,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mv3',
    category: Category.MAIN_VEG,
    name: 'Mixed Vegetable',
    description: 'Assorted seasonal vegetables sautéed with traditional Indian spices.',
    priceMin: 315,
    priceMax: 330,
    isVeg: true,
    spiceLevel: SpiceLevel.MEDIUM,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80'
  },
  // Main Course Non-Veg
  {
    id: 'mnv1',
    category: Category.MAIN_NON_VEG,
    name: 'Butter Chicken',
    description: 'Tender chicken pieces (2 pcs) in a smooth, creamy tomato-based gravy.',
    priceMin: 320,
    priceMax: 330,
    isVeg: false,
    spiceLevel: SpiceLevel.MILD,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mnv2',
    category: Category.MAIN_NON_VEG,
    name: 'Mutton Rogan Josh',
    description: 'A signature Kashmiri dish featuring slow-cooked lamb in a rich aromatic gravy.',
    priceMin: 490,
    isVeg: false,
    spiceLevel: SpiceLevel.HOT,
    image: 'https://images.unsplash.com/photo-1542362567-b034333f1a1b?auto=format&fit=crop&w=800&q=80'
  },
  // Starters
  {
    id: 's1',
    category: Category.STARTERS,
    name: 'Paneer Tikka (8 Pcs)',
    description: 'Cottage cheese marinated in yogurt and spices, grilled to perfection.',
    priceMin: 385,
    priceMax: 450,
    isVeg: true,
    spiceLevel: SpiceLevel.MEDIUM,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 's2',
    category: Category.STARTERS,
    name: 'Tandoori Chicken',
    description: 'Classic Indian tandoor-roasted chicken with bone, marinated with special spices.',
    priceMin: 430,
    priceMax: 740,
    isVeg: false,
    spiceLevel: SpiceLevel.MEDIUM,
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80'
  }
];

export const TIME_SLOTS = [
  '12:00 PM', '01:00 PM', '02:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM'
];
