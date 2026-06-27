import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { register as registerApi } from '../api/auth'
import { useAuth } from '../context/AuthContext'

const schema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  const { saveAuth } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: registerApi,
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
            Get started in<br />under a minute.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Create your account and begin organising your tasks immediately. No setup required.
          </p>
        </div>
        <p className="text-slate-600 text-xs">Task Manager &copy; 2025</p>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-7/12 flex items-center justify-center px-6 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-2">New account</p>
            <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
          </div>

          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                Full Name
              </label>
              <input
                {...register('name')}
                placeholder="Your full name"
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1.5">{errors.name.message}</p>
              )}
            </div>

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
                placeholder="Minimum 6 characters"
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1.5">{errors.password.message}</p>
              )}
            </div>

            {mutation.isError && (
              <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                <p className="text-xs text-red-600">
                  {(mutation.error as any)?.response?.data?.message ?? 'Registration failed. Please try again.'}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50 transition-all mt-1"
            >
              {mutation.isPending ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-8 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
