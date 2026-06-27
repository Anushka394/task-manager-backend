export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Task {
  id: number
  title: string
  description: string | null
  completed: boolean
  dueDate: string | null   // ISO date string yyyy-MM-dd
  priority: Priority
  createdAt: string
  updatedAt: string
}

export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export interface AuthResponse {
  token: string
  email: string
  name: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface TaskRequest {
  title: string
  description?: string
  dueDate?: string | null
  priority?: Priority
}

export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string>
}
