import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'

export default function AdminCalendarFab() {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={() =>
        document
          .getElementById('admin-calendar-panel')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      className="fixed bottom-6 right-5 z-[130] flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600"
      aria-label="Open calendar"
      title="Open calendar"
    >
      <CalendarDays className="h-5 w-5" />
    </motion.button>
  )
}
