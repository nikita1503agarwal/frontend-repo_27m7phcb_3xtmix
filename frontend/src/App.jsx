import { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { motion } from 'framer-motion'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Hero() {
  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950/80 pointer-events-none" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 pt-24 md:pt-32">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md"
        >
          <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Modern onboarding for fintech teams
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-4xl font-semibold tracking-tight md:text-6xl"
        >
          Streamline client onboarding with a glassmorphic 3D experience
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-lg text-slate-300"
        >
          Collect KYC details, track progress, and wow clients with a minimal, digital-first flow.
        </motion.p>

        <div className="mt-4 flex flex-wrap gap-3">
          <a href="#get-started" className="rounded-xl bg-emerald-400 px-5 py-3 font-medium text-slate-900 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300">Get started</a>
          <a href="#clients" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium backdrop-blur-md transition hover:bg-white/10">View demo</a>
        </div>
      </div>
    </section>
  )
}

function ClientForm({ onCreated }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company })
      })
      if (!res.ok) throw new Error('Failed to create client')
      const data = await res.json()
      onCreated?.(data)
      setName(''); setEmail(''); setCompany('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md md:grid-cols-4">
      <input className="rounded-xl bg-slate-900/60 px-4 py-3 text-sm outline-none ring-1 ring-white/10 placeholder:text-slate-500" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
      <input className="rounded-xl bg-slate-900/60 px-4 py-3 text-sm outline-none ring-1 ring-white/10 placeholder:text-slate-500" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input className="rounded-xl bg-slate-900/60 px-4 py-3 text-sm outline-none ring-1 ring-white/10 placeholder:text-slate-500" placeholder="Company (optional)" value={company} onChange={e=>setCompany(e.target.value)} />
      <button disabled={loading} className="rounded-xl bg-emerald-400 px-5 py-3 font-medium text-slate-900 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300 disabled:opacity-50">{loading? 'Adding...' : 'Add client'}</button>
      {error && <p className="col-span-full text-sm text-red-400">{error}</p>}
    </form>
  )
}

function ClientsList() {
  const [clients, setClients] = useState([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')

  async function load() {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (status) params.set('status', status)
    const res = await fetch(`${API_BASE}/clients?${params.toString()}`)
    const data = await res.json()
    setClients(data)
  }

  useEffect(() => { load() }, [])

  return (
    <section id="clients" className="relative mx-auto max-w-6xl px-6 py-16 text-white">
      <div className="mb-6 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <h2 className="text-2xl font-semibold">Clients</h2>
        <div className="flex gap-2">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search" className="rounded-xl bg-slate-900/60 px-4 py-2 text-sm outline-none ring-1 ring-white/10 placeholder:text-slate-500" />
          <select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-xl bg-slate-900/60 px-4 py-2 text-sm outline-none ring-1 ring-white/10">
            <option value="">All</option>
            <option value="new">New</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={load} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-md">Refresh</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {clients.map(c => (
          <div key={c.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium">{c.name}</p>
                <p className="text-sm text-slate-400">{c.email} {c.company ? ` • ${c.company}` : ''}</p>
              </div>
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs text-emerald-300 ring-1 ring-emerald-400/30">{c.status}</span>
            </div>
          </div>
        ))}
        {clients.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300 backdrop-blur-md">No clients yet. Add your first client above.</div>
        )}
      </div>
    </section>
  )
}

export default function App() {
  const [lastCreated, setLastCreated] = useState(null)

  return (
    <div className="min-h-screen w-full bg-slate-950">
      <Hero />
      <main id="get-started" className="mx-auto max-w-6xl px-6 py-12">
        <ClientForm onCreated={setLastCreated} />
        <ClientsList key={lastCreated?.id || 'list'} />
      </main>
      <footer className="mx-auto max-w-6xl px-6 py-12 text-slate-400">
        <p className="text-sm">Built for modern fintech onboarding • Secure, minimal, and fast</p>
      </footer>
    </div>
  )
}
