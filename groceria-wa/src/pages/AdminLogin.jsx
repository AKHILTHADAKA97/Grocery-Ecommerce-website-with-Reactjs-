import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const { admin, login } = useAuth()
  const navigate = useNavigate()
  const loc = useLocation()
  const from = loc.state?.from || '/admin'

  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')

  if (admin) {
    return <Navigate to="/admin" replace />
  }

  function submit(e) {
    e.preventDefault()
    const r = login(user, pass)
    if (r.ok) navigate(from, { replace: true })
    else setErr(r.error || 'Login failed')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fff8f3] via-white to-orange-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[2rem] border border-orange-100 bg-white p-8 shadow-xl shadow-orange-500/10"
      >
        <p className="text-center font-[family-name:var(--font-display)] text-2xl font-semibold text-stone-900">
          groceria<span className="text-orange-500">.</span>
        </p>
        <p className="mt-1 text-center text-sm text-stone-500">Admin access</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block text-sm">
            <span className="text-stone-600">Username</span>
            <input
              autoComplete="username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="mt-1 w-full rounded-xl border border-orange-100 px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
            />
          </label>
          <label className="block text-sm">
            <span className="text-stone-600">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="mt-1 w-full rounded-xl border border-orange-100 px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
            />
          </label>
          {err && <p className="text-sm font-medium text-red-600">{err}</p>}
          <button
            type="submit"
            className="w-full rounded-2xl bg-stone-900 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-stone-800"
          >
            Sign in
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-stone-400">
          Demo: <code className="rounded bg-orange-50 px-1">Admin</code> /{' '}
          <code className="rounded bg-orange-50 px-1">9121751697</code>
        </p>
        <Link
          to="/"
          className="mt-6 block text-center text-sm font-semibold text-orange-600 hover:underline"
        >
          ← Back to store
        </Link>
      </motion.div>
    </div>
  )
}
