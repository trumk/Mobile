import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView, 
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../App";
import { fetchCourseDetails, joinYogaCourse } from "../apiRequest";
import QRCode from "react-native-qrcode-svg";

type CourseDetailProps = {
  route: RouteProp<RootStackParamList, "Detail Course">;
  navigation: StackNavigationProp<RootStackParamList, "Detail Course">;
};

const CourseDetail: React.FC<CourseDetailProps> = ({ route, navigation }) => {
  const { courseId } = route.params;
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const data = await fetchCourseDetails(courseId);
        setCourse(data);
        setIsJoined(data.isJoined || false);
      } catch (err) {
        setError("Could not fetch course details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetail();
  }, [courseId, refresh]);

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const handleJoinCourse = async () => {
    try {
      const response = await joinYogaCourse(courseId);
      Alert.alert("Success", response.message);
      setIsJoined(true);
      setRefresh(!refresh);
    } catch (error: any) {
      Alert.alert("Error", error.message);
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

  if (!course) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No course details available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {course.classType?.typeName || "No Class Type Available"}
      </Text>
      <Text style={styles.details}>
        Day of the Week: {course.dayOfWeek || "N/A"}
      </Text>
      <Text style={styles.details}>
        Time: {course.courseTime ? formatDateTime(course.courseTime) : "N/A"}
      </Text>
      <Text style={styles.details}>
        Capacity: {course.capacity || "Full"} person(s)
      </Text>
      <Text style={styles.details}>
        Duration: {course.duration || "N/A"} minutes
      </Text>
      <Text style={styles.details}>
        Price per Class: £{course.pricePerClass || "N/A"}
      </Text>
      <Text style={styles.details}>
        Teacher: {course.teacherName || "N/A"}
      </Text>
      <Text style={styles.details}>
        Location: {course.location || "N/A"}
      </Text>
      <Text style={styles.details}>
        Description: {course.description || "No Description Available"}
      </Text>

      <Text style={styles.participantsTitle}>Participants:</Text>
      {course.participants && course.participants.length > 0 ? (
        course.participants.map((participant: any) => (
          <Text key={participant._id} style={styles.participantText}>
            - {participant.username}
          </Text>
        ))
      ) : (
        <Text style={styles.noParticipants}>No participants yet</Text>
      )}

      {isJoined ? (
        <View style={styles.qrContainer}>
          <Text style={styles.qrText}>You have joined this course!</Text>
          <QRCode
            value={`Course ID: ${course._id}, Class: ${
              course.classType?.typeName || "N/A"
            }, Teacher: ${course.teacherName}, Location: ${
              course.location
            }, Time: ${formatDateTime(course.courseTime)}`}
            size={150}
          />
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleJoinCourse}>
            <Text style={styles.buttonText}>Join</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
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
  participantsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 15,
  },
  participantText: {
    fontSize: 16,
    color: "#cd6c6c",
    padding: 5,
  },
  noParticipants: {
    fontSize: 16,
    color: "#888",
    padding: 5,
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
  qrContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  qrText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E5B75",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default CourseDetail;
