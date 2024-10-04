const express = require('express');
const { getAllCourses, createCourse, updateCourse, deleteCourse, detailCourse } = require('../controllers/yogaController');
const router = express.Router();

const checkAdmin = (req, res, next) => {
    if (req.session.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

router.get('/courses', getAllCourses);       
router.get('/courses/:id', detailCourse);     

// admin only
router.post('/courses', checkAdmin, createCourse);     
router.put('/courses/:id', checkAdmin, updateCourse);   
router.delete('/courses/:id', checkAdmin, deleteCourse);

module.exports = router;
