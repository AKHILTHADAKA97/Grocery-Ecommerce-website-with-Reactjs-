import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { CATEGORIES } from '../data/products'

export default function CategoryGrid() {
  return (
    <section className="px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
            Browse
          </p>
          <h2 className="mt-1 text-2xl text-stone-900 md:text-3xl">
            Shop by category
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to={`/c/${c.id}`}
                className="group relative block aspect-[16/10] overflow-hidden rounded-3xl ring-1 ring-orange-100/60"
              >
                <img
                  src={c.img}
                  alt=""
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/85 via-stone-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5 text-white">
                  <span className="font-[family-name:var(--font-display)] text-xl font-semibold">
                    {c.label}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur transition group-hover:bg-white/25">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
