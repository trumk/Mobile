const YogaCourse = require('../models/YogaCourse');
const User = require('../models/User');
const ClassType = require('../models/ClassType');

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await YogaCourse.find().populate({
            path: 'classType',
            model: 'ClassType',
            select: 'typeName description teacher date duration' 
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.detailCourse = async (req, res) => {
    try {
        const course = await YogaCourse.findById(req.params.id)
            .populate('participants', 'username email')
            .populate({
                path: 'classType',
                model: 'ClassType'
            });

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
    const { dayOfWeek, capacity, pricePerClass, classType, location } = req.body;

    try {
        if (!classType || !Array.isArray(classType) || classType.length === 0) {
            return res.status(400).json({ message: 'A valid class type is required' });
        }

        const classTypeIds = classType.map(ct => ct._id);

        const newCourse = new YogaCourse({
            dayOfWeek,
            capacity,
            pricePerClass,
            classType: classTypeIds, // Lưu danh sách các ID của ClassType
            location
        });

        await newCourse.save();
        await newCourse.populate('classType');

        res.status(201).json(newCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.updateCourse = async (req, res) => {
    const { classType, dayOfWeek } = req.body;

    try {
        let updatedClassTypes = null;

        if (classType) {
            if (!Array.isArray(classType) || classType.length === 0) {
                return res.status(400).json({ message: 'A valid class type is required' });
            }

            const classTypeIds = classType.map(ct => ct._id);
            updatedClassTypes = classTypeIds;
        }

        const updatedData = { ...req.body };
        if (updatedClassTypes) {
            updatedData.classType = updatedClassTypes;
        }

        const updatedCourse = await YogaCourse.findByIdAndUpdate(req.params.id, updatedData, { new: true }).populate('classType');
        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(updatedCourse);
    } catch (error) {
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

    if (dayOfWeek) {
        filters.dayOfWeek = dayOfWeek;
    }

    try {
        const courses = await YogaCourse.find(filters).populate('classType');

        const filteredCourses = courses.filter(course => 
            !teacherName || course.classType.some(ct => ct.teacher.match(new RegExp(teacherName, 'i')))
        );

        res.json(filteredCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.filterCourses = async (req, res) => {
    const { dayOfWeek } = req.query;
    let filters = {};

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
