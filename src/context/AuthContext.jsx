import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { collection, deleteDoc, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db, firebaseReady } from '../firebase'

// Accounts are Firebase Authentication users. Each one has a profile document at users/{uid}
// holding name, role ('seller' | 'admin'), status ('active' | 'suspended') and the store details.
const AuthContext = createContext(null)

export const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const messages = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/invalid-email': 'That email address is not valid.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/user-not-found': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'permission-denied': 'Permission denied. Check your Firestore security rules.',
}
const explain = (err) => messages[err.code] ?? err.message

function SetupNotice() {
  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="box max-w-lg p-8">
        <h1 className="text-xl font-bold">Firebase is not connected yet</h1>
        <p className="mt-2 text-slate-600">
          Open the <code>.env</code> file in the project root, paste your Firebase config values into it,
          then stop and restart <code>npm run dev</code>.
        </p>
        <p className="mt-2 text-sm text-slate-500">See <code>.env.example</code> for the variable names.</p>
      </div>
    </div>
  )
}

export function AuthProvider({ children }) {
  const [uid, setUid] = useState(null)
  const [profile, setProfile] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(firebaseReady)

  // Follow the signed-in Firebase user.
  useEffect(() => {
    if (!firebaseReady) return undefined
    return onAuthStateChanged(auth, (u) => {
      setUid(u ? u.uid : null)
      if (!u) {
        setProfile(null)
        setLoading(false)
      }
    })
  }, [])

  // Follow that user's profile document live (so suspensions and store edits apply instantly).
  useEffect(() => {
    if (!uid) return undefined
    return onSnapshot(
      doc(db, 'users', uid),
      (snap) => {
        setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null)
        setLoading(false)
      },
      () => setLoading(false),
    )
  }, [uid])

  // Admins also see every account.
  const isAdmin = profile?.role === 'admin'
  useEffect(() => {
    if (!isAdmin) return undefined
    return onSnapshot(collection(db, 'users'), (snap) => setAccounts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
  }, [isAdmin])

  // A suspended account is treated as signed out.
  const user = profile && profile.status !== 'suspended' ? profile : null

  const signup = async ({ name, email, password }) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
      const data = {
        name: name.trim(),
        email: cred.user.email,
        role: 'seller',
        status: 'active',
        store: null,
        createdAt: new Date().toISOString(),
      }
      await setDoc(doc(db, 'users', cred.user.uid), data)
      setProfile({ id: cred.user.uid, ...data })
      return { ok: true, user: { id: cred.user.uid, ...data } }
    } catch (err) {
      return { ok: false, error: explain(err) }
    }
  }

  const login = async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password)
      const snap = await getDoc(doc(db, 'users', cred.user.uid))
      if (!snap.exists()) {
        await signOut(auth)
        return { ok: false, error: 'This account no longer exists.' }
      }
      const data = { id: snap.id, ...snap.data() }
      if (data.status === 'suspended') {
        await signOut(auth)
        return { ok: false, error: 'This account has been suspended. Contact the platform admin.' }
      }
      return { ok: true, user: data }
    } catch (err) {
      return { ok: false, error: explain(err) }
    }
  }

  const logout = () => signOut(auth)

  const saveStore = (store) => updateDoc(doc(db, 'users', uid), { store: { ...profile.store, ...store } })
  const setAccountStatus = (id, status) => updateDoc(doc(db, 'users', id), { status })
  // Removes the profile and store. The sign-in itself can only be deleted from the Firebase console.
  const deleteAccount = (id) => deleteDoc(doc(db, 'users', id))

  if (!firebaseReady) return <SetupNotice />

  return (
    <AuthContext.Provider value={{ user, loading, accounts, signup, login, logout, saveStore, setAccountStatus, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
