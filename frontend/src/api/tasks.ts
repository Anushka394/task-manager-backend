import api from './axios'
import type { Task, TaskRequest, PagedResponse, Priority } from '../types'

export interface TaskFilters {
  completed?: boolean
  priority?: Priority
  page?: number
  size?: number
  sortBy?: string
  direction?: 'asc' | 'desc'
}

export const getTasks = async (filters: TaskFilters = {}): Promise<PagedResponse<Task>> => {
  const params = new URLSearchParams()
  if (filters.completed !== undefined) params.set('completed', String(filters.completed))
  if (filters.priority)                params.set('priority', filters.priority)
  params.set('page',      String(filters.page      ?? 0))
  params.set('size',      String(filters.size      ?? 20))
  params.set('sortBy',    filters.sortBy           ?? 'createdAt')
  params.set('direction', filters.direction        ?? 'desc')

  const res = await api.get<PagedResponse<Task>>(`/tasks?${params}`)
  return res.data
}

export const getTask = async (id: number): Promise<Task> => {
  const res = await api.get<Task>(`/tasks/${id}`)
  return res.data
}

export const getOverdueTasks = async (): Promise<Task[]> => {
  const res = await api.get<Task[]>('/tasks/overdue')
  return res.data
}

export const createTask = async (data: TaskRequest): Promise<Task> => {
  const res = await api.post<Task>('/tasks', data)
  return res.data
}

export const updateTask = async (id: number, data: TaskRequest): Promise<Task> => {
  const res = await api.put<Task>(`/tasks/${id}`, data)
  return res.data
}

export const completeTask = async (id: number): Promise<Task> => {
  const res = await api.patch<Task>(`/tasks/${id}/complete`)
  return res.data
}

export const updatePriority = async (id: number, priority: Priority): Promise<Task> => {
  const res = await api.patch<Task>(`/tasks/${id}/priority`, { priority })
  return res.data
}

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`)
}
