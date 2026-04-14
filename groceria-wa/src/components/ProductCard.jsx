import { motion } from 'framer-motion'
import { Heart, Plus } from 'lucide-react'
import { formatMoney } from '../lib/format'
import { useWishlist } from '../context/WishlistContext'

export default function ProductCard({ cat, product, onAdd, index = 0 }) {
  const { has, toggle } = useWishlist()
  const liked = has(cat, product.id)
  const pct =
    product.old && product.old > product.price
      ? Math.round((1 - product.price / product.old) * 100)
      : null

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.45 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-orange-100/50 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        className={`relative aspect-[4/3] bg-gradient-to-b ${product.tint} overflow-hidden`}
      >
        {pct ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-stone-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {pct}% off
          </span>
        ) : product.badge ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-orange-700 shadow">
            {product.badge}
          </span>
        ) : null}
        <img
          src={product.img}
          alt=""
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <button
          type="button"
          onClick={() => toggle(cat, product.id)}
          className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border bg-white/95 shadow-sm transition ${
            liked
              ? 'border-orange-200 text-orange-600'
              : 'border-orange-100 text-stone-500 hover:text-orange-600'
          }`}
          aria-label={liked ? 'Remove from liked' : 'Add to liked'}
        >
          <Heart className="h-4 w-4" fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-stone-900">
          Fresh! {product.name}
        </h3>
        <p className="mt-1 text-xs text-stone-500">{product.desc}</p>
        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <p className="text-lg font-bold text-stone-900">
              {formatMoney(product.price)}
            </p>
            {product.old ? (
              <p className="text-xs text-stone-400 line-through">
                {formatMoney(product.old)}
              </p>
            ) : null}
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => onAdd(cat, product)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-md shadow-orange-500/30 transition hover:bg-orange-600"
            aria-label={`Add ${product.name}`}
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}
