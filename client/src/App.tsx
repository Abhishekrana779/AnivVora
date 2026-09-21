import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext'
import { PlayerContextProvider } from './context/PlayerContext'
import { ThemeContextProvider } from './context/ThemeContext'
import AppRoutes from './routes/AppRoutes'
import LoadingSpinner from './components/common/LoadingSpinner'
import { Toaster } from 'react-hot-toast'

function AppRoutesWrapper() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AppRoutes />
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeContextProvider>
        <AuthContextProvider>
          <PlayerContextProvider>
            <AppRoutesWrapper />
            <Toaster position="top-right" />
          </PlayerContextProvider>
        </AuthContextProvider>
      </ThemeContextProvider>
    </BrowserRouter>
  )
}
