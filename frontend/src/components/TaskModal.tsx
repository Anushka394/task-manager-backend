import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask, updateTask } from '../api/tasks'
import type { Task } from '../types'

const schema = z.object({
  title:       z.string().min(1, 'Title is required').max(255),
  description: z.string().max(1000).optional(),
  dueDate:     z.string().optional(),
  priority:    z.enum(['LOW', 'MEDIUM', 'HIGH']),
})

type FormValues = z.infer<typeof schema>

interface Props {
  task?: Task | null
  onClose: () => void
}

export default function TaskModal({ task, onClose }: Props) {
  const queryClient = useQueryClient()
  const isEdit = !!task

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title:       task?.title       ?? '',
      description: task?.description ?? '',
      dueDate:     task?.dueDate     ?? '',
      priority:    task?.priority    ?? 'MEDIUM',
    },
  })

  useEffect(() => {
    reset({
      title:       task?.title       ?? '',
      description: task?.description ?? '',
      dueDate:     task?.dueDate     ?? '',
      priority:    task?.priority    ?? 'MEDIUM',
    })
  }, [task, reset])

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      isEdit
        ? updateTask(task!.id, { ...data, dueDate: data.dueDate || null })
        : createTask({ ...data, dueDate: data.dueDate || null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      onClose()
    },
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isEdit ? 'Edit Task' : 'New Task'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEdit ? 'Update the details below.' : 'Fill in the details to create a new task.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors text-lg leading-none"
          >
            &times;
          </button>
        </div>

        {/* Modal body */}
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="px-6 py-5 flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              {...register('title')}
              placeholder="Enter task title"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Optional description"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          {/* Due date + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                {...register('dueDate')}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                Priority
              </label>
              <select
                {...register('priority')}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          {mutation.isError && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              <p className="text-xs text-red-600">
                {(mutation.error as any)?.response?.data?.message ?? 'Something went wrong. Please try again.'}
              </p>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex justify-end gap-3 pt-1 border-t border-slate-100 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm text-slate-600 hover:text-slate-900 font-medium border border-slate-200 hover:border-slate-400 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-5 py-2.5 text-sm bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              {mutation.isPending ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
