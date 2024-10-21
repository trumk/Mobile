const ClassType = require('../models/ClassType');

exports.getAllClassTypes = async (req, res) => {
    try {
        const classTypes = await ClassType.find();
        res.json(classTypes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getClassTypeById = async (req, res) => {
    try {
        const classType = await ClassType.findById(req.params.id);
        if (!classType) {
            return res.status(404).json({ message: 'Class type not found' });
        }
        res.json(classType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getClassTypesByIds = async (req, res) => {
    const { ids } = req.body; 

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'A list of IDs is required' });
    }

    try {
        const classTypes = await ClassType.find({ _id: { $in: ids } });
        res.json(classTypes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createClassType = async (req, res) => {
    const { typeName, description, teacher, date } = req.body;
    try {
        const newClassType = new ClassType({
            typeName,
            description,
            teacher,
            date
        });
        await newClassType.save();
        res.status(201).json(newClassType);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateClassType = async (req, res) => {
    try {
        const { typeName, description, teacher, date } = req.body;
        const updatedClassType = await ClassType.findByIdAndUpdate(
            req.params.id,
            { typeName, description, teacher, date },
            { new: true }
        );
        if (!updatedClassType) {
            return res.status(404).json({ message: 'Class type not found' });
        }
        res.json(updatedClassType);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteClassType = async (req, res) => {
    try {
        const deletedClassType = await ClassType.findByIdAndDelete(req.params.id);
        if (!deletedClassType) {
            return res.status(404).json({ message: 'Class type not found' });
        }
        res.json({ message: 'Class type successfully deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
