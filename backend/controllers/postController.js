const Post = require('../models/Post');


const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};




const getPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  
  let query = { status: 'published' };

  
  if (req.query.author) {
    query.author = req.query.author;
  }

  
  const total = await Post.countDocuments(query);

  
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




const getPost = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  
  
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

  
  post.views += 1;
  await post.save();

  res.json({
    success: true,
    data: post
  });
});




const createPost = asyncHandler(async (req, res) => {
  const { title, slug, content, excerpt, status } = req.body;

  
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

  
  const populatedPost = await Post.findById(post._id)
    .populate('author', 'name email');

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data: populatedPost
  });
});




const updatePost = asyncHandler(async (req, res) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  
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




const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  
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
