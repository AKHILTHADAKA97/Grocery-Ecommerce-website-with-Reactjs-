import { AnimatePresence, motion } from 'framer-motion'

export default function Toast({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-[120] -translate-x-1/2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
