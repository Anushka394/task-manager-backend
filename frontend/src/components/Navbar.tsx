import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, clearAuth } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-bold text-slate-900 text-lg tracking-tight">Task Manager</span>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-xs font-bold text-indigo-700">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-slate-600 hidden sm:block">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-slate-900 font-medium border border-slate-200 hover:border-slate-400 px-4 py-1.5 rounded-lg transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  )
}
