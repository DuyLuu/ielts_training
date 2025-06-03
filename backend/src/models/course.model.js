const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Lesson description is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Lesson content is required'],
    },
    videoUrl: {
      type: String,
      default: '',
    },
    resources: [
      {
        title: {
          type: String,
          required: true,
        },
        fileUrl: {
          type: String,
          required: true,
        },
        fileType: {
          type: String,
          enum: ['pdf', 'audio', 'video', 'image', 'other'],
          default: 'other',
        },
      },
    ],
    quiz: [
      {
        question: {
          type: String,
          required: true,
        },
        options: [
          {
            type: String,
            required: true,
          },
        ],
        correctAnswer: {
          type: Number, // Index of the correct option
          required: true,
        },
        explanation: {
          type: String,
          default: '',
        },
      },
    ],
    duration: {
      type: Number, // in minutes
      default: 30,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      trim: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: [true, 'Course level is required'],
    },
    skill: {
      type: String,
      enum: ['reading', 'writing', 'listening', 'speaking', 'general'],
      required: [true, 'Course skill is required'],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    duration: {
      type: Number, // in hours
      default: 0,
    },
    lessons: [lessonSchema],
    instructors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    price: {
      type: Number,
      default: 0, // 0 means free
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for course completion percentage
courseSchema.virtual('completionPercentage').get(function () {
  if (!this.students || this.students.length === 0) return 0;
  
  return (this.students.length / this.target) * 100;
});

// Pre-save hook to calculate total duration based on lessons
courseSchema.pre('save', function (next) {
  if (this.lessons && this.lessons.length > 0) {
    const totalMinutes = this.lessons.reduce((total, lesson) => total + lesson.duration, 0);
    this.duration = Math.ceil(totalMinutes / 60); // Convert to hours and round up
  }
  next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course; 