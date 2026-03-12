const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      minlength: [1, "Comment cannot be empty"],
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/////////////////////////////////////////////////////
// INDEXES
/////////////////////////////////////////////////////

// Index for efficient querying by post
commentSchema.index({ post: 1, createdAt: -1 });

// Index for querying user's comments
commentSchema.index({ user: 1, createdAt: -1 });

/////////////////////////////////////////////////////
// STATIC METHODS
/////////////////////////////////////////////////////

// Find by post
commentSchema.statics.findByPost = function (postId) {
  return this.find({ post: postId }).populate("user", "name email");
};

/////////////////////////////////////////////////////
// INSTANCE METHODS
/////////////////////////////////////////////////////

// Update content
commentSchema.methods.updateContent = async function (content) {
  this.content = content;
  return this.save();
};

/////////////////////////////////////////////////////
// VIRTUALS
/////////////////////////////////////////////////////

commentSchema.virtual("url").get(function () {
  return `/comments/${this._id}`;
});

/////////////////////////////////////////////////////

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
