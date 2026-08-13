import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { getOverdueTasks } from '../api/tasks'

export default function Navbar() {
  const { user, clearAuth } = useAuth()
  const navigate = useNavigate()

  const { data: overdueTasks } = useQuery({
    queryKey: ['tasks', 'overdue'],
    queryFn: getOverdueTasks,
    staleTime: 60_000,
  })

  const overdueCount = overdueTasks?.length ?? 0

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-bold text-slate-900 text-lg tracking-tight">Task Manager</span>
        <div className="flex items-center gap-6">
          {/* Overdue badge */}
          {overdueCount > 0 && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-xs font-semibold text-red-600">
                {overdueCount} overdue {overdueCount === 1 ? 'task' : 'tasks'}
              </span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-700">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              {overdueCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold leading-none">
                    {overdueCount > 9 ? '9+' : overdueCount}
                  </span>
                </span>
              )}
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
