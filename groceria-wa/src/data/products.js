export const USD_TO_INR = 94

/** @param {number} usd */
export function usdToInr(usd) {
  return Math.round(usd * USD_TO_INR)
}

/** @typedef {{ id: string, name: string, desc: string, price: number, old?: number, usd: number, oldUsd?: number, img: string, badge?: string, tint: string }} Product */

/** @type {Record<string, Product[]>} */
export const PRODUCTS_BY_CAT = {
  vegetables: [
    {
      id: 'v1',
      name: 'Fresh Carrot',
      desc: 'Orange (loose), 1 kg',
      usd: 2.9,
      oldUsd: 6.9,
      price: usdToInr(2.9),
      old: usdToInr(6.9),
      img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&q=80',
      badge: '58% off',
      tint: 'from-orange-100 to-orange-50',
    },
    {
      id: 'v2',
      name: 'Red Capsicum',
      desc: 'Premium pack, 500 g',
      usd: 3.4,
      oldUsd: 7.2,
      price: usdToInr(3.4),
      old: usdToInr(7.2),
      img: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&q=80',
      badge: '45% off',
      tint: 'from-rose-100 to-orange-50',
    },
    {
      id: 'v3',
      name: 'Mustard Greens',
      desc: 'Washed, 250 g',
      usd: 1.8,
      price: usdToInr(1.8),
      img: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600&q=80',
      badge: 'New',
      tint: 'from-lime-100 to-emerald-50',
    },
    {
      id: 'v4',
      name: 'Radish Bunch',
      desc: 'With tops, 300 g',
      usd: 2.2,
      oldUsd: 4.5,
      price: usdToInr(2.2),
      old: usdToInr(4.5),
      img: 'https://images.unsplash.com/photo-1592419044703-9b1b1230e4d8?w=600&q=80',
      badge: '51% off',
      tint: 'from-fuchsia-100 to-pink-50',
    },
  ],
  fruits: [
    {
      id: 'f1',
      name: 'Hass Avocado',
      desc: 'Ripe, pack of 2',
      usd: 4.5,
      price: usdToInr(4.5),
      img: 'https://images.unsplash.com/photo-1523049673851-e18809a296e3?w=600&q=80',
      badge: 'Organic',
      tint: 'from-lime-100 to-green-50',
    },
    {
      id: 'f2',
      name: 'Blueberries',
      desc: '125 g punnet',
      usd: 5.9,
      oldUsd: 7.9,
      price: usdToInr(5.9),
      old: usdToInr(7.9),
      img: 'https://images.unsplash.com/photo-1498557850526-f13f49d973bb?w=600&q=80',
      badge: 'Sale',
      tint: 'from-indigo-100 to-blue-50',
    },
    {
      id: 'f3',
      name: 'Mango Alphonso',
      desc: 'Box of 6',
      usd: 12.9,
      price: usdToInr(12.9),
      img: 'https://images.unsplash.com/photo-1605027990121-c436e7bbc39c?w=600&q=80',
      tint: 'from-amber-100 to-yellow-50',
    },
  ],
  spices: [
    {
      id: 's1',
      name: 'Black Pepper',
      desc: 'Whole, 100 g',
      usd: 3.2,
      price: usdToInr(3.2),
      img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
      tint: 'from-stone-200 to-stone-50',
    },
    {
      id: 's2',
      name: 'Turmeric Powder',
      desc: 'Pure, 200 g',
      usd: 2.4,
      price: usdToInr(2.4),
      img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80',
      tint: 'from-yellow-100 to-amber-50',
    },
  ],
  dairy: [
    {
      id: 'd1',
      name: 'Farm Milk',
      desc: 'Full cream, 1 L',
      usd: 1.9,
      price: usdToInr(1.9),
      img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&q=80',
      tint: 'from-sky-100 to-blue-50',
    },
    {
      id: 'd2',
      name: 'Greek Yogurt',
      desc: 'Natural, 400 g',
      usd: 3.1,
      oldUsd: 3.9,
      price: usdToInr(3.1),
      old: usdToInr(3.9),
      img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
      badge: '20% off',
      tint: 'from-violet-100 to-purple-50',
    },
  ],
  grains: [
    {
      id: 'g1',
      name: 'Basmati Rice',
      desc: 'Aged, 5 kg',
      usd: 18.5,
      price: usdToInr(18.5),
      img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
      tint: 'from-amber-100 to-orange-50',
    },
    {
      id: 'g2',
      name: 'Quinoa Mix',
      desc: 'Tri-colour, 500 g',
      usd: 6.4,
      price: usdToInr(6.4),
      img: 'https://images.unsplash.com/photo-1517673400267-0259440b07c0?w=600&q=80',
      tint: 'from-orange-100 to-amber-50',
    },
  ],
}

export const UPCOMING_ITEMS = [
  {
    id: 'u1',
    name: 'Cold-Pressed Orange Juice',
    eta: 'Next week',
    usd: 2.7,
    price: usdToInr(2.7),
    img: 'https://images.unsplash.com/photo-1542444459-db47a5d0c7b5?w=800&q=80',
  },
  {
    id: 'u2',
    name: 'Millets Combo Pack',
    eta: 'In 10 days',
    usd: 8.9,
    price: usdToInr(8.9),
    img: 'https://images.unsplash.com/photo-1604908176997-125f25cc5008?w=800&q=80',
  },
  {
    id: 'u3',
    name: 'Exotic Mushrooms (Oyster)',
    eta: 'Soon',
    usd: 3.8,
    price: usdToInr(3.8),
    img: 'https://images.unsplash.com/photo-1506807803488-8eafc15323a8?w=800&q=80',
  },
  {
    id: 'u4',
    name: 'Organic Honey (Raw)',
    eta: 'Soon',
    usd: 6.6,
    price: usdToInr(6.6),
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80',
  },
]


export const CATEGORIES = [
  {
    id: 'vegetables',
    label: 'Vegetables',
    img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80',
  },
  {
    id: 'fruits',
    label: 'Fruits',
    img: 'https://images.unsplash.com/photo-1610832958506-aa563681fecf?w=800&q=80',
  },
  {
    id: 'spices',
    label: 'Spices',
    img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80',
  },
  {
    id: 'dairy',
    label: 'Dairy',
    img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80',
  },
  {
    id: 'grains',
    label: 'Grains',
    img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
  },
]

export function getProductByCategory(catId) {
  return PRODUCTS_BY_CAT[catId] || []
}

export function findProduct(catId, productId) {
  const list = PRODUCTS_BY_CAT[catId]
  if (!list) return null
  return list.find((p) => p.id === productId) || null
}

export function searchProducts(q) {
  const term = q.trim().toLowerCase()
  if (term.length < 2) return []
  /** @type {{ cat: string, product: Product }[]} */
  const out = []
  for (const cat of Object.keys(PRODUCTS_BY_CAT)) {
    for (const p of PRODUCTS_BY_CAT[cat]) {
      if (
        p.name.toLowerCase().includes(term) ||
        p.desc.toLowerCase().includes(term)
      ) {
        out.push({ cat, product: p })
      }
    }
  }
  return out
}

export function featuredProducts() {
  return [
    { cat: 'vegetables', id: 'v1' },
    { cat: 'vegetables', id: 'v2' },
    { cat: 'fruits', id: 'f1' },
    { cat: 'fruits', id: 'f2' },
    { cat: 'dairy', id: 'd2' },
    { cat: 'spices', id: 's1' },
    { cat: 'grains', id: 'g1' },
    { cat: 'vegetables', id: 'v3' },
  ]
    .map(({ cat, id }) => {
      const p = findProduct(cat, id)
      return p ? { cat, product: p } : null
    })
    .filter(Boolean)
}
