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






commentSchema.index({ post: 1, createdAt: -1 });


commentSchema.index({ user: 1, createdAt: -1 });






commentSchema.statics.findByPost = function (postId) {
  return this.find({ post: postId }).populate("user", "name email");
};






commentSchema.methods.updateContent = async function (content) {
  this.content = content;
  return this.save();
};





commentSchema.virtual("url").get(function () {
  return `/comments/${this._id}`;
});



const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
