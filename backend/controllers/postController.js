const Post = require('../models/Post');

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Get all posts with pagination and filters
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build query
  let query = { status: 'published' };

  // Filter by author
  if (req.query.author) {
    query.author = req.query.author;
  }

  // Get total count for pagination
  const total = await Post.countDocuments(query);

  // Execute query with pagination
  const posts = await Post.find(query)
    .populate('author', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    count: posts.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: posts
  });
});

// @desc    Get single post by ID or slug
// @route   GET /api/posts/:idOrSlug
// @access  Public
const getPost = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  
  // Try to find by ID first, then by slug
  let post;
  if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
    post = await Post.findById(idOrSlug).populate('author', 'name email');
  } else {
    post = await Post.findOne({ slug: idOrSlug }).populate('author', 'name email');
  }

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  // Increment view count
  post.views += 1;
  await post.save();

  res.json({
    success: true,
    data: post
  });
});

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { title, slug, content, excerpt, status } = req.body;

  // Create post with user info
  const post = new Post({
    title,
    slug,
    content,
    excerpt,
    status: status || 'published',
    author: req.user._id,
    authorName: req.user.name
  });

  await post.save();

  // Populate author info
  const populatedPost = await Post.findById(post._id)
    .populate('author', 'name email');

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data: populatedPost
  });
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Author only)
const updatePost = asyncHandler(async (req, res) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  // Check if user is the author
  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this post'
    });
  }

  const { title, slug, content, excerpt, status } = req.body;

  post = await Post.findByIdAndUpdate(
    req.params.id,
    { title, slug, content, excerpt, status },
    { new: true, runValidators: true }
  ).populate('author', 'name email');

  res.json({
    success: true,
    message: 'Post updated successfully',
    data: post
  });
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Author only)
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  // Check if user is the author
  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this post'
    });
  }

  await Post.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Post deleted successfully',
    data: {}
  });
});

// @desc    Get user's posts
// @route   GET /api/posts/user/me
// @access  Private
const getMyPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.user._id })
    .sort({ createdAt: -1 })
    .populate('author', 'name email');

  res.json({
    success: true,
    count: posts.length,
    data: posts
  });
});

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getMyPosts
};
