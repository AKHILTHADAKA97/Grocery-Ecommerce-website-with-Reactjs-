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
      img: 'https://i.postimg.cc/XNw3rNgN/ed8e54e3b8203af9cee0fdab8473c990.jpg',
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
      img: 'https://i.postimg.cc/DZkd0c2X/5e11abdafa8613b33ac7d01c80cdd2dc.jpg',
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
      img: 'https://i.postimg.cc/TwJmwM7H/22a9a0d4774827e2ff91774506579247.jpg',
      badge: 'Sale',
      tint: 'from-indigo-100 to-blue-50',
    },
    {
      id: 'f3',
      name: 'Mango Alphonso',
      desc: 'Box of 6',
      usd: 12.9,
      price: usdToInr(12.9),
      img: 'https://i.postimg.cc/QM9ZhjM0/29cf7c04395c7ba3654891d278c241ea.jpg',
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
      img: 'https://i.postimg.cc/7ZhpnqS1/8c1dbc03f4b6f7beaaf7e197517050d4.jpg',
      tint: 'from-orange-100 to-amber-50',
    },
  ],
  seeds: [
    {
      id: 'sd1',
      name: 'Tomato Seeds',
      desc: 'Hybrid packet, 50 seeds',
      usd: 1.5,
      price: usdToInr(1.5),
      img: 'https://i.postimg.cc/BvkLnZBM/ad-e-Bay-5-99-Beefsteak-Tomato-Seeds-Heirloom-Tomato-Seeds-Fresh-NON-GMO-Vegetable-Seeds-Y.jpg',
      badge: 'Best seller',
      tint: 'from-red-100 to-orange-50',
    },
    {
      id: 'sd2',
      name: 'Chilli Seeds',
      desc: 'High germination, 60 seeds',
      usd: 1.4,
      price: usdToInr(1.4),
      img: 'https://i.postimg.cc/m2yHysTf/f10f1c40c5580560e80003b61a484ee8.jpg',
      tint: 'from-rose-100 to-red-50',
    },
    {
      id: 'sd3',
      name: 'Coriander Seeds',
      desc: 'Aroma variety, 80 seeds',
      usd: 1.2,
      price: usdToInr(1.2),
      img: 'https://i.postimg.cc/hvFdp4XH/a13ec7796fcc58abc97afedd22328724.jpg',
      tint: 'from-lime-100 to-emerald-50',
    },
    {
      id: 'sd4',
      name: 'Spinach Seeds',
      desc: 'Fast grow, 100 seeds',
      usd: 1.3,
      price: usdToInr(1.3),
      img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80',
      badge: 'New',
      tint: 'from-green-100 to-lime-50',
    },
    {
      id: 'sd5',
      name: 'Okra Seeds',
      desc: 'Long pod type, 50 seeds',
      usd: 1.6,
      price: usdToInr(1.6),
      img: 'https://i.postimg.cc/ZqM3vx4F/af284998da9545e42fc186ffaebd2f93.jpg',
      tint: 'from-amber-100 to-yellow-50',
    },
    {
      id: 'sd6',
      name: 'Cucumber Seeds',
      desc: 'Tender variety, 45 seeds',
      usd: 1.7,
      oldUsd: 2.1,
      price: usdToInr(1.7),
      old: usdToInr(2.1),
      img: 'https://i.postimg.cc/hjN96bYS/295dc502538a1de2a2ed91de2840e663.jpg',
      badge: 'Sale',
      tint: 'from-emerald-100 to-teal-50',
    },
    {
      id: 'sd7',
      name: 'Brinjal Seeds',
      desc: 'Purple long, 55 seeds',
      usd: 1.4,
      price: usdToInr(1.4),
      img: 'https://i.postimg.cc/y6wPbsq6/859a916718a530c6aa556045c8e250c7.jpg',
      tint: 'from-violet-100 to-purple-50',
    },
    {
      id: 'sd8',
      name: 'Bottle Gourd Seeds',
      desc: 'Climber variety, 40 seeds',
      usd: 1.5,
      price: usdToInr(1.5),
      img: 'https://i.postimg.cc/KYJ3SrRf/b7efe737363ca34ce604b678436f8523.jpg',
      tint: 'from-teal-100 to-cyan-50',
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
    img: 'https://i.postimg.cc/mDn47h5Z/43b9e59db22943da24b85330d1fb13ab.jpg',
  },
  {
    id: 'u2',
    name: 'Millets Combo Pack',
    eta: 'In 10 days',
    usd: 8.9,
    price: usdToInr(8.9),
    img: 'https://i.postimg.cc/3wSNb8c1/7482fb336d5cd52e5a0eef57340edd1c.jpg',
  },
  {
    id: 'u3',
    name: 'Exotic Mushrooms (Oyster)',
    eta: 'Soon',
    usd: 3.8,
    price: usdToInr(3.8),
    img: 'https://i.postimg.cc/kX34HhTP/628ba766cb103d054c1f0576cb328d66.jpg',
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
    img: 'https://i.postimg.cc/5ykVqyKb/76e41daef8b51acc0a9f8696b62a2499.jpg',
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
  {
    id: 'seeds',
    label: 'Seed Selling',
    img: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&q=80',
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
