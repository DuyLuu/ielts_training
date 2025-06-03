const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Question text is required'],
  },
  questionType: {
    type: String,
    enum: ['multiple-choice', 'fill-in-the-blank', 'essay', 'speaking'],
    required: [true, 'Question type is required'],
  },
  options: [
    {
      type: String,
    },
  ],
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed, // Can be String, Number, or Array depending on question type
    required: function() {
      return this.questionType !== 'essay' && this.questionType !== 'speaking';
    },
  },
  points: {
    type: Number,
    default: 1,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  skill: {
    type: String,
    enum: ['reading', 'writing', 'listening', 'speaking'],
    required: [true, 'Skill is required'],
  },
  audioUrl: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  passage: {
    type: String,
    default: '',
  },
});

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Test title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Test description is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['mock', 'reading', 'writing', 'listening', 'speaking'],
      required: [true, 'Test type is required'],
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Test duration is required'],
    },
    questions: [questionSchema],
    instructions: {
      type: String,
      default: 'Read all questions carefully before answering.',
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    passScore: {
      type: Number,
      default: 0,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for number of questions
testSchema.virtual('questionCount').get(function () {
  return this.questions ? this.questions.length : 0;
});

// Pre-save hook to calculate total points
testSchema.pre('save', function (next) {
  if (this.questions && this.questions.length > 0) {
    this.totalPoints = this.questions.reduce((total, question) => total + question.points, 0);
    if (!this.passScore) {
      this.passScore = Math.floor(this.totalPoints * 0.7); // Default pass score is 70%
    }
  }
  next();
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test; 