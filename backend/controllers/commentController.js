const Comment = require('../models/Comment');
const Post = require('../models/Post');


const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};




const getCommentsByPost = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .sort({ createdAt: -1 })
    .populate('user', 'name email');

  res.json({
    success: true,
    count: comments.length,
    data: comments
  });
});




const createComment = asyncHandler(async (req, res) => {
  const { content, postId } = req.body;

  if (!content || !postId) {
    return res.status(400).json({
      success: false,
      message: 'Content and postId are required'
    });
  }

  
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  const comment = new Comment({
    content,
    post: postId,
    user: req.user._id,
    userName: req.user.name,
    userEmail: req.user.email
  });

  await comment.save();

  
  const populatedComment = await Comment.findById(comment._id)
    .populate('user', 'name email');

  res.status(201).json({
    success: true,
    message: 'Comment created successfully',
    data: populatedComment
  });
});




const updateComment = asyncHandler(async (req, res) => {
  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  
  if (comment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this comment'
    });
  }

  const { content } = req.body;

  comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { content },
    { new: true, runValidators: true }
  ).populate('user', 'name email');

  res.json({
    success: true,
    message: 'Comment updated successfully',
    data: comment
  });
});




const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  
  const post = await Post.findById(comment.post);
  const isCommentAuthor = comment.user.toString() === req.user._id.toString();
  const isPostAuthor = post && post.author.toString() === req.user._id.toString();

  if (!isCommentAuthor && !isPostAuthor) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this comment'
    });
  }

  await Comment.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Comment deleted successfully',
    data: {}
  });
});




const getMyComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('post', 'title');

  res.json({
    success: true,
    count: comments.length,
    data: comments
  });
});

module.exports = {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
  getMyComments
};
