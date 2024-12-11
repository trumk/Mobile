const YogaCourse = require("../models/YogaCourse");
const User = require("../models/User");
const Class = require("../models/Class");
const mongoose = require("mongoose");

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await YogaCourse.find().populate({
      path: "class",
      model: "Class",
      select: "className description teacher date duration",
    });

    let userCourses = [];
    if (req.session.userId) {
      const user = await User.findById(req.session.userId);
      if (user) {
        userCourses = user.courses.map((course) => course.toString());
      }
    }

    const coursesWithDetails = courses.map((course) => {
      const isJoined = userCourses.includes(course._id.toString());
      const participantCount = course.participants ? course.participants.length : 0;

      return {
        ...course.toObject(),
        isJoined,
        participantCount,
      };
    });

    res.json(coursesWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.detailCourse = async (req, res) => {
  try {
    const course = await YogaCourse.findById(req.params.id)
      .populate("participants", "username")
      .populate({
        path: "class",
        populate: {
          path: "participants",
          select: "_id",
        },
      });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const participantsUsernames = course.participants.map(
      (participant) => participant.username
    );

    let isJoined = false;
    if (req.session.userId) {
      isJoined = course.participants.some(
        (participant) => participant._id.toString() === req.session.userId
      );
    }

    const classesWithJoinStatus = course.class.map((classItem) => {
      const isJoinClass = classItem.participants.some(
        (participant) => participant._id.toString() === req.session.userId
      );
      return {
        ...classItem.toObject(),
        isJoinClass,
      };
    });

    res.json({
      ...course.toObject(),
      participants: participantsUsernames,
      isJoined,
      class: classesWithJoinStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.detailCourse2 = async (req, res) => {
  try {
    const includeParticipants = req.query.includeParticipants === 'true';

    const query = YogaCourse.findById(req.params.id)
      .populate({
        path: "class",
        select: "className description teacher date duration participants"
      });

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


exports.createCourse = async (req, res) => {
  const { dayOfWeek, timeOfCourse, capacity, pricePerClass, typeOfClass, location, class: classes } = req.body;

  try {
    const classIds = classes && classes.length > 0 ? classes.map(ct => ct._id) : [];

    const newCourse = new YogaCourse({
      dayOfWeek: Array.isArray(dayOfWeek) ? dayOfWeek : [dayOfWeek], 
      timeOfCourse,
      capacity,
      pricePerClass,
      typeOfClass,
      location,
      class: classIds,
    });

    await newCourse.save();
    await newCourse.populate("class");

    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  const { dayOfWeek, timeOfCourse, capacity, pricePerClass, typeOfClass, location, class: classes } = req.body;

  try {
    const classIds = classes && classes.length > 0 ? classes.map(ct => ct._id) : null;

    const updatedData = {
      ...(dayOfWeek && { dayOfWeek: Array.isArray(dayOfWeek) ? dayOfWeek : [dayOfWeek] }), 
      ...(timeOfCourse && { timeOfCourse }),
      ...(capacity && { capacity }),
      ...(pricePerClass && { pricePerClass }),
      ...(typeOfClass && { typeOfClass }),
      ...(location && { location }),
      ...(classIds && { class: classIds }),
    };

    const updatedCourse = await YogaCourse.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    ).populate("class");

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: "Failed to update course", error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const courseToDelete = await YogaCourse.findById(req.params.id).populate("class");
    if (!courseToDelete) {
      return res.status(404).json({ message: "Course not found" });
    }

    const classIds = courseToDelete.class.map(classItem => classItem._id);
    await Class.deleteMany({ _id: { $in: classIds } });

    await User.updateMany(
      { _id: { $in: courseToDelete.participants } },
      { $pull: { courses: req.params.id } }
    );

    await YogaCourse.findByIdAndDelete(req.params.id);

    res.json({ message: "Course and associated classes successfully deleted" });
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
    const courses = await YogaCourse.find(filters).populate("class");

    const filteredCourses = courses.filter(
      (course) =>
        !teacherName ||
        course.class.some((cls) =>
          cls.teacher.match(new RegExp(teacherName, "i"))
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

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.classId);

    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json(cls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addClassToCourse = async (req, res) => {
  const { courseId } = req.params;
  const { className, description, teacher, date, duration } = req.body;

  try {
    const newClass = new Class({
      className,
      description,
      teacher,
      date,
      duration,
    });

    await newClass.save();

    const updatedCourse = await YogaCourse.findByIdAndUpdate(
      courseId,
      { $push: { class: newClass._id } },
      { new: true }
    ).populate("class");

    res.status(201).json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateClassInCourse = async (req, res) => {
  const { id } = req.params;
  const { className, description, teacher, date, duration } = req.body;

  try {
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { className, description, teacher, date, duration },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json(updatedClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.removeClassFromCourse = async (req, res) => {
  let { courseId, id } = req.params;

  if (!id) {
    console.log("Received an undefined classId");
    return res.status(400).json({ message: "Class ID is required" });
  }

  id = id.trim();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid Class ID format:", id);
    return res.status(400).json({ message: "Invalid Class ID format" });
  }

  try {
    const deletedClass = await Class.findByIdAndDelete(id);

    if (!deletedClass) {
      console.log("Class not found with ID:", id);
      return res.status(404).json({ message: "Class not found" });
    }

    const course = await YogaCourse.findByIdAndUpdate(
      courseId,
      { $pull: { class: id } },
      { new: true }
    ).populate("class");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.log("Error in removeClassFromCourse:", error.message);
    res.status(500).json({ message: error.message });
  }
};