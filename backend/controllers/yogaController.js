const YogaCourse = require("../models/YogaCourse");
const User = require("../models/User");
const ClassType = require("../models/ClassType");
const mongoose = require("mongoose");

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await YogaCourse.find().populate({
      path: "classType",
      model: "ClassType",
      select: "typeName description teacher date duration",
    });

    let userCourses = [];
    if (req.session.userId) {
      const user = await User.findById(req.session.userId);
      if (user) {
        userCourses = user.courses.map((course) => course.toString());
      }
    }

    const coursesWithIsJoined = courses.map((course) => {
      const isJoined = userCourses.includes(course._id.toString());
      return {
        ...course.toObject(),
        isJoined,
      };
    });

    res.json(coursesWithIsJoined);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.detailCourse = async (req, res) => {
  try {
    const course = await YogaCourse.findById(req.params.id)
      .populate("participants", "username") 
      .populate("classType");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const participantsUsernames = course.participants.map(participant => participant.username);

    let isJoined = false;
    if (req.session.userId) {
      isJoined = course.participants.some(participant => participant._id.toString() === req.session.userId);
    }

    res.json({
      ...course.toObject(),
      participants: participantsUsernames,
      isJoined
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.detailCourse2 = async (req, res) => {
  try {
    const includeParticipants = req.query.includeParticipants === 'true';
    const query = YogaCourse.findById(req.params.id)
      .populate("classType");

    if (includeParticipants) {
      query.populate("participants", "username");
    }

    const course = await query;

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (includeParticipants) {
      const participantsUsernames = course.participants.map(participant => participant.username);
      res.json({
        ...course.toObject(),
        participants: participantsUsernames
      });
    } else {
      const courseWithoutParticipants = { ...course.toObject() };
      delete courseWithoutParticipants.participants;
      res.json(courseWithoutParticipants);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.checkClassTypesAvailability = async (req, res) => {
  const classTypeIds = req.body.classType.map((ct) => ct._id);
  const excludeCourseId = req.query.excludeCourseId || null;

  try {
    const existingCourse = await YogaCourse.findOne({
      classType: { $in: classTypeIds },
      ...(excludeCourseId && { _id: { $ne: excludeCourseId } }),
    });

    if (existingCourse) {
      return res.status(400).json({
        message:
          "One or more selected class types are already assigned to another course",
      });
    }

    res.status(200).json({ message: "All selected class types are available" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCourse = async (req, res) => {
  const { dayOfWeek, timeOfCourse, capacity, pricePerClass, classType, location } = req.body;

  try {
    let classTypeIds = [];
    
    if (classType && Array.isArray(classType) && classType.length > 0) {
      classTypeIds = classType.map((ct) => ct._id);
      const existingCourse = await YogaCourse.findOne({
        classType: { $in: classTypeIds },
      });
      if (existingCourse) {
        return res.status(400).json({
          message:
            "One or more selected class types are already assigned to another course",
        });
      }
    }

    const newCourse = new YogaCourse({
      dayOfWeek,
      timeOfCourse,
      capacity,
      pricePerClass,
      classType: classTypeIds,
      location,
    });

    await newCourse.save();
    await newCourse.populate("classType");

    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  const { classType, dayOfWeek, timeOfCourse, capacity, pricePerClass, location } = req.body;

  try {
    let updatedClassTypes = null;

    if (classType && Array.isArray(classType) && classType.length > 0) {
      const classTypeIds = classType.map((ct) => ct._id);
      const existingCourse = await YogaCourse.findOne({
        classType: { $in: classTypeIds },
        _id: { $ne: req.params.id },
      });
      if (existingCourse) {
        return res.status(400).json({
          message:
            "One or more selected class types are already assigned to another course",
        });
      }
      updatedClassTypes = classTypeIds;
    }

    const updatedData = {
      dayOfWeek,
      timeOfCourse,
      capacity,
      pricePerClass,
      location,
      ...(updatedClassTypes && { classType: updatedClassTypes })
    };

    const updatedCourse = await YogaCourse.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    ).populate("classType");

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    res.json(updatedCourse);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update course", error: error.message });
  }
};


exports.deleteCourse = async (req, res) => {
  try {
    const courseToDelete = await YogaCourse.findById(req.params.id);
    if (!courseToDelete) {
      return res.status(404).json({ message: "Course not found" });
    }

    await User.updateMany(
      { _id: { $in: courseToDelete.participants } },
      { $pull: { courses: req.params.id } }
    );

    await YogaCourse.findByIdAndDelete(req.params.id);

    res.json({ message: "Course and participants successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchCourses = async (req, res) => {
  const { teacherName, dayOfWeek } = req.query;
  let filters = {};

  if (dayOfWeek) {
    filters.dayOfWeek = dayOfWeek;
  }

  try {
    const courses = await YogaCourse.find(filters).populate("classType");

    const filteredCourses = courses.filter(
      (course) =>
        !teacherName ||
        course.classType.some((ct) =>
          ct.teacher.match(new RegExp(teacherName, "i"))
        )
    );

    res.json(filteredCourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.filterCourses = async (req, res) => {
  const { dayOfWeek } = req.query;
  let filters = {};

  if (dayOfWeek) {
    filters.dayOfWeek = dayOfWeek;
  }

  try {
    const courses = await YogaCourse.find(filters).populate("classType");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
    const classType = await ClassType.findById(req.params.classTypeId);

    if (!classType) {
      return res.status(404).json({ message: "Class type not found" });
    }

    res.json(classType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addClassTypeToCourse = async (req, res) => {
  const { courseId } = req.params;
  const { typeName, description, teacher, date, duration } = req.body;

  try {
    const newClassType = new ClassType({
      typeName,
      description,
      teacher,
      date,
      duration,
    });

    await newClassType.save();

    const updatedCourse = await YogaCourse.findByIdAndUpdate(
      courseId,
      { $push: { classType: newClassType._id } }, 
      { new: true }
    ).populate("classType"); 

    res.status(201).json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateClassTypeInCourse = async (req, res) => {
  const { id } = req.params;
  const { typeName, description, teacher, date, duration } = req.body;

  try {
    const updatedClassType = await ClassType.findByIdAndUpdate(
      id,
      { typeName, description, teacher, date, duration },
      { new: true }
    );

    if (!updatedClassType) {
      return res.status(404).json({ message: "Class type not found" });
    }

    res.json(updatedClassType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.removeClassTypeFromCourse = async (req, res) => {
  let { courseId, id } = req.params;

  if (!id) {
      console.log("Received an undefined classTypeId");
      return res.status(400).json({ message: "Class type ID is required" });
  }

  id = id.trim();


  if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ClassType ID format:", id);
      return res.status(400).json({ message: "Invalid Class type ID format" });
  }

  try {
      const deletedClassType = await ClassType.findByIdAndDelete(id);

      if (!deletedClassType) {
          console.log("ClassType not found with ID:", id);
          return res.status(404).json({ message: "Class type not found" });
      }

      const course = await YogaCourse.findByIdAndUpdate(
          courseId,
          { $pull: { classType: id } },
          { new: true }
      ).populate("classType");

      if (!course) {
          return res.status(404).json({ message: "Course not found" });
      }

      res.json(course);

  } catch (error) {
      console.log("Error in removeClassTypeFromCourse:", error.message);
      res.status(500).json({ message: error.message });
  }
};