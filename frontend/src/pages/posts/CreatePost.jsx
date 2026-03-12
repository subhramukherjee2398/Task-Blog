import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { createPost } from '../../store/slices/postsSlice'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// Simple slugify function
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

// Quill editor modules configuration
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    ['link', 'image'],
    ['clean']
  ],
}

// Quill editor formats
const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'blockquote', 'code-block',
  'list', 'bullet',
  'indent',
  'link', 'image'
]

function CreatePost() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { loading, error } = useSelector((state) => state.posts)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'published'
  })
  const [validationError, setValidationError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Auto-generate slug from title
    if (name === 'title') {
      const generatedSlug = slugify(value) + '-' + Date.now()
      setFormData({
        ...formData,
        title: value,
        slug: generatedSlug
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  // Handle Quill editor content change
  const handleQuillChange = (content) => {
    setFormData({
      ...formData,
      content: content
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content) {
      setValidationError('Title and content are required')
      return
    }

    const result = await dispatch(createPost(formData))
    if (createPost.fulfilled.match(result)) {
      navigate('/posts')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-primary mb-4">Authentication Required</h2>
          <p className="text-secondary mb-6">
            You need to be logged in to create a post.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="bg-primary text-cream px-6 py-3 rounded-lg hover:bg-opacity-90 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-accent text-primary border-2 border-primary px-6 py-3 rounded-lg hover:bg-opacity-90 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-8">Create New Post</h1>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        {(error || validationError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error || validationError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-secondary mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Enter post title"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="slug" className="block text-sm font-medium text-secondary mb-2">
              URL Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="auto-generated-from-title"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="excerpt" className="block text-sm font-medium text-secondary mb-2">
              Excerpt (Optional)
            </label>
            <input
              type="text"
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Short description (max 200 characters)"
              maxLength="200"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="status" className="block text-sm font-medium text-secondary mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-secondary mb-2">
              Content
            </label>
            <div className="bg-white">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleQuillChange}
                modules={quillModules}
                formats={quillFormats}
                className="h-64 mb-12"
                placeholder="Write your post content here..."
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-cream px-6 py-3 rounded-lg hover:bg-opacity-90 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/posts')}
              className="bg-gray-200 text-secondary px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
