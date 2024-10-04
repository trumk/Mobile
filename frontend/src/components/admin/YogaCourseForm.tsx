import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import { YogaCourse } from "../../../types";

type YogaCourseFormProps = {
  course?: YogaCourse;
  onSubmit: (course: Omit<YogaCourse, "_id">) => void;
};

const YogaCourseForm: React.FC<YogaCourseFormProps> = ({
  course,
  onSubmit,
}) => {
  const [dayOfWeek, setDayOfWeek] = useState(course?.dayOfWeek || "");
  const [courseTime, setCourseTime] = useState<Date | undefined>(
    course ? new Date(course.courseTime) : undefined
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [capacity, setCapacity] = useState(course?.capacity || 0);
  const [duration, setDuration] = useState(course?.duration || 60);
  const [pricePerClass, setPricePerClass] = useState(
    course?.pricePerClass || 0
  );
  const [classType, setClassType] = useState(course?.classType || "Flow Yoga");
  const [description, setDescription] = useState(course?.description || "");
  const [teacherName, setTeacherName] = useState(course?.teacherName || "");
  const [location, setLocation] = useState(course?.location || "");

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
    setShowTimePicker(false);
    if (selectedTime) {
      setCourseTime(selectedTime);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
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

        <Text style={styles.label}>Course Time:</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.buttonText}>
            {courseTime
              ? `Selected: ${courseTime.toLocaleTimeString()}`
              : "Pick Time"}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={courseTime || new Date()}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}

        <Text style={styles.label}>Capacity:</Text>
        <TextInput
          style={styles.input}
          value={capacity ? capacity.toString() : ""}
          keyboardType="numeric"
          onChangeText={(value) => setCapacity(Number(value))}
          placeholder="Enter capacity"
        />

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

        <Text style={styles.label}>Price per Class (£):</Text>
        <TextInput
          style={styles.input}
          value={pricePerClass ? pricePerClass.toString() : ""}
          keyboardType="numeric"
          onChangeText={(value) => setPricePerClass(Number(value))}
          placeholder="Enter price"
        />

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

        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
        />

        <Text style={styles.label}>Teacher Name:</Text>
        <TextInput
          style={styles.input}
          value={teacherName}
          onChangeText={setTeacherName}
          placeholder="Enter teacher's name"
        />

        <Text style={styles.label}>Location:</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter location"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
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
  button: {
    backgroundColor: "#1e90ff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  textSmall: {
    fontSize: 14,
    marginVertical: 8,
    color: "#666",
  },
  submitButton: {
    backgroundColor: "#28a745",
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

export default YogaCourseForm;
