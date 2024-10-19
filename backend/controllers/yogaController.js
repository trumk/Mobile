const YogaCourse = require('../models/YogaCourse');
const User = require('../models/User');
const ClassType = require('../models/ClassType');

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await YogaCourse.find().populate('classType');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.detailCourse = async (req, res) => {
    try {
        const course = await YogaCourse.findById(req.params.id)
            .populate('participants', 'username email')
            .populate('classType'); 

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (!req.session.userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isJoined = user.courses.includes(course._id);

        res.json({
            ...course.toObject(),
            isJoined
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.detailCoursePublic = async (req, res) => {
    try {
        const course = await YogaCourse.findById(req.params.id)
            .populate('participants', 'username email')
            .populate('classType'); 

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.createCourse = async (req, res) => {
    const { dayOfWeek, courseTime, capacity, duration, pricePerClass, classType, description, teacherName, location } = req.body;
    try {
        const classTypeDoc = await ClassType.findById(classType);
        if (!classTypeDoc) {
            return res.status(400).json({ message: 'Invalid class type' });
        }

        const newCourse = new YogaCourse({
            dayOfWeek, 
            courseTime, 
            capacity, 
            duration, 
            pricePerClass, 
            classType, 
            description, 
            teacherName, 
            location
        });
        await newCourse.save();

        // Sử dụng populate mà không cần execPopulate
        await newCourse.populate('classType');

        res.status(201).json(newCourse); // Trả về đối tượng mới được tạo
    } catch (error) {
        res.status(400).json({ message: error.message }); // Trả về chi tiết lỗi
    }
};


exports.updateCourse = async (req, res) => {
    try {
        const { classType } = req.body;
        if (classType) {
            const classTypeDoc = await ClassType.findById(classType);
            if (!classTypeDoc) {
                return res.status(400).json({ message: 'Invalid class type' });
            }
        }

        const updatedCourse = await YogaCourse.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('classType');
        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(updatedCourse);
    } catch (error) {
        console.error('Error updating course:', error);  
        res.status(400).json({ message: 'Failed to update course', error: error.message });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const deletedCourse = await YogaCourse.findByIdAndDelete(req.params.id);
        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json({ message: 'Course successfully deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.joinCourse = async (req, res) => {
    try {
        const course = await YogaCourse.findById(req.params.id)
            .populate('classType');

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.capacity <= 0) {
            return res.status(400).json({ message: 'Course is full' });
        }

        if (!req.session.userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.courses.includes(course._id)) {
            return res.status(400).json({ message: 'You have already joined this course' });
        }
        course.participants.push(user._id);
        course.capacity -= 1;
        await course.save();

        user.courses.push(course._id);
        await user.save();

        res.json({ message: 'Successfully joined the course', course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.searchCourses = async (req, res) => {
    const { teacherName, dayOfWeek } = req.query;
    let filters = {};

    if (teacherName) {
        filters.teacherName = { $regex: teacherName, $options: 'i' };
    }

    if (dayOfWeek) {
        filters.dayOfWeek = dayOfWeek;
    }

    try {
        const courses = await YogaCourse.find(filters).populate('classType');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.filterCourses = async (req, res) => {
    const { duration, classType } = req.query;
    let filters = {};

    if (duration) {
        filters.duration = parseInt(duration, 10); 
    }

    if (classType) {
        filters.classType = classType;
    }

    try {
        const courses = await YogaCourse.find(filters).populate('classType');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
