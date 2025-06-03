const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userAnswer: {
    type: mongoose.Schema.Types.Mixed, // Can be String, Number, Array, or File path for speaking
    required: true,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
  score: {
    type: Number,
    default: 0,
  },
  feedback: {
    type: String,
    default: '',
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0,
  },
});

const testSubmissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: [true, 'Test is required'],
    },
    answers: [answerSchema],
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'graded', 'partially-graded'],
      default: 'in-progress',
    },
    timeSpent: {
      type: Number, // in seconds
      default: 0,
    },
    isPassed: {
      type: Boolean,
      default: false,
    },
    feedback: {
      type: String,
      default: '',
    },
    gradedBy: {
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

// Virtual for percentage score
testSubmissionSchema.virtual('percentageScore').get(function () {
  if (!this.test || !this.test.totalPoints || this.test.totalPoints === 0) return 0;
  
  return (this.totalScore / this.test.totalPoints) * 100;
});

// Pre-save hook to calculate total score and determine pass/fail
testSubmissionSchema.pre('save', function (next) {
  if (this.answers && this.answers.length > 0 && this.status === 'graded') {
    this.totalScore = this.answers.reduce((total, answer) => total + answer.score, 0);
    
    // Calculate time spent if both startTime and endTime exist
    if (this.startTime && this.endTime) {
      this.timeSpent = Math.floor((this.endTime - this.startTime) / 1000); // in seconds
    }
    
    // Determine if passed (need to populate test first to get passScore)
    if (this.test && this.test.passScore) {
      this.isPassed = this.totalScore >= this.test.passScore;
    }
  }
  next();
});

const TestSubmission = mongoose.model('TestSubmission', testSubmissionSchema);

module.exports = TestSubmission; 