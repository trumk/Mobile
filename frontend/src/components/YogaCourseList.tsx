import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationProp } from "@react-navigation/native"; 
import { RootStackParamList } from "../../App";
import { YogaCourse } from "../../types";

type YogaCourseListProps = {
  courses: YogaCourse[];
  navigation: NavigationProp<RootStackParamList, "Detail Course">;
};

const YogaCourseList: React.FC<YogaCourseListProps> = ({ courses, navigation }) => {
  if (courses.length === 0) {
    return <Text style={styles.emptyText}>No courses available.</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const isFull = item.capacity === 0;
          const isJoined = item.isJoined || false;

          return (
            <View
              style={[
                styles.courseCard,
                isFull && !isJoined ? styles.fullCourse : {},
              ]}
            >
              <Text style={styles.courseTitle}>Day: {item.dayOfWeek}</Text>
              <Text style={styles.courseDetail}>Location: {item.location}</Text>
              <Text style={styles.courseDetail}>
                Capacity: {isFull ? "Full" : item.capacity}
              </Text>
              <Text style={styles.courseDetail}>
                Price: ${item.pricePerClass.toFixed(2)}
              </Text>

              <TouchableOpacity
                style={[styles.detailButton, isFull && !isJoined ? styles.disabledButton : {}]}
                onPress={() => {
                  if (!isFull || isJoined) {
                    navigation.navigate("Detail Course", { courseId: item._id });
                  }
                }}
                disabled={isFull && !isJoined}
              >
                <Text style={styles.detailButtonText}>
                  {isFull && !isJoined ? "Full" : "View Details"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
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
  fullCourse: {
    opacity: 0.5,
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
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
    marginTop: 50,
  },
  detailButton: {
    backgroundColor: "#2a7183",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#888",
  },
  detailButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default YogaCourseList;
