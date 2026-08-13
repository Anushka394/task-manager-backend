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
      className={`rounded-xl border flex flex-col gap-3 p-5 transition-all hover:shadow-md ${
        task.completed
          ? 'bg-white border-slate-100 opacity-60'
          : overdue
          ? 'bg-red-50 border-red-300 shadow-sm shadow-red-100'
          : 'bg-white border-slate-200'
      }`}
    >
      {/* Overdue banner strip */}
      {overdue && (
        <div className="flex items-center gap-1.5 bg-red-100 border border-red-200 rounded-lg px-3 py-1.5 -mt-1">
          <svg className="w-3.5 h-3.5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span className="text-xs font-semibold text-red-600">Overdue</span>
        </div>
      )}

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
                : overdue
                ? 'border-red-300 hover:border-red-500'
                : 'border-slate-300 hover:border-indigo-400'
            }`}
          >
            {task.completed && (
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                <path d="M1.5 5.5L4 8l4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <h3 className={`font-semibold text-sm leading-snug ${task.completed ? 'line-through text-slate-400' : overdue ? 'text-red-800' : 'text-slate-800'}`}>
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
        <p className={`text-xs font-medium pl-7 flex items-center gap-1 ${overdue ? 'text-red-600' : 'text-slate-400'}`}>
          {overdue && (
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          )}
          {overdue ? 'Overdue · ' : 'Due '}
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
