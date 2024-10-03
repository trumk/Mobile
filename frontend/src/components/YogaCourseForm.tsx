import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Platform,
  StyleSheet,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import { YogaCourse } from "../../types"; 

type YogaCourseFormProps = {
  course?: YogaCourse;
  onSubmit: (course: Omit<YogaCourse, "_id">) => void;
};

const YogaCourseForm: React.FC<YogaCourseFormProps> = ({ course, onSubmit }) => {
  const [dayOfWeek, setDayOfWeek] = useState(course?.dayOfWeek || "");
  const [courseTime, setCourseTime] = useState(course?.courseTime || "");
  const [capacity, setCapacity] = useState(course?.capacity || 0);
  const [duration, setDuration] = useState(course?.duration || 60);
  const [pricePerClass, setPricePerClass] = useState(course?.pricePerClass || 0);
  const [classType, setClassType] = useState(course?.classType || "Flow Yoga");
  const [description, setDescription] = useState(course?.description || "");
  const [teacherName, setTeacherName] = useState(course?.teacherName || "");
  const [location, setLocation] = useState(course?.location || "");

  const handleSubmit = () => {
    onSubmit({
      dayOfWeek,
      courseTime,
      capacity,
      duration,
      pricePerClass,
      classType,
      description,
      teacherName,
      location,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Day of the Week:</Text>
        <TextInput
          style={styles.input}
          value={dayOfWeek}
          onChangeText={setDayOfWeek}
        />

        <Text style={styles.label}>Course Time:</Text>
        <TextInput
          style={styles.input}
          value={courseTime}
          onChangeText={setCourseTime}
        />

        <Text style={styles.label}>Capacity:</Text>
        <TextInput
          style={styles.input}
          value={capacity ? capacity.toString() : ""}
          keyboardType="numeric"
          onChangeText={(value) => setCapacity(Number(value))}
        />

        <Text style={styles.label}>Duration (minutes):</Text>
        <TextInput
          style={styles.input}
          value={duration ? duration.toString() : ""}
          keyboardType="numeric"
          onChangeText={(value) => setDuration(Number(value))}
        />

        <Text style={styles.label}>Price per Class (£):</Text>
        <TextInput
          style={styles.input}
          value={pricePerClass ? pricePerClass.toString() : ""}
          keyboardType="numeric"
          onChangeText={(value) => setPricePerClass(Number(value))}
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
        />

        <Text style={styles.label}>Teacher Name:</Text>
        <TextInput
          style={styles.input}
          value={teacherName}
          onChangeText={setTeacherName}
        />

        <Text style={styles.label}>Location:</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
        />

        <Button title="Submit" onPress={handleSubmit} />
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
    backgroundColor: "#f9f9f9",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
});

const pickerSelectStyles = {
  inputIOS: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  inputAndroid: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
};

export default YogaCourseForm;
