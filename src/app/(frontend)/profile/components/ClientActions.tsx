'use client'

import { useState } from 'react'
import { LogOut, Edit3, X, User, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      await fetch('/api/users/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch (err) {
      console.error('Logout error:', err)
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="mt-12 text-center">
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#5B2EFF] font-bold text-sm rounded-2xl transition-all duration-200 shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        {isLoggingOut ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  )
}

export function EditProfileModal({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/users/${user?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (res.ok) {
        const updatedUser = { ...user, name }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setIsOpen(false)
        router.refresh()
      }
    } catch (err) {
      console.error('Failed to update profile:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#5B2EFF]/30 hover:border-[#5B2EFF] text-[#5B2EFF] font-bold text-xs rounded-xl hover:bg-[#5B2EFF]/5 transition-all duration-200 active:scale-95 cursor-pointer"
      >
        <Edit3 className="w-3.5 h-3.5" />
        Edit Profile
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#11145A]/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-extrabold text-[#11145A] mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#5B2EFF]" /> Edit Profile
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[#11145A] font-semibold focus:outline-none focus:border-[#5B2EFF] focus:bg-white transition"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#5B2EFF] hover:bg-[#4c22e0] text-white font-bold text-xs rounded-xl transition shadow-md shadow-[#5B2EFF]/20 active:scale-95 disabled:opacity-50"
                >
                  {saving ? (
                    'Saving...'
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
