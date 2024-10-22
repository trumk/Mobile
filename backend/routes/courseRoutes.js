const express = require('express');
const { searchCourses, getAllCourses, detailCourse, detailCoursePublic, createCourse, updateCourse, deleteCourse, filterCourses, checkClassTypesAvailability } = require('../controllers/yogaController');

const router = express.Router();

router.get('/courses/search', searchCourses);   
router.get('/courses/filter', filterCourses);         
router.get('/courses', getAllCourses);   
router.get('/courses/:id', detailCourse);   
router.get('/courses/not/:id', detailCoursePublic);     
router.post('/courses', createCourse);     
router.put('/courses/:id',  updateCourse);   
router.delete('/courses/:id', deleteCourse); 

module.exports = router;
