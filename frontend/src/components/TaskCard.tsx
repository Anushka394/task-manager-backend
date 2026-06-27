import { useMutation, useQueryClient } from '@tanstack/react-query'
import { completeTask, deleteTask } from '../api/tasks'
import PriorityBadge from './PriorityBadge'
import type { Task } from '../types'

interface Props {
  task: Task
  onEdit: (task: Task) => void
}

function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.completed) return false
  return new Date(task.dueDate) < new Date(new Date().toDateString())
}

export default function TaskCard({ task, onEdit }: Props) {
  const queryClient = useQueryClient()

  const completeMutation = useMutation({
    mutationFn: () => completeTask(task.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(task.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const overdue = isOverdue(task)

  return (
    <div
      className={`bg-white rounded-xl border flex flex-col gap-3 p-5 transition-all hover:shadow-md ${
        task.completed
          ? 'border-slate-100 opacity-60'
          : overdue
          ? 'border-red-200 bg-red-50/30'
          : 'border-slate-200'
      }`}
    >
      {/* Top row — title + priority */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Complete toggle */}
          <button
            onClick={() => !task.completed && completeMutation.mutate()}
            disabled={completeMutation.isPending || task.completed}
            title={task.completed ? 'Completed' : 'Mark as complete'}
            className={`mt-0.5 w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
              task.completed
                ? 'bg-indigo-500 border-indigo-500'
                : 'border-slate-300 hover:border-indigo-400'
            }`}
          >
            {task.completed && (
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                <path d="M1.5 5.5L4 8l4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <h3 className={`font-semibold text-sm text-slate-800 leading-snug ${task.completed ? 'line-through text-slate-400' : ''}`}>
            {task.title}
          </h3>
        </div>
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 pl-7">
          {task.description}
        </p>
      )}

      {/* Due date */}
      {task.dueDate && (
        <p className={`text-xs font-medium pl-7 ${overdue ? 'text-red-500' : 'text-slate-400'}`}>
          {overdue ? 'Overdue — ' : 'Due '}
          {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          })}
        </p>
      )}

      {/* Divider + Actions */}
      <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
        <span className="text-xs text-slate-300">
          {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onEdit(task)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
          >
            Edit
          </button>
          <span className="text-slate-200">|</span>
          <button
            onClick={() => { if (window.confirm('Delete this task?')) deleteMutation.mutate() }}
            disabled={deleteMutation.isPending}
            className="text-xs text-slate-400 hover:text-red-600 font-semibold transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
