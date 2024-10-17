import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../App";
import { fetchCourseDetails, joinYogaCourse } from "../apiRequest";

type CourseDetailProps = {
  route: RouteProp<RootStackParamList, "Detail Course">;
  navigation: StackNavigationProp<RootStackParamList, "Detail Course">;
};

const CourseDetail: React.FC<CourseDetailProps> = ({ route, navigation }) => {
  const { courseId } = route.params;
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const data = await fetchCourseDetails(courseId);
        setCourse(data);
      } catch (err) {
        setError("Could not fetch course details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetail();
  }, [courseId]);

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const handleJoinCourse = async () => {
    try {
      const response = await joinYogaCourse(courseId); 
      Alert.alert('Success', response.message); 
    } catch (error: any) {
      Alert.alert('Error', error.message); 
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E5B75" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Kiểm tra nếu course là null
  if (!course) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No course details available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {course.classType || "No Class Type Available"}
      </Text>
      <Text style={styles.details}>
        Day of the Week: {course.dayOfWeek || "N/A"}
      </Text>
      <Text style={styles.details}>
        Time: {course.courseTime ? formatDateTime(course.courseTime) : "N/A"}
      </Text>
      <Text style={styles.details}>
        Capacity: {course.capacity || "N/A"} persons
      </Text>
      <Text style={styles.details}>
        Duration: {course.duration || "N/A"} minutes
      </Text>
      <Text style={styles.details}>
        Price per Class: £{course.pricePerClass || "N/A"}
      </Text>
      <Text style={styles.details}>Teacher: {course.teacherName || "N/A"}</Text>
      <Text style={styles.details}>Location: {course.location || "N/A"}</Text>
      <Text style={styles.details}>
        Description: {course.description || "No Description Available"}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleJoinCourse}>
          <Text style={styles.buttonText}>Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E5B75",
    marginBottom: 20,
    textAlign: "center",
  },
  details: {
    fontSize: 18,
    marginBottom: 12,
    color: "#34495E",
    lineHeight: 26,
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  buttonContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#1E5B75",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});

export default CourseDetail;
