import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-orange-100 bg-gradient-to-b from-[#fff8f3] to-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-stone-900">
              groceria<span className="text-orange-500">.</span>
            </p>
            <p className="mt-3 max-w-sm text-sm text-stone-600">
              WhatsApp-first grocery shopping — curated produce, pantry staples,
              and instant support.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-stone-500">
              Shop
            </p>
            <ul className="mt-3 space-y-2 text-sm text-stone-700">
              <li>
                <Link to="/c/vegetables" className="hover:text-orange-600">
                  Vegetables
                </Link>
              </li>
              <li>
                <Link to="/c/fruits" className="hover:text-orange-600">
                  Fruits
                </Link>
              </li>
              <li>
                <Link to="/c/spices" className="hover:text-orange-600">
                  Spices
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-stone-500">
              Operations
            </p>
            <ul className="mt-3 space-y-2 text-sm text-stone-700">
              <li>
                <Link to="/admin/login" className="hover:text-orange-600">
                  Admin login
                </Link>
              </li>
              <li className="text-stone-500">Returns &amp; freshness guarantee</li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} groceria. — Orders stored locally in your
          browser (JSON).{' '}
          <span className="mx-2 text-stone-300">|</span>
          Designed &amp; Developed by{' '}
          <a
            className="inline-flex items-center gap-1 font-semibold text-stone-700 hover:text-orange-600"
            href="https://github.com/AKHILTHADAKA97/"
            target="_blank"
            rel="noreferrer"
          >
            AKHILTHADAKA{' '}
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4"
              fill="currentColor"
            >
              <path d="M12 .5C5.73.5.75 5.7.75 12.18c0 5.17 3.3 9.55 7.88 11.1.58.1.79-.26.79-.57 0-.28-.01-1.02-.02-2-3.2.72-3.88-1.6-3.88-1.6-.52-1.38-1.27-1.75-1.27-1.75-1.04-.74.08-.73.08-.73 1.15.08 1.75 1.23 1.75 1.23 1.02 1.8 2.68 1.28 3.33.98.1-.76.4-1.28.72-1.57-2.55-.3-5.23-1.33-5.23-5.9 0-1.3.44-2.36 1.17-3.19-.12-.3-.51-1.52.11-3.16 0 0 .96-.32 3.14 1.22a10.5 10.5 0 0 1 2.86-.4c.97 0 1.95.14 2.86.4 2.18-1.54 3.14-1.22 3.14-1.22.62 1.64.23 2.86.11 3.16.73.83 1.17 1.9 1.17 3.19 0 4.58-2.69 5.6-5.25 5.9.41.37.78 1.1.78 2.22 0 1.6-.02 2.89-.02 3.28 0 .32.2.68.8.56 4.57-1.56 7.86-5.94 7.86-11.1C23.25 5.7 18.27.5 12 .5z" />
            </svg>
          </a>
        </p>
      </div>
    </footer>
  )
}
