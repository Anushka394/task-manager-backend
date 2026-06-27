import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTasks } from '../api/tasks'
import Navbar from '../components/Navbar'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import type { Task, Priority } from '../types'
import type { TaskFilters } from '../api/tasks'

type FilterTab = 'all' | 'pending' | 'completed' | 'LOW' | 'MEDIUM' | 'HIGH'

const tabs: { label: string; value: FilterTab }[] = [
  { label: 'All Tasks',  value: 'all' },
  { label: 'Pending',    value: 'pending' },
  { label: 'Completed',  value: 'completed' },
  { label: 'Low',        value: 'LOW' },
  { label: 'Medium',     value: 'MEDIUM' },
  { label: 'High',       value: 'HIGH' },
]

function buildFilters(tab: FilterTab, page: number): TaskFilters {
  const base: TaskFilters = { page, size: 20, sortBy: 'createdAt', direction: 'desc' }
  if (tab === 'pending')   return { ...base, completed: false }
  if (tab === 'completed') return { ...base, completed: true }
  if (tab === 'LOW' || tab === 'MEDIUM' || tab === 'HIGH')
    return { ...base, priority: tab as Priority }
  return base
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 px-5 py-4`}>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  )
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [page, setPage]           = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask]   = useState<Task | null>(null)

  const allQuery       = useQuery({ queryKey: ['tasks', 'all', 0],       queryFn: () => getTasks({ page: 0, size: 1 }) })
  const pendingQuery   = useQuery({ queryKey: ['tasks', 'pending', 0],   queryFn: () => getTasks({ page: 0, size: 1, completed: false }) })
  const completedQuery = useQuery({ queryKey: ['tasks', 'completed', 0], queryFn: () => getTasks({ page: 0, size: 1, completed: true }) })

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tasks', activeTab, page],
    queryFn:  () => getTasks(buildFilters(activeTab, page)),
  })

  const handleTabChange = (tab: FilterTab) => { setActiveTab(tab); setPage(0) }
  const openCreate = () => { setEditTask(null); setModalOpen(true) }
  const openEdit   = (task: Task) => { setEditTask(task); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditTask(null) }

  const tasks      = data?.content ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Page title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-400 mt-0.5">Manage and track your tasks.</p>
          </div>
          <button
            onClick={openCreate}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm shadow-indigo-200"
          >
            + New Task
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="Total"     value={allQuery.data?.totalElements       ?? 0} accent="text-slate-800" />
          <StatCard label="Pending"   value={pendingQuery.data?.totalElements   ?? 0} accent="text-amber-600" />
          <StatCard label="Completed" value={completedQuery.data?.totalElements ?? 0} accent="text-indigo-600" />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 flex-wrap mb-6 bg-white border border-slate-200 rounded-xl p-1.5 w-fit">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => handleTabChange(t.value)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === t.value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 h-36 animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-6 py-5 text-center">
            <p className="text-sm text-red-600">Failed to load tasks. Please try refreshing the page.</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && tasks.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 py-20 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-600 mb-1">No tasks found</p>
            <p className="text-xs text-slate-400 mb-5">
              {activeTab === 'all' ? 'Create your first task to get started.' : 'No tasks match this filter.'}
            </p>
            {activeTab === 'all' && (
              <button
                onClick={openCreate}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
              >
                Create a task
              </button>
            )}
          </div>
        )}

        {/* Task grid */}
        {!isLoading && tasks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={openEdit} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg bg-white disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg bg-white disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {modalOpen && <TaskModal task={editTask} onClose={closeModal} />}
    </div>
  )
}
