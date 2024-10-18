import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import Picker
import { fetchCoursesBySearch } from "../apiRequest";
import { YogaCourse } from "../../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../App";

type SearchScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Detail Course">;
};

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const [teacherName, setTeacherName] = useState("");
  const [courses, setCourses] = useState<YogaCourse[]>([]);
  const [dayOfWeek, setDayOfWeek] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      const data = await fetchCoursesBySearch(teacherName, dayOfWeek);
      setCourses(data);
    } catch (error) {
      console.error("Failed to search courses:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by teacher name"
        value={teacherName}
        onChangeText={setTeacherName}
        style={styles.input}
      />
      <Button title="Search" onPress={handleSearch} color="#1e90ff" />

      <Text style={styles.label}>Filter by Day of Week</Text>
      <Picker
        selectedValue={dayOfWeek}
        onValueChange={(itemValue) => setDayOfWeek(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Day" value={null} />
        {daysOfWeek.map((day) => (
          <Picker.Item key={day} label={day} value={day} />
        ))}
      </Picker>

      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseItem}
            onPress={() =>
              navigation.navigate("Detail Course", { courseId: item._id })
            }
          >
            <Text style={styles.courseName}>{item.classType.typeName}</Text>
            <Text style={styles.courseDetails}>
              Teacher: {item.teacherName}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f0f4f8" },
  input: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  label: { marginTop: 20, marginBottom: 10, fontWeight: "bold", fontSize: 16 },
  picker: { height: 50, width: "100%", marginBottom: 20, borderWidth: 1, borderColor: "#ccc", borderRadius: 5 },
  courseItem: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  courseName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  courseDetails: { fontSize: 14, color: "#888" },
  listContainer: {
    paddingBottom: 20,
  },
});

export default SearchScreen;
