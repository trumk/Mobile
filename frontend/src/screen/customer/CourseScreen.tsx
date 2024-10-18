import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  fetchCourses,
  addYogaCourse,
  deleteYogaCourse,
  fetchClassTypes,
} from "../apiRequest";
import { YogaCourse, ClassType } from "../../../types";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const CourseScreen = () => {
  const [courses, setCourses] = useState<YogaCourse[]>([]);
  const [newCourse, setNewCourse] = useState<
    Omit<YogaCourse, "_id" | "classType">
  >({
    dayOfWeek: "",
    courseTime: "",
    capacity: 0,
    duration: 0,
    pricePerClass: 0,
    description: "",
    teacherName: "",
    location: "",
  });
  const [selectedClassType, setSelectedClassType] = useState<string>("");
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [courseTime, setCourseTime] = useState<Date>(new Date());
  const [showDayPicker, setShowDayPicker] = useState<boolean>(false);
  const [showClassTypePicker, setShowClassTypePicker] =
    useState<boolean>(false);

  const loadCourses = async () => {
    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const loadClassTypes = async () => {
    try {
      const data = await fetchClassTypes();
      setClassTypes(data);
    } catch (error) {
      console.error("Failed to fetch class types:", error);
    }
  };

  const addCourse = async () => {
    try {
      await addYogaCourse({
        ...newCourse,
        classType: selectedClassType,
        courseTime: courseTime.toISOString(),
      });
      loadCourses();
    } catch (error) {
      console.error("Failed to add course:", error);
    }
  };

  const deleteCourse = async (courseId: string) => {
    try {
      await deleteYogaCourse(courseId);
      loadCourses();
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  useEffect(() => {
    loadCourses();
    loadClassTypes();
  }, []);

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    const currentTime = selectedDate || courseTime;
    setShowTimePicker(false);
    setCourseTime(currentTime);
    setNewCourse({ ...newCourse, courseTime: currentTime.toISOString() });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yoga Courses</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.courseItem}>

          </View>
        )}
      />

      <TouchableOpacity
        onPress={() => setShowDayPicker(!showDayPicker)}
        style={styles.dropdownButton}
      >
        <Text style={styles.dropdownButtonText}>
          {newCourse.dayOfWeek ? newCourse.dayOfWeek : "Select Day of the Week"}
        </Text>
      </TouchableOpacity>
      {showDayPicker && (
        <FlatList
          data={daysOfWeek}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setNewCourse({ ...newCourse, dayOfWeek: item });
                setShowDayPicker(false);
              }}
              style={styles.dropdownItem}
            >
              <Text style={styles.dropdownItemText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Picker để chọn thời gian */}
      <Button
        title="Select Course Time"
        onPress={() => setShowTimePicker(true)}
      />
      {showTimePicker && (
        <DateTimePicker
          value={courseTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}
      <Text>Selected Time: {courseTime.toLocaleTimeString()}</Text>

      <TextInput
        placeholder="Capacity"
        value={newCourse.capacity.toString()}
        onChangeText={(text) =>
          setNewCourse({ ...newCourse, capacity: parseInt(text) || 0 })
        } // Kiểm tra giá trị hợp lệ
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Duration (minutes)"
        value={newCourse.duration.toString()}
        onChangeText={(text) =>
          setNewCourse({ ...newCourse, duration: parseInt(text) || 0 })
        } // Kiểm tra giá trị hợp lệ
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Price Per Class"
        value={newCourse.pricePerClass.toString()}
        onChangeText={(text) =>
          setNewCourse({ ...newCourse, pricePerClass: parseFloat(text) || 0 })
        } // Kiểm tra giá trị hợp lệ
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Description"
        value={newCourse.description}
        onChangeText={(text) =>
          setNewCourse({ ...newCourse, description: text })
        }
        style={styles.input}
      />
      <TextInput
        placeholder="Teacher Name"
        value={newCourse.teacherName}
        onChangeText={(text) =>
          setNewCourse({ ...newCourse, teacherName: text })
        }
        style={styles.input}
      />
      <TextInput
        placeholder="Location"
        value={newCourse.location}
        onChangeText={(text) => setNewCourse({ ...newCourse, location: text })}
        style={styles.input}
      />

      {/* FlatList cho Class Type */}
      <TouchableOpacity
        onPress={() => setShowClassTypePicker(!showClassTypePicker)}
        style={styles.dropdownButton}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedClassType
            ? classTypes.find((ct) => ct._id === selectedClassType)?.typeName ||
              "Select Class Type"
            : "Select Class Type"}
        </Text>
      </TouchableOpacity>
      {showClassTypePicker && (
        <FlatList
          data={classTypes}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedClassType(item._id);
                setShowClassTypePicker(false);
              }}
              style={styles.dropdownItem}
            >
              <Text style={styles.dropdownItemText}>{item.typeName}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Button title="Add Course" onPress={addCourse} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
  courseItem: { marginBottom: 10, padding: 10, backgroundColor: "#f0f0f0" },
  input: { marginBottom: 10, padding: 8, borderWidth: 1, borderColor: "#ccc" },
  dropdownButton: {
    padding: 10,
    backgroundColor: "#ddd",
    marginBottom: 10,
    borderRadius: 5,
  },
  dropdownButtonText: { fontSize: 16 },
  dropdownItem: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dropdownItemText: { fontSize: 16 },
});

export default CourseScreen;
