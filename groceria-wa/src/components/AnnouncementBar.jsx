import { motion } from 'framer-motion'

const items = [
  'Fresh produce — same-day dispatch on orders before 2 PM',
  'Free delivery over ₹3,290 in select zones',
  'WhatsApp checkout — your cart sent in one tap',
  'Use code GROCERIA15 on your first order',
]

export default function AnnouncementBar() {
  return (
    <div className="bg-stone-900 text-white text-xs font-medium py-2 overflow-hidden">
      <motion.div
        className="flex gap-16 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items].map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
