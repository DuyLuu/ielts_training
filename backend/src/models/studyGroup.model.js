const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    attachments: [
      {
        fileUrl: {
          type: String,
          required: true,
        },
        fileType: {
          type: String,
          enum: ['pdf', 'audio', 'video', 'image', 'other'],
          default: 'other',
        },
        fileName: {
          type: String,
          required: true,
        },
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

const studyGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Group name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Group description is required'],
      trim: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Admin is required'],
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    messages: [messageSchema],
    focusAreas: {
      type: [String],
      enum: ['reading', 'writing', 'listening', 'speaking', 'general'],
      default: ['general'],
    },
    targetScore: {
      type: Number,
      min: 0,
      max: 9,
      default: 7.0,
    },
    meetingSchedule: {
      type: String,
      default: '',
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    joinCode: {
      type: String,
      default: function() {
        return Math.random().toString(36).substring(2, 10).toUpperCase();
      },
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for member count
studyGroupSchema.virtual('memberCount').get(function () {
  return this.members ? this.members.length : 0;
});

// Virtual for message count
studyGroupSchema.virtual('messageCount').get(function () {
  return this.messages ? this.messages.length : 0;
});

// Method to check if user is a member
studyGroupSchema.methods.isMember = function (userId) {
  return this.members.some(member => member.toString() === userId.toString());
};

// Method to check if user is admin
studyGroupSchema.methods.isAdmin = function (userId) {
  return this.admin.toString() === userId.toString();
};

const StudyGroup = mongoose.model('StudyGroup', studyGroupSchema);

module.exports = StudyGroup; 