export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: string;
  currency: string;
  description: string;
  specs: { label: string; value: string }[];
  images: string[];
  edition: string;
  rating: number;
}

export const products: Product[] = [
  {
    id: 'chronograph-elite',
    name: 'Chronograph 精英',
    tagline: 'Precision in Every Tick',
    price: '12800',
    currency: 'USD',
    description: 'The Chronograph 精英 represents the pinnacle of horological engineering. Its automatic movement ensures unparalleled accuracy, while the sapphire crystal protects the dial from scratches.',
    specs: [
      { label: 'Movement', value: 'Automatic' },
      { label: 'Case Material', value: '18K Gold' },
      { label: 'Water Resistance', value: '100m' },
      { label: 'Case Diameter', value: '41mm' },
      { label: 'Crystal', value: 'Sapphire' },
      { label: 'Power Reserve', value: '72 hours' },
    ],
    images: [
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&q=80',
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80',
    ],
    edition: 'Limited Edition',
    rating: 4.9,
  },
  {
    id: 'diver-pro',
    name: 'Diver Pro',
    tagline: 'Conquer the Depths',
    price: '8900',
    currency: 'USD',
    description: 'Engineered for the ocean explorer, the Diver Pro combines robust construction with elegant design. Featuring a unidirectional rotating bezel and helium escape valve.',
    specs: [
      { label: 'Movement', value: 'Automatic' },
      { label: 'Case Material', value: 'Stainless Steel' },
      { label: 'Water Resistance', value: '300m' },
      { label: 'Case Diameter', value: '44mm' },
      { label: 'Crystal', value: 'Sapphire' },
      { label: 'Power Reserve', value: '80 hours' },
    ],
    images: [
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&q=80',
      'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800&q=80',
    ],
    edition: 'Professional Series',
    rating: 4.8,
  },
  {
    id: 'pilot-heritage',
    name: 'Pilot Heritage',
    tagline: 'Legacy of the Skies',
    price: '9600',
    currency: 'USD',
    description: 'Inspired by aviation instruments from the golden era, the Pilot Heritage features large Arabic numerals, anti-magnetic properties, and a vintage leather strap.',
    specs: [
      { label: 'Movement', value: 'Automatic' },
      { label: 'Case Material', value: 'Bronze' },
      { label: 'Water Resistance', value: '50m' },
      { label: 'Case Diameter', value: '42mm' },
      { label: 'Crystal', value: 'Mineral' },
      { label: 'Power Reserve', value: '48 hours' },
    ],
    images: [
      'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&q=80',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&q=80',
      'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800&q=80',
    ],
    edition: 'Heritage Collection',
    rating: 4.7,
  },
  {
    id: 'skeleton-gmt',
    name: 'Skeleton GMT',
    tagline: 'Transparent Excellence',
    price: '14500',
    currency: 'USD',
    description: 'A masterpiece of transparency, the Skeleton GMT reveals the intricate ballet of gears and springs within. The dual time zone complication is perfect for the seasoned traveler.',
    specs: [
      { label: 'Movement', value: 'Automatic' },
      { label: 'Case Material', value: '18K Rose Gold' },
      { label: 'Water Resistance', value: '50m' },
      { label: 'Case Diameter', value: '40mm' },
      { label: 'Crystal', value: 'Sapphire' },
      { label: 'Power Reserve', value: '96 hours' },
    ],
    images: [
      'https://images.unsplash.com/photo-1526045431048-f857369baa09?w=800&q=80',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&q=80',
      'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800&q=80',
    ],
    edition: 'Artisan Series',
    rating: 4.9,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}