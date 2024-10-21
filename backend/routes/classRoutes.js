const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

router.get('/', classController.getAllClassTypes);
router.get('/:id', classController.getClassTypeById);
router.post('/', classController.createClassType);
router.put('/:id', classController.updateClassType);
router.delete('/:id', classController.deleteClassType);

module.exports = router;
