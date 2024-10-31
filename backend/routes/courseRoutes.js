const express = require('express');
const { 
    searchCourses, 
    getAllCourses, 
    detailCourse, 
    createCourse, 
    updateCourse, 
    deleteCourse, 
    filterCourses, 
    addClassToCourse,
    updateClassInCourse,
    removeClassFromCourse,
    getClassById,
    getAllClasses,
    detailCourse2
} = require('../controllers/yogaController');

const router = express.Router();

router.get('/courses/class', getAllClasses);
router.get('/courses/search', searchCourses);   
router.get('/courses/filter', filterCourses);         
router.get('/courses', getAllCourses);   
router.get('/courses/:id', detailCourse);   
router.get('/courses/ad/:id', detailCourse2);  
router.post('/courses', createCourse);     
router.put('/courses/:id', updateCourse);   
router.delete('/courses/:id', deleteCourse); 

router.post('/courses/:courseId/class', addClassToCourse);
router.put('/courses/class/:id', updateClassInCourse);
router.delete('/courses/:courseId/class/:id', removeClassFromCourse);
router.get('/courses/class/:id', getClassById);

module.exports = router;