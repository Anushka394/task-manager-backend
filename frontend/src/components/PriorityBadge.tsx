import type { Priority } from '../types'

const styles: Record<Priority, string> = {
  LOW:    'bg-slate-100 text-slate-500 border border-slate-200',
  MEDIUM: 'bg-amber-50 text-amber-700 border border-amber-200',
  HIGH:   'bg-red-50 text-red-600 border border-red-200',
}

const labels: Record<Priority, string> = {
  LOW:    'Low',
  MEDIUM: 'Medium',
  HIGH:   'High',
}

export default function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${styles[priority]}`}>
      {labels[priority]}
    </span>
  )
}
