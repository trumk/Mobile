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
import { addToCart, fetchCourseDetails, joinYogaCourse } from "../apiRequest";
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
    return format(date, "yyyy-MM-dd HH:mm:ss 'UTC'XXX");
  };

  const handleAddToCart = async (classTypeId: string, yogaCourseId: string) => {
    try {
      await addToCart(classTypeId, yogaCourseId);
      Alert.alert("Success", "Class added to cart");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to add to cart.");
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
      <Text style={styles.title}>Course: {course.dayOfWeek || "N/A"}</Text>
      <Text style={styles.details}>Location: {course.location || "N/A"}</Text>
      <Text style={styles.details}>
        Capacity: {course.capacity || "Full"} person(s)
      </Text>
      <Text style={styles.details}>
        Price per Class: ${course.pricePerClass || "N/A"}
      </Text>

      <Text style={styles.sectionTitle}>Class Infos:</Text>
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
              style={styles.addToCartButton}
              onPress={() => handleAddToCart(classType._id, course._id)}
            >
              <Icon name="shopping-cart" size={24} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noClassTypeText}>No Class Types Available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
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
  },
  details: {
    fontSize: 18,
    marginBottom: 12,
    color: "#34495E",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E5B75",
    marginVertical: 15,
  },
  classTypeCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    alignItems: "center",
    justifyContent: "space-between",
  },
  classTypeContent: {
    flex: 1,
  },
  classTypeText: {
    fontSize: 16,
    color: "#34495E",
    marginBottom: 5,
  },
  addToCartButton: {
    marginLeft: 10,
  },
  noClassTypeText: {
    fontSize: 16,
    color: "#888",
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
  },
  noParticipants: {
    fontSize: 16,
    color: "#888",
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: "center",
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
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default CourseDetail;
