import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import { YogaCourse } from "../../../types";

type YogaCourseEditProps = {
  course: YogaCourse;
  onSubmit: (course: Omit<YogaCourse, "_id">) => void;
};

const YogaCourseEdit: React.FC<YogaCourseEditProps> = ({ course, onSubmit }) => {
  const [dayOfWeek, setDayOfWeek] = useState(course.dayOfWeek);
  const [courseTime, setCourseTime] = useState<Date | undefined>(
    course ? new Date(course.courseTime) : undefined
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [capacity, setCapacity] = useState(course.capacity);
  const [duration, setDuration] = useState(course.duration);
  const [pricePerClass, setPricePerClass] = useState(course.pricePerClass);
  const [classType, setClassType] = useState(course.classType);
  const [description, setDescription] = useState(course.description);
  const [teacherName, setTeacherName] = useState(course.teacherName);
  const [location, setLocation] = useState(course.location);

  const handleSubmit = () => {
    const formattedCourseTime = courseTime?.toISOString() || "";
    onSubmit({
      dayOfWeek,
      courseTime: formattedCourseTime,
      capacity,
      duration,
      pricePerClass,
      classType,
      description,
      teacherName,
      location,
    });
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      setCourseTime(selectedTime);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Day of the Week Picker */}
        <Text style={styles.label}>Day of the Week:</Text>
        <RNPickerSelect
          onValueChange={setDayOfWeek}
          items={[
            { label: "Monday", value: "Monday" },
            { label: "Tuesday", value: "Tuesday" },
            { label: "Wednesday", value: "Wednesday" },
            { label: "Thursday", value: "Thursday" },
            { label: "Friday", value: "Friday" },
            { label: "Saturday", value: "Saturday" },
            { label: "Sunday", value: "Sunday" },
          ]}
          value={dayOfWeek}
          style={pickerSelectStyles}
          placeholder={{ label: "Select a day", value: null }}
        />

        {/* Course Time Picker */}
        <Text style={styles.label}>Course Time:</Text>
        <Button title="Pick Time" onPress={() => setShowTimePicker(true)} />
        {showTimePicker && (
          <DateTimePicker
            value={courseTime || new Date()}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
        {courseTime && (
          <Text style={styles.timeText}>
            Selected Time: {courseTime.toLocaleTimeString()}
          </Text>
        )}

        {/* Capacity Input */}
        <Text style={styles.label}>Capacity:</Text>
        <TextInput
          style={styles.input}
          value={capacity ? capacity.toString() : ""}
          keyboardType="numeric"
          onChangeText={(value) => setCapacity(Number(value))}
          placeholder="Enter capacity"
        />

        {/* Duration Picker */}
        <Text style={styles.label}>Duration (minutes):</Text>
        <RNPickerSelect
          onValueChange={(value) => setDuration(value)}
          items={[
            { label: "30 minutes", value: 30 },
            { label: "60 minutes", value: 60 },
            { label: "90 minutes", value: 90 },
            { label: "120 minutes", value: 120 },
          ]}
          value={duration}
          style={pickerSelectStyles}
          placeholder={{ label: "Select duration", value: null }}
        />
        <Text style={styles.textSmall}>Duration: {duration} minutes</Text>

        {/* Price Input */}
        <Text style={styles.label}>Price per Class (£):</Text>
        <TextInput
          style={styles.input}
          value={pricePerClass ? pricePerClass.toString() : ""}
          keyboardType="numeric"
          onChangeText={(value) => setPricePerClass(Number(value))}
          placeholder="Enter price"
        />

        {/* Class Type Picker */}
        <Text style={styles.label}>Class Type:</Text>
        <RNPickerSelect
          onValueChange={setClassType}
          items={[
            { label: "Flow Yoga", value: "Flow Yoga" },
            { label: "Aerial Yoga", value: "Aerial Yoga" },
            { label: "Family Yoga", value: "Family Yoga" },
          ]}
          value={classType}
          style={pickerSelectStyles}
        />

        {/* Description Input */}
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
        />

        {/* Teacher Name Input */}
        <Text style={styles.label}>Teacher Name:</Text>
        <TextInput
          style={styles.input}
          value={teacherName}
          onChangeText={setTeacherName}
          placeholder="Enter teacher's name"
        />

        {/* Location Input */}
        <Text style={styles.label}>Location:</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter location"
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Update Course</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  textSmall: {
    fontSize: 14,
    marginVertical: 8,
    color: "#666",
  },
  submitButton: {
    backgroundColor: "#1e90ff",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 16,
    marginVertical: 10,
  },
});

const pickerSelectStyles = {
  inputAndroid: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
};

export default YogaCourseEdit;
