import { Link, useNavigate } from 'react-router-dom'
import { RegisterForm } from '../components/auth/RegisterForm'
import { SocialLogin } from '../components/auth/SocialLogin'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      await register({ username, email, password })
      toast.success('Account created successfully!')
      navigate('/login')
    } catch {
      throw new Error('Registration failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full">
        <RegisterForm onRegister={handleRegister} />
        <SocialLogin />
        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
