import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'

const slides = [
  {
    title: 'From farm to your kitchen.',
    sub: 'Discover the freshest and finest groceries delivered quickly and conveniently.',
    img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80',
    cta: '/c/vegetables',
  },
  {
    title: 'Seasonal fruit, peak flavour.',
    sub: 'Hand-picked produce with transparent sourcing and chilled delivery.',
    img: 'https://i.postimg.cc/ZRGts2Fv/c420d5cd7f846432f58906cc185e3cf2.jpg',
    cta: '/c/fruits',
  },
]

export default function HeroSection() {
  return (
    <section className="relative px-4 pt-6 md:px-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] shadow-soft ring-1 ring-orange-100/60">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          loop
          autoplay={{ delay: 5200, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="hero-swiper pb-10"
        >
          {slides.map((s) => (
            <SwiperSlide key={s.title}>
              <div className="grid min-h-[320px] gap-0 md:min-h-[380px] md:grid-cols-2">
                <div className="relative flex flex-col justify-center bg-gradient-to-br from-[#fff8f3] via-white to-orange-50 px-6 py-10 md:px-12">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-700">
                      WhatsApp grocery
                    </p>
                    <h1 className="mb-4 max-w-md text-4xl leading-[1.1] text-stone-900 md:text-5xl">
                      {s.title}
                    </h1>
                    <p className="mb-8 max-w-md text-sm text-stone-600 md:text-base">
                      {s.sub}
                    </p>
                    <Link
                      to={s.cta}
                      className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition hover:shadow-xl"
                    >
                      Shop Now
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                        <ShoppingBag className="h-4 w-4" />
                      </span>
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </Link>
                  </motion.div>
                </div>
                <div className="relative min-h-[240px] bg-stone-100 md:min-h-0">
                  <img
                    src={s.img}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent md:bg-gradient-to-l md:from-transparent md:to-black/10" />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="absolute bottom-4 right-4 max-w-[220px] rounded-2xl bg-white/95 p-3 text-xs font-semibold text-stone-800 shadow-xl backdrop-blur md:bottom-8 md:right-8"
                  >
                    <span className="mr-1">🍆</span>
                    51% OFF! Get up to 2 qty at ₹1,786 — T&amp;C apply.
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
