const YogaCourse = require('../models/YogaCourse');

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
            return res.status(404).json({ message: 'Khóa học không được tìm thấy' });
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
            return res.status(404).json({ message: 'Khóa học không được tìm thấy' });
        }
        res.json(updatedCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const deletedCourse = await YogaCourse.findByIdAndDelete(req.params.id);
        if (!deletedCourse) {
            return res.status(404).json({ message: 'Khóa học không được tìm thấy' });
        }
        res.json({ message: 'Khóa học đã được xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
