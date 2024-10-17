const YogaCourse = require('../models/YogaCourse');
const User = require('../models/User');

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await YogaCourse.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.detailCourse = async (req, res) => {
    try {
        const course = await YogaCourse.findById(req.params.id);
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
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const updatedCourse = await YogaCourse.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
        console.log('Received request to join course:', req.params.id);
        
        const course = await YogaCourse.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.capacity <= 0) {
            return res.status(400).json({ message: 'Course is full' });
        }

        // Sử dụng thông tin từ session
        console.log('Fetching user from session:', req.session.userId);
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

        course.capacity -= 1;
        await course.save();

        user.courses.push(course._id);
        await user.save();

        res.json({ message: 'Successfully joined the course', course });
    } catch (error) {
        console.error('Error in joinCourse:', error);
        res.status(500).json({ message: error.message });
    }
};


exports.searchCourses = async (req, res) => {
    const { search } = req.query;
    try {
        const courses = await YogaCourse.find({
            $or: [
                { classType: { $regex: search, $options: 'i' } },
                { teacherName: { $regex: search, $options: 'i' } } 
            ]
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.filterCourses = async (req, res) => {
    const { courseTime, classType } = req.query;
    let filters = {};

    if (courseTime) {
        filters.courseTime = { $gte: new Date(courseTime) }; 
    }

    if (classType) {
        filters.classType = classType; 
    }

    try {
        const courses = await YogaCourse.find(filters);
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
