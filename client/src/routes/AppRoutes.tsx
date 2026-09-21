import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router-dom"
import Layout from "../components/layout/Layout"
import { ProtectedRoute } from "../components/auth/ProtectedRoute"
import { useAuth } from "../context/AuthContext"
import LoadingSpinner from "../components/common/LoadingSpinner"

const Home = lazy(() => import("../pages/Home"))
const Search = lazy(() => import("../pages/Search"))
const AnimeDetails = lazy(() => import("../pages/AnimeDetails"))
const Watch = lazy(() => import("../pages/Watch"))
const Genres = lazy(() => import("../pages/Genres"))
const GenreAnime = lazy(() => import("../pages/GenreAnime"))
const Schedule = lazy(() => import("../pages/Schedule"))
const Watchlist = lazy(() => import("../pages/Watchlist"))
const History = lazy(() => import("../pages/History"))
const Profile = lazy(() => import("../pages/Profile"))
const Settings = lazy(() => import("../pages/Settings"))
const Login = lazy(() => import("../pages/Login"))
const Register = lazy(() => import("../pages/Register"))
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"))
const About = lazy(() => import("../pages/About"))
const NotFound = lazy(() => import("../pages/NotFound"))

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth()

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/anime/:id" element={<AnimeDetails />} />
          <Route
            path="/watch/:animeId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={loading}>
                <Watch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watch/:animeId/:episodeId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={loading}>
                <Watch />
              </ProtectedRoute>
            }
          />
          <Route path="/genres" element={<Genres />} />
          <Route path="/genre/:genre" element={<GenreAnime />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route
            path="/watchlist"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={loading}>
                <Watchlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={loading}>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={loading}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={loading}>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
