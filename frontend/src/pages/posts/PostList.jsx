import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchPosts, deletePost } from '../../store/slices/postsSlice'

function PostList() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { posts, loading, error, pagination } = useSelector((state) => state.posts)

  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])

  const handleDelete = async (slug) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await dispatch(deletePost(slug))
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading posts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Posts</h1>
        <Link to="/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Create New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No posts found. Create your first post!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                <Link to={`/posts/${post.slug}`} className="hover:text-blue-600 transition">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt || post.content}</p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <span>By {post.authorName || post.author?.name || 'Unknown'}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/posts/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read More
                  </Link>
                  {user && (post.author?._id === user.id || post.author === user.id) && (
                    <button
                      onClick={() => handleDelete(post.slug)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination info */}
      {pagination.pages > 1 && (
        <div className="mt-8 text-center text-gray-600">
          Page {pagination.page} of {pagination.pages} (Total: {pagination.total} posts)
        </div>
      )}
    </div>
  )
}

export default PostList
