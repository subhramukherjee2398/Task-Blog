import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchPost, deletePost, clearPost, updatePost } from '../../store/slices/postsSlice'
import { fetchComments, createComment, deleteComment, updateComment, clearComments } from '../../store/slices/commentsSlice'

function PostDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { post, loading, error } = useSelector((state) => state.posts)
  const { comments, loading: commentsLoading, pagination } = useSelector((state) => state.comments)
  
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [editingComment, setEditingComment] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [editingPost, setEditingPost] = useState(false)
  const [editPostData, setEditPostData] = useState({ title: '', content: '', excerpt: '' })
  const [commentPage, setCommentPage] = useState(1)

  useEffect(() => {
    dispatch(fetchPost(slug))
    return () => {
      dispatch(clearPost())
      dispatch(clearComments())
    }
  }, [dispatch, slug])

  useEffect(() => {
    if (post?._id) {
      dispatch(fetchComments({ postId: post._id, page: commentPage }))
    }
  }, [dispatch, post, commentPage])

  useEffect(() => {
    if (post && editingPost) {
      setEditPostData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || ''
      })
    }
  }, [post, editingPost])

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await dispatch(deletePost(slug))
      navigate('/posts')
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!commentContent.trim()) return

    await dispatch(createComment({ content: commentContent, postId: post._id }))
    setCommentContent('')
    setShowCommentForm(false)
  }

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await dispatch(deleteComment(commentId))
    }
  }

  const handleEditComment = (comment) => {
    setEditingComment(comment._id)
    setEditContent(comment.content)
  }

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) return
    await dispatch(updateComment({ id: commentId, content: editContent }))
    setEditingComment(null)
    setEditContent('')
  }

  const handleEditPost = async (e) => {
    e.preventDefault()
    await dispatch(updatePost({ slug, ...editPostData }))
    setEditingPost(false)
    dispatch(fetchPost(slug))
  }

  const isAuthor = user && (post?.author?._id === user.id || post?.author === user.id)

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading post...</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error || 'Post not found'}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/posts" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← Back to Posts
      </Link>
      
      <article className="bg-white rounded-lg shadow-md p-8 mb-8">
        {editingPost ? (
          <form onSubmit={handleEditPost}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={editPostData.title}
                onChange={(e) => setEditPostData({ ...editPostData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
              <input
                type="text"
                value={editPostData.excerpt}
                onChange={(e) => setEditPostData({ ...editPostData, excerpt: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                maxLength="200"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={editPostData.content}
                onChange={(e) => setEditPostData({ ...editPostData, content: e.target.value })}
                rows="8"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                required
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditingPost(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            <div className="flex items-center text-gray-600 mb-6 pb-6 border-b">
              <span className="font-medium">{post.authorName || post.author?.name || 'Unknown'}</span>
              <span className="mx-3">•</span>
              <span>{new Date(post.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
              {post.views !== undefined && (
                <>
                  <span className="mx-3">•</span>
                  <span>{post.views} views</span>
                </>
              )}
            </div>

            {post.excerpt && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-blue-700 italic">{post.excerpt}</p>
              </div>
            )}

            <div className="prose max-w-none">
              <div className="text-gray-700 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {isAuthor && (
              <div className="mt-8 pt-6 border-t flex gap-4">
                <button
                  onClick={() => setEditingPost(true)}
                  className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition"
                >
                  Edit Post
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Delete Post
                </button>
              </div>
            )}
          </>
        )}
      </article>

      {/* Comments Section */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({comments.length})
        </h2>

        {/* Add Comment Button */}
        {user ? (
          showCommentForm ? (
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write your comment..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                required
              />
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  disabled={commentsLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {commentsLoading ? 'Posting...' : 'Post Comment'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCommentForm(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowCommentForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-6"
            >
              Add a Comment
            </button>
          )
        ) : (
          <p className="text-gray-600 mb-6">
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link> to leave a comment
          </p>
        )}

        {/* Comments List */}
        {commentsLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const isCommentAuthor = user && (comment.user?._id === user.id || comment.user === user.id)
              
              return (
                <div
                  key={comment._id}
                  className="border-b border-gray-200 pb-4 last:border-0"
                >
                  {editingComment === comment._id ? (
                    <div>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleUpdateComment(comment._id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingComment(null)
                            setEditContent('')
                          }}
                          className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-gray-900">
                            {comment.userName || comment.user?.name || 'Anonymous'}
                          </span>
                          <span className="text-gray-500 text-sm ml-2">
                            {new Date(comment.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        {isCommentAuthor && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditComment(comment)}
                              className="text-yellow-600 hover:text-yellow-800 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-700 mt-2 whitespace-pre-wrap">{comment.content}</p>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-6 flex justify-center items-center gap-2">
            <button
              onClick={() => setCommentPage(p => Math.max(1, p - 1))}
              disabled={pagination.page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => setCommentPage(p => Math.min(pagination.pages, p + 1))}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default PostDetail
