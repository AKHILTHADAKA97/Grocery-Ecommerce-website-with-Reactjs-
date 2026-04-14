import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { featuredProducts } from '../data/products'
import ProductCard from './ProductCard'

export default function ProductCarousel({ onAdd }) {
  const scroller = useRef(null)

  function scroll(dir) {
    const el = scroller.current
    if (!el) return
    const delta = Math.min(el.clientWidth * 0.85, 360)
    el.scrollBy({ left: dir * delta, behavior: 'smooth' })
  }

  const items = featuredProducts()

  return (
    <section className="relative px-4 py-10 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
              Fresh picks
            </p>
            <h2 className="mt-1 text-2xl text-stone-900 md:text-3xl">
              Shop the aisle
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-100 bg-white text-stone-700 shadow-sm transition hover:border-orange-200"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-100 bg-white text-stone-700 shadow-sm transition hover:border-orange-200"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scroller}
          className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 no-scrollbar"
        >
          {items.map(({ cat, product }, i) => (
            <div
              key={`${cat}-${product.id}`}
              className="w-[min(100%,260px)] flex-shrink-0 snap-start px-1 sm:w-[240px]"
            >
              <ProductCard
                cat={cat}
                product={product}
                onAdd={onAdd}
                index={i}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
