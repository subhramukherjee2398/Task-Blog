import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchPosts } from '../store/slices/postsSlice'

function Home() {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { posts, loading } = useSelector((state) => state.posts)

  useEffect(() => {
    dispatch(fetchPosts({ limit: 6 }))
  }, [dispatch])

  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold text-primary mb-6">
        Welcome to Our Blog
      </h1>
      <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
        Discover stories, thinking, and expertise from writers on any topic. Share your ideas with the world and connect with readers who appreciate authentic voices.
        Join our community of writers and readers today.
      </p>
      
      {isAuthenticated ? (
        <div className="mb-8">
          <p className="text-lg text-secondary mb-4">
            Welcome back, <span className="font-semibold text-primary">{user?.name}</span>!
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/posts" className="bg-primary text-cream px-8 py-3 rounded-lg text-lg font-medium hover:bg-opacity-90 transition">
              View All Posts
            </Link>
            <Link to="/create" className="bg-accent text-primary border-2 border-primary px-8 py-3 rounded-lg text-lg font-medium hover:bg-opacity-90 transition">
              Create New Post
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex justify-center gap-4 mb-8">
          <Link to="/register" className="bg-primary text-cream px-8 py-3 rounded-lg text-lg font-medium hover:bg-opacity-90 transition">
            Get Started
          </Link>
          <Link to="/login" className="bg-accent text-primary border-2 border-primary px-8 py-3 rounded-lg text-lg font-medium hover:bg-opacity-90 transition">
            Login
          </Link>
        </div>
      )}

      {/* Recent Blog Posts Section - Card Grid */}
      <div className="mt-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Latest Articles</h2>
          <Link to="/posts" className="text-primary hover:text-secondary font-medium">
            View All Posts →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-secondary">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-secondary text-lg mb-4">No posts yet. Be the first to create one!</p>
            <Link to="/register" className="bg-primary text-cream px-6 py-3 rounded-lg hover:bg-opacity-90 transition inline-block">
              Create Account
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    <Link to={`/posts/${post.slug}`} className="hover:text-secondary transition">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-secondary mb-4 line-clamp-3">{post.excerpt || post.content}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>By {post.authorName || post.author?.name || 'Unknown'}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="bg-cream px-6 py-3">
                  <Link
                    to={`/posts/${post.slug}`}
                    className="text-primary hover:text-secondary font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200">
        <p className="text-secondary text-sm">
          © 2024 Blog App. Built with Express.js, React, Redux Toolkit, Vite & Tailwind CSS
        </p>
      </footer>
    </div>
  )
}

export default Home
