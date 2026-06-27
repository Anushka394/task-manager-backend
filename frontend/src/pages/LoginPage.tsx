import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const { saveAuth } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => { saveAuth(data); navigate('/dashboard') },
  })

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-slate-900 flex-col justify-between p-14">
        <div>
          <span className="text-white font-bold text-xl tracking-tight">Task Manager</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Manage your work.<br />Stay organised.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            A simple, focused tool for tracking tasks, setting priorities, and meeting deadlines.
          </p>
          <div className="mt-10 border-t border-slate-700 pt-8 flex flex-col gap-3">
            {['Create and assign priorities to tasks', 'Track pending and completed work', 'Filter by status or priority level'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                <span className="text-slate-400 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-slate-600 text-xs">Task Manager &copy; 2025</p>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-7/12 flex items-center justify-center px-6 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-2">Welcome back</p>
            <h1 className="text-3xl font-bold text-slate-900">Sign in to your account</h1>
          </div>

          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                placeholder="Enter your password"
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1.5">{errors.password.message}</p>
              )}
            </div>

            {mutation.isError && (
              <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                <p className="text-xs text-red-600">
                  {(mutation.error as any)?.response?.data?.message ?? 'Invalid email or password.'}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50 transition-all mt-1"
            >
              {mutation.isPending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-8 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
