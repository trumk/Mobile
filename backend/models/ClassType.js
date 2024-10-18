const mongoose = require('mongoose');

const ClassTypeSchema = new mongoose.Schema({
    typeName: { type: String, required: true }
});

module.exports = mongoose.model('ClassType', ClassTypeSchema);
