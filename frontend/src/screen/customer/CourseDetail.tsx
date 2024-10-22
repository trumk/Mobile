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
import { format } from 'date-fns';

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
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours() % 12 || 12;
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const amPm = date.getUTCHours() >= 12 ? 'PM' : 'AM';
    
    return `${day}-${month}-${year} ${hours}:${minutes} ${amPm}`;
  };
  
  const handleAddToCart = async (classTypeId: string, yogaCourseId: string) => {
    try {
      if (course.capacity === 0) {
        Alert.alert("Cannot Add to Cart", "This class is fully booked.");
        return;
      }
      await addToCart(classTypeId, yogaCourseId);
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
      {course.classType && course.classType.length > 0 ? (
        course.classType.map((classType: any) => (
          <View key={classType._id} style={styles.classTypeCard}>
            <View style={styles.classTypeContent}>
              <Text style={styles.classTypeText}>- {classType.typeName}</Text>
              <Text style={styles.classTypeText}>
                Teacher: {classType.teacher}
              </Text>
              <Text style={styles.classTypeText}>
                Date: {formatDateTime(classType.date)}
              </Text>
              <Text style={styles.classTypeText}>
                Description: {classType.description || "No Description Available"}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.addToCartButton,
                isFull ? styles.disabledButton : {},
              ]}
              onPress={() => handleAddToCart(classType._id, course._id)}
              disabled={isFull}
            >
              <Icon name="shopping-cart" size={24} color={isFull ? "#888" : "#4CAF50"} />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noClassTypeText}>No Class Types Available</Text>
      )}

      <Text style={styles.participantsTitle}>Participants:</Text>
      {course.participants && course.participants.length > 0 ? (
        course.participants.map((participant: any) => (
          <Text key={participant._id} style={styles.participantText}>
            {participant.username} - {participant.email}
          </Text>
        ))
      ) : (
        <Text style={styles.noParticipants}>No participants yet</Text>
      )}

      {isJoined && (
        <View style={styles.qrContainer}>
          <Text style={styles.qrText}>Your QR Code:</Text>
          <QRCode
            value={`Course ID: ${course._id}\nCourse: ${course.dayOfWeek}\nLocation: ${course.location}\nDate: ${formatDateTime(course.classType[0]?.date)}\nPrice: $${course.pricePerClass}`}
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
    backgroundColor: "#f0f8ff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#4CAF50",
    marginBottom: 15,
  },
  details: {
    fontSize: 18,
    marginBottom: 10,
    color: "#555",
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4CAF50",
    marginVertical: 20,
  },
  classTypeCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  classTypeContent: {
    flex: 1,
  },
  classTypeText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  addToCartButton: {
    marginLeft: 15,
  },
  disabledButton: {
    opacity: 0.6,
  },
  noClassTypeText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  participantsTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4CAF50",
    marginVertical: 20,
  },
  participantText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
  noParticipants: {
    fontSize: 16,
    color: "#888",
  },
  qrContainer: {
    marginTop: 30,
    alignItems: "center",
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  qrText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4CAF50",
    marginBottom: 10,
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default CourseDetail;
