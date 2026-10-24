import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { homeFor } from '../components/RequireAuth'
import AuthCard from '../components/AuthCard'

export default function Signup() {
  const { user, signup } = useAuth()
  const nav = useNavigate()
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  if (user) return <Navigate to={homeFor(user)} replace />

  const submit = async (e) => {
    e.preventDefault()
    if (f.password.length < 6) return setError('Password must be at least 6 characters.')
    if (f.password !== f.confirm) return setError('Passwords do not match.')
    setBusy(true)
    const res = await signup(f)
    setBusy(false)
    if (!res.ok) return setError(res.error)
    nav('/setup', { replace: true })
  }

  return (
    <AuthCard
      title="Create your seller account"
      subtitle="Start selling in minutes."
      footer={<>Already have an account? <Link className="font-medium text-brand" to="/login">Log in</Link></>}
    >
      <form className="grid gap-4" onSubmit={submit}>
        <label className="grid gap-1 text-sm font-medium">Full name
          <input required autoComplete="name" value={f.name} onChange={set('name')} />
        </label>
        <label className="grid gap-1 text-sm font-medium">Email
          <input required type="email" autoComplete="email" value={f.email} onChange={set('email')} />
        </label>
        <label className="grid gap-1 text-sm font-medium">Password
          <input required type="password" autoComplete="new-password" value={f.password} onChange={set('password')} />
        </label>
        <label className="grid gap-1 text-sm font-medium">Confirm password
          <input required type="password" autoComplete="new-password" value={f.confirm} onChange={set('confirm')} />
        </label>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button className="btn disabled:opacity-60" disabled={busy}>{busy ? 'Creating...' : 'Create account'}</button>
      </form>
    </AuthCard>
  )
}
