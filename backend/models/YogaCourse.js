const mongoose = require('mongoose');

const YogaCourseSchema = new mongoose.Schema({
    dayOfWeek: { type: String, required: true },
    courseTime: { type: String, required: true }, 
    capacity: { type: Number, required: true },
    duration: { type: Number, required: true }, 
    pricePerClass: { type: Number, required: true }, 
    classType: { type: String, required: true },
    description: { type: String }, 
    teacherName: { type: String, required: true }, 
    location: { type: String, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
});

module.exports = mongoose.model('YogaCourse', YogaCourseSchema);
