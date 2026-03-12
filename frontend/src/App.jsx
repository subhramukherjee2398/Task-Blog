import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, checkAuth, logoutLocal } from './store/slices/authSlice'
import { Home, PostList, PostDetail, CreatePost, Login, Register } from './pages'

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  const handleLogout = async () => {
    await dispatch(logout())
    dispatch(logoutLocal())
    navigate('/')
  }

  if (loading) {
    return (
      <nav className="bg-primary shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold text-cream">
              Blog App
            </Link>
            <div className="text-cream">Loading...</div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-cream">
              Blog App
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-cream hover:text-accent px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/posts" className="text-cream hover:text-accent px-3 py-2 rounded-md text-sm font-medium">
              Posts
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/create" className="bg-accent text-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 transition">
                  Create Post
                </Link>
                <span className="text-cream px-3 py-2 text-sm">
                  Hi, {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-secondary text-cream px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-cream hover:text-accent px-4 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-accent text-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 transition">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cream">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/posts/:slug" element={<PostDetail />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        <footer className="bg-primary border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-cream">
              © 2024 Blog App. Built with Express.js, React, Redux Toolkit, Vite & Tailwind CSS
            </p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
