const express = require('express');
const { 
    getAllCourses, 
    createCourse, 
    updateCourse, 
    deleteCourse, 
    detailCourse, 
    joinCourse, 
    searchCourses, 
    filterCourses 
} = require('../controllers/yogaController');
const router = express.Router();


// Public routes
router.get('/courses/search', searchCourses);   
router.get('/courses/filter', filterCourses);         
router.get('/courses', getAllCourses);   
router.get('/courses/:id', detailCourse);       
router.post('/courses/:id/join', joinCourse);

// Admin-only routes
router.post('/courses', createCourse);     
router.put('/courses/:id', updateCourse);   
router.delete('/courses/:id', deleteCourse); 


// const checkAdmin = (req, res, next) => {
//     if (req.session.role !== 'admin') {
//         return res.status(403).json({ message: 'Access denied' });
//     }
//     next();
// };

// // Public routes
// router.get('/courses/search', searchCourses);   
// router.get('/courses/filter', filterCourses);         
// router.get('/courses', getAllCourses);   
// router.get('/courses/:id', detailCourse);       
// router.post('/courses/:id/join', joinCourse);

// // Admin-only routes
// router.post('/courses', createCourse);     
// router.put('/courses/:id', updateCourse);   
// router.delete('/courses/:id', deleteCourse); 

module.exports = router;
