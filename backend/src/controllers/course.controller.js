const Course = require('../models/course.model');
const User = require('../models/user.model');

// Get all courses with filters
exports.getCourses = async (req, res) => {
  try {
    const { level, skill, search, limit = 10, page = 1 } = req.query;
    
    // Build query
    const query = {};
    
    // Add filters if provided
    if (level) query.level = level;
    if (skill) query.skill = skill;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Only show published courses for students
    if (req.user && req.user.role !== 'admin') {
      query.isPublished = true;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const courses = await Course.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('instructors', 'name avatar')
      .select('title description level skill thumbnail duration rating');
    
    // Get total count
    const total = await Course.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get single course
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructors', 'name avatar')
      .populate('students', 'name avatar');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }
    
    // Check if course is published or user is admin
    if (!course.isPublished && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'This course is not yet published',
      });
    }
    
    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Create new course
exports.createCourse = async (req, res) => {
  try {
    // Add current user as instructor
    req.body.instructors = [req.user.id];
    
    const course = await Course.create(req.body);
    
    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }
    
    // Check if user is instructor or admin
    const isInstructor = course.instructors.some(
      instructor => instructor.toString() === req.user.id
    );
    
    if (!isInstructor && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course',
      });
    }
    
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }
    
    // Check if user is instructor or admin
    const isInstructor = course.instructors.some(
      instructor => instructor.toString() === req.user.id
    );
    
    if (!isInstructor && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course',
      });
    }
    
    await course.remove();
    
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Enroll in course
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }
    
    // Check if course is published
    if (!course.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'This course is not yet published',
      });
    }
    
    // Check if user is already enrolled
    const isEnrolled = course.students.includes(req.user.id);
    if (isEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course',
      });
    }
    
    // Add user to course students
    course.students.push(req.user.id);
    await course.save();
    
    // Add course to user's enrolled courses
    const user = await User.findById(req.user.id);
    user.enrolledCourses.push(course._id);
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Leave course
exports.leaveCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }
    
    // Check if user is enrolled
    const isEnrolled = course.students.includes(req.user.id);
    if (!isEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'You are not enrolled in this course',
      });
    }
    
    // Remove user from course students
    course.students = course.students.filter(
      student => student.toString() !== req.user.id
    );
    await course.save();
    
    // Remove course from user's enrolled courses
    const user = await User.findById(req.user.id);
    user.enrolledCourses = user.enrolledCourses.filter(
      enrolledCourse => enrolledCourse.toString() !== course._id.toString()
    );
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Successfully left course',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Add a lesson to course
exports.addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }
    
    // Check if user is instructor or admin
    const isInstructor = course.instructors.some(
      instructor => instructor.toString() === req.user.id
    );
    
    if (!isInstructor && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add lessons to this course',
      });
    }
    
    // Set lesson order if not provided
    if (!req.body.order) {
      req.body.order = course.lessons.length + 1;
    }
    
    // Add lesson to course
    course.lessons.push(req.body);
    await course.save();
    
    res.status(201).json({
      success: true,
      data: course.lessons[course.lessons.length - 1],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update a lesson
exports.updateLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }
    
    // Check if user is instructor or admin
    const isInstructor = course.instructors.some(
      instructor => instructor.toString() === req.user.id
    );
    
    if (!isInstructor && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update lessons in this course',
      });
    }
    
    // Find lesson by ID
    const lessonIndex = course.lessons.findIndex(
      lesson => lesson._id.toString() === req.params.lessonId
    );
    
    if (lessonIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }
    
    // Update lesson
    course.lessons[lessonIndex] = {
      ...course.lessons[lessonIndex].toObject(),
      ...req.body,
    };
    
    await course.save();
    
    res.status(200).json({
      success: true,
      data: course.lessons[lessonIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Delete a lesson
exports.deleteLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }
    
    // Check if user is instructor or admin
    const isInstructor = course.instructors.some(
      instructor => instructor.toString() === req.user.id
    );
    
    if (!isInstructor && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete lessons from this course',
      });
    }
    
    // Find lesson by ID
    const lessonIndex = course.lessons.findIndex(
      lesson => lesson._id.toString() === req.params.lessonId
    );
    
    if (lessonIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }
    
    // Remove lesson
    course.lessons.splice(lessonIndex, 1);
    
    // Update order of remaining lessons
    course.lessons.forEach((lesson, index) => {
      lesson.order = index + 1;
    });
    
    await course.save();
    
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Mark lesson as completed
exports.completeLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }
    
    // Check if user is enrolled
    const isEnrolled = course.students.includes(req.user.id);
    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course',
      });
    }
    
    // Find lesson by ID
    const lesson = course.lessons.id(req.params.lessonId);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }
    
    // Add lesson to user's completed lessons
    const user = await User.findById(req.user.id);
    if (!user.completedLessons.includes(lesson._id)) {
      user.completedLessons.push(lesson._id);
      await user.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Lesson marked as completed',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
}; 