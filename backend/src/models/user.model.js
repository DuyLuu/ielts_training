const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: function() {
        return this.googleId ? false : true;
      },
      minlength: [6, 'Password should be at least 6 characters long'],
      select: false, // Don't return password by default
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined values (for non-Google users)
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    avatar: {
      type: String,
      default: '',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    studyGoals: {
      targetScore: {
        type: Number,
        min: 0,
        max: 9,
        default: 7.0,
      },
      targetDate: {
        type: Date,
        default: () => new Date(+new Date() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      },
      focusAreas: {
        type: [String],
        enum: ['reading', 'writing', 'listening', 'speaking'],
        default: ['reading', 'writing', 'listening', 'speaking'],
      },
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 