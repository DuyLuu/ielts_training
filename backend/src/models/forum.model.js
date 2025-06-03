const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Reply content is required'],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const forumPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    category: {
      type: String,
      enum: ['general', 'reading', 'writing', 'listening', 'speaking', 'grammar', 'vocabulary'],
      default: 'general',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    replies: [replySchema],
    isEdited: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for reply count
forumPostSchema.virtual('replyCount').get(function () {
  return this.replies ? this.replies.length : 0;
});

// Virtual for like count
forumPostSchema.virtual('likeCount').get(function () {
  return this.likes ? this.likes.length : 0;
});

// Index for text search
forumPostSchema.index({ title: 'text', content: 'text', tags: 'text' });

const ForumPost = mongoose.model('ForumPost', forumPostSchema);

module.exports = ForumPost; 