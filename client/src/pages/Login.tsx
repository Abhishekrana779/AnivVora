import { useNavigate, useLocation, Link } from 'react-router-dom'
import { LoginForm } from '../components/auth/LoginForm'
import { SocialLogin } from '../components/auth/SocialLogin'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password })
      toast.success('Welcome back!')
      const from = (location.state as { from?: string })?.from || '/'
      navigate(from, { replace: true })
    } catch {
      throw new Error('Login failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full">
        <LoginForm onLogin={handleLogin} />
        <SocialLogin />
        <p className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-400 hover:text-purple-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
