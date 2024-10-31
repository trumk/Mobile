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
import { addToCart, fetchCourseDetails } from "../apiRequest";
import QRCode from "react-native-qrcode-svg";
import Icon from "react-native-vector-icons/FontAwesome";

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
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours() % 12 || 12;
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const amPm = date.getUTCHours() >= 12 ? "PM" : "AM";

    return `${day}-${month}-${year} ${hours}:${minutes} ${amPm}`;
  };

  const handleAddToCart = async (
    classId: string,
    yogaCourseId: string,
    pricePerClass: number
  ) => {
    try {
      if (course.capacity === 0) {
        Alert.alert("Cannot Add to Cart", "This class is fully booked.");
        return;
      }
      await addToCart(classId, yogaCourseId, pricePerClass);
      Alert.alert("Success", "Class added to cart");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to add to cart.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
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

  const isFull = course.capacity === 0;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Course: {course.dayOfWeek || "N/A"}</Text>
      <Text style={styles.details}>Location: {course.location || "N/A"}</Text>
      <Text style={styles.details}>
        Capacity: {isFull ? "Full" : `${course.capacity} person(s)`}
      </Text>
      <Text style={styles.details}>
        Price per Class: ${course.pricePerClass || "N/A"}
      </Text>

      <Text style={styles.sectionTitle}>Class Information:</Text>
      {course.class && course.class.length > 0 ? (
        course.class.map((classType: any) => (
          <View key={classType._id} style={styles.classTypeCard}>
            <View style={styles.classTypeContent}>
              <Text style={styles.classTypeText}>- {classType.className}</Text>
              <Text style={styles.classTypeText}>
                Teacher: {classType.teacher}
              </Text>
              <Text style={styles.classTypeText}>
                Date: {formatDateTime(classType.date)}
              </Text>
              <Text style={styles.classTypeText}>
                Description:{" "}
                {classType.description || "No Description Available"}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.addToCartButton,
                isFull ? styles.disabledButton : {},
              ]}
              onPress={() =>
                handleAddToCart(classType._id, course._id, course.pricePerClass)
              }
              disabled={isFull}
            >
              <Icon
                name="shopping-cart"
                size={24}
                color={isFull ? "#888" : "#4CAF50"}
              />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noClassTypeText}>No Class Types Available</Text>
      )}

      <Text style={styles.participantsTitle}>Participants:</Text>
      {course.participants && course.participants.length > 0 ? (
        course.participants.map((participant: string, index: number) => (
          <Text key={index} style={styles.participantText}>
            {participant}
          </Text>
        ))
      ) : (
        <Text style={styles.noParticipants}>No participants yet</Text>
      )}
      {isJoined && (
        <View style={styles.qrContainer}>
          <Text style={styles.qrText}>Your QR Code:</Text>
          <QRCode
            value={`Course ID: ${course._id}\nCourse: ${
              course.dayOfWeek
            }\nLocation: ${course.location}\nDate: ${formatDateTime(
              course.class[0]?.date
            )}\nPrice: $${course.pricePerClass}`}
            size={200}
            color="#1E5B75"
            backgroundColor="white"
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f9fc",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
    textAlign: "center",
  },
  details: {
    fontSize: 18,
    marginBottom: 10,
    color: "#34495e",
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3498db",
    marginVertical: 20,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  classTypeCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    alignItems: "center",
    justifyContent: "space-between",
    borderLeftWidth: 5,
    borderLeftColor: "#3498db",
  },
  classTypeContent: {
    flex: 1,
  },
  classTypeText: {
    fontSize: 16,
    color: "#2c3e50",
    marginBottom: 5,
  },
  addToCartButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "#eaf2f8",
  },
  disabledButton: {
    opacity: 0.6,
  },
  noClassTypeText: {
    fontSize: 16,
    color: "#bdc3c7",
    textAlign: "center",
  },
  participantsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#3498db",
    marginVertical: 20,
  },
  participantText: {
    fontSize: 18,
    color: "#27ae60",
    fontWeight: "500",
    lineHeight: 24,
    marginBottom: 5,
  },
  noParticipants: {
    fontSize: 16,
    color: "#bdc3c7",
  },
  qrContainer: {
    marginTop: 30,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ecf0f1",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  qrText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3498db",
    marginBottom: 10,
  },
  errorText: {
    fontSize: 18,
    color: "#e74c3c",
  },
});

export default CourseDetail;
