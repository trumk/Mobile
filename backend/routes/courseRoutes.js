const express = require('express');
const { getAllCourses, createCourse, updateCourse, deleteCourse, detailCourse } = require('../controllers/yogaController');
const router = express.Router();

router.get('/courses', getAllCourses);
router.get('/courses/:id', detailCourse);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

module.exports = router;
