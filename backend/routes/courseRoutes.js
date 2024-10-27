const express = require('express');
const { 
    searchCourses, 
    getAllCourses, 
    detailCourse, 
    createCourse, 
    updateCourse, 
    deleteCourse, 
    filterCourses, 
    addClassTypeToCourse,
    updateClassTypeInCourse,
    removeClassTypeFromCourse,
    getClassTypeById,
    getAllClassTypes,
    detailCourse2
} = require('../controllers/yogaController');

const router = express.Router();

router.get('/courses/class', getAllClassTypes);
router.get('/courses/search', searchCourses);   
router.get('/courses/filter', filterCourses);         
router.get('/courses', getAllCourses);   
router.get('/courses/:id', detailCourse);   
router.get('/courses/ad/:id', detailCourse2);  
router.post('/courses', createCourse);     
router.put('/courses/:id', updateCourse);   
router.delete('/courses/:id', deleteCourse); 

router.post('/courses/:courseId/class', addClassTypeToCourse);           
router.put('/courses/class/:classTypeId', updateClassTypeInCourse);      
router.delete('/courses/:courseId/class/:id', removeClassTypeFromCourse);
router.get('/courses/class/:id', getClassTypeById); 

module.exports = router;
