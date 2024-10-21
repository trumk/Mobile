import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native"; 
import { fetchCoursesWithClassTypes } from "../screen/apiRequest";
import { RootStackParamList } from "../../App";


const YogaCourseList: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); 

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const enrichedCourses = await fetchCoursesWithClassTypes();
        setCourses(enrichedCourses);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.courseCard}>
            <Text style={styles.courseTitle}>Day: {item.dayOfWeek}</Text>
            <Text style={styles.courseDetail}>Location: {item.location}</Text>
            <Text style={styles.courseDetail}>Capacity: {item.capacity}</Text>
            <Text style={styles.courseDetail}>Price: ${item.pricePerClass}</Text>

            <TouchableOpacity
              style={styles.detailButton}
              onPress={() => {
                navigation.navigate("Detail Course", { courseId: item._id });
              }}
            >
              <Text style={styles.detailButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f4f8",
  },
  courseCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  courseDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
  classType: {
    marginTop: 10,
  },
  classTypeText: {
    fontSize: 14,
  },
  detailButton: {
    backgroundColor: "#2a7183",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  detailButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default YogaCourseList;
