import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { homeFor } from '../components/RequireAuth'
import AuthCard from '../components/AuthCard'

export default function Login() {
  const { user, login } = useAuth()
  const nav = useNavigate()
  const location = useLocation()
  const [f, setF] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={homeFor(user)} replace />

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    const res = await login(f.email, f.password)
    setBusy(false)
    if (!res.ok) return setError(res.error)
    const from = location.state?.from
    nav(from && res.user.role !== 'admin' ? from : homeFor(res.user), { replace: true })
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to manage your store."
      footer={<>New here? <Link className="font-medium text-brand" to="/signup">Create a seller account</Link></>}
    >
      <form className="grid gap-4" onSubmit={submit}>
        <label className="grid gap-1 text-sm font-medium">Email
          <input required type="email" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        </label>
        <label className="grid gap-1 text-sm font-medium">Password
          <input required type="password" autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        </label>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button className="btn disabled:opacity-60" disabled={busy}>{busy ? 'Logging in...' : 'Log in'}</button>
      </form>
    </AuthCard>
  )
}
