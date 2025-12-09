import { Category, MenuItem } from './types';

export const INITIAL_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Espresso Romano',
    description: 'Rich espresso with a slice of lemon on the side.',
    price: 3.50,
    category: Category.HOT_COFFEE,
    image: 'https://picsum.photos/400/300?random=1',
    calories: 5
  },
  {
    id: '2',
    name: 'Caramel Macchiato',
    description: 'Freshly steamed milk with vanilla-flavored syrup marked with espresso and topped with a caramel drizzle.',
    price: 5.25,
    category: Category.HOT_COFFEE,
    image: 'https://picsum.photos/400/300?random=2',
    calories: 250
  },
  {
    id: '3',
    name: 'Cold Brew Vanilla',
    description: 'Slow-steeped cool coffee with a touch of vanilla cream.',
    price: 4.75,
    category: Category.ICED_COFFEE,
    image: 'https://picsum.photos/400/300?random=3',
    calories: 120
  },
  {
    id: '4',
    name: 'Matcha Green Tea Latte',
    description: 'Smooth and creamy matcha sweetened just right.',
    price: 5.50,
    category: Category.TEA,
    image: 'https://picsum.photos/400/300?random=4',
    calories: 200
  },
  {
    id: '5',
    name: 'Blueberry Scone',
    description: 'Buttery scone bursting with fresh blueberries.',
    price: 3.00,
    category: Category.BAKERY,
    image: 'https://picsum.photos/400/300?random=5',
    calories: 320
  },
  {
    id: '6',
    name: 'Turkey & Avocado Club',
    description: 'Roasted turkey breast, avocado, bacon, lettuce on sourdough.',
    price: 9.50,
    category: Category.SANDWICHES,
    image: 'https://picsum.photos/400/300?random=6',
    calories: 550
  },
  {
    id: '7',
    name: 'Iced Oat Latte',
    description: 'Espresso chilled and poured over ice with oat milk.',
    price: 6.00,
    category: Category.ICED_COFFEE,
    image: 'https://picsum.photos/400/300?random=7',
    calories: 140
  },
  {
    id: '8',
    name: 'Croissant',
    description: 'Classic french butter croissant, flaky and delicious.',
    price: 3.25,
    category: Category.BAKERY,
    image: 'https://picsum.photos/400/300?random=8',
    calories: 280
  }
];

export const APP_NAME = "Lumina Cafe";
export const CURRENCY = "$";