export const menuCategories = [
  {
    key: "men",
    label: "Men",
    items: [
      "shoes",
      "t-shirts",
      "hoodies",
      "jackets",
      "pants",
      "shorts",
      "polos",
      "jeans",
      "accessories",
    ],
  },
  {
    key: "women",
    label: "Women",
    items: [
      "shoes",
      "t-shirts",
      "hoodies",
      "jackets",
      "pants",
      "shorts",
      "dresses",
      "skirts",
      "leggings",
      "accessories",
    ],
  },
  {
    key: "kids",
    label: "Kids",
    items: [
      "shoes",
      "t-shirts",
      "hoodies",
      "sets",
      "pants",
      "shorts",
      "jackets",
      "accessories",
    ],
  },
];

// Matches the sub-slugs used in CategoryPage's sale filtering
export const saleSubCategories = [
  "shoes",
  "t-shirts",
  "hoodies",
  "jackets",
  "pants",
  "shorts",
  "accessories",
];

export const collections = [
 
];

export type Tab = 'men' | 'women' | 'kids';
export type Category = 'apparel' | 'shoes';

export interface SizeData {
  headers: string[];
  rows: string[][];
  note?: string;
}

export const sizeGuideData: Record<Tab, Record<Category, SizeData>> = {
  men: {
    apparel: {
      headers: ['Size', 'Chest (in)', 'Waist (in)'],
      rows: [
        ['XS', '31.5 – 35', '25.5 – 29'],
        ['S', '35 – 37.5', '29 – 32'],
        ['M', '37.5 – 41', '32 – 35'],
        ['L', '41 – 44', '35 – 38'],
        ['XL', '44 – 48.5', '38 – 43'],
        ['XXL', '48.5 – 53.5', '43 – 47.5'],
      ],
    },
    shoes: {
      headers: ['US', 'UK', 'EU', 'CM'],
      rows: [
        ['6', '5.5', '38.5', '24'],
        ['7', '6', '40', '25'],
        ['8', '7', '41', '26'],
        ['9', '8', '42.5', '27'],
        ['10', '9', '44', '28'],
        ['11', '10', '45', '29'],
        ['12', '11', '46', '30'],
      ],
    },
  },

  women: {
    apparel: {
      headers: ['Size', 'Bust (in)', 'Waist (in)'],
      rows: [
        ['XS', '29.5 – 32.5', '23.5 – 26'],
        ['S', '32.5 – 35.5', '26 – 29'],
        ['M', '35.5 – 38', '29 – 31.5'],
        ['L', '38 – 41', '31.5 – 34.5'],
        ['XL', '41 – 44.5', '34.5 – 38.5'],
        ['XXL', '44.5 – 48.5', '38.5 – 42.5'],
      ],
    },
    shoes: {
      headers: ['US', 'UK', 'EU', 'CM'],
      rows: [
        ['5', '2.5', '35.5', '22'],
        ['6', '3.5', '36.5', '23'],
        ['7', '4.5', '38', '24'],
        ['8', '5.5', '39', '25'],
        ['9', '6.5', '40.5', '26'],
        ['10', '7.5', '42', '27'],
        ['11', '8.5', '43', '28'],
      ],
    },
  },

  kids: {
    apparel: {
      headers: ['Size', 'Numeric', 'Chest (in)', 'Waist (in)'],
      rows: [
        ['XS', '6–7', '24 – 25.5', '19.5 – 22'],
        ['S', '8–9', '25.5 – 27.5', '22 – 24.5'],
        ['M', '10–12', '27.5 – 30', '24.5 – 26.5'],
        ['L', '14–16', '30 – 33', '26.5 – 29'],
        ['XL', '18–20', '33 – 36', '29 – 31.5'],
      ],
      note: 'Kids sizing is now unified — no longer split by boys/girls.',
    },
    shoes: {
      headers: ['US', 'UK', 'EU', 'CM'],
      rows: [
        ['1Y', '0.5', '32', '19'],
        ['2Y', '1.5', '33.5', '20'],
        ['3Y', '2.5', '35', '21'],
        ['4Y', '3.5', '36', '22'],
        ['5Y', '4.5', '37.5', '23'],
        ['6Y', '5.5', '38.5', '24'],
        ['7Y', '6.5', '40', '25'],
      ],
      note: 'Y = Youth sizing. Trace foot on paper for best fit.',
    },
  },
};




//orders

export const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  PENDING:   { label: "Pending",   color: "text-amber-600",   dot: "bg-amber-400"   },
  CONFIRMED: { label: "Confirmed", color: "text-blue-600",    dot: "bg-blue-400"    },
  SHIPPED:   { label: "Shipped",   color: "text-violet-600",  dot: "bg-violet-400"  },
  DELIVERED: { label: "Delivered", color: "text-emerald-600", dot: "bg-emerald-400" },
  CANCELLED: { label: "Cancelled", color: "text-red-500",     dot: "bg-red-400"     },
};

export const PAYMENT_CONFIG: Record<string, { label: string; color: string }> = {
  PAID:    { label: "Paid",    color: "text-emerald-600" },
  UNPAID:  { label: "Unpaid",  color: "text-red-500"     },
  PARTIAL: { label: "Partial", color: "text-amber-600"   },
};