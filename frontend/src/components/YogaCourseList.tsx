import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { fetchUserDetails } from "../screen/apiRequest";
import { RootStackParamList } from "../../App";
import { YogaCourse } from "../../types"; 

type YogaCourseListProps = {
  courses: YogaCourse[];
  navigation: StackNavigationProp<RootStackParamList, "Detail Course">;
};

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

const YogaCourseList: React.FC<YogaCourseListProps> = ({
  courses,
  navigation,
}) => {
  const [userCourses, setUserCourses] = useState<string[]>([]);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const user = await fetchUserDetails();
        setUserCourses(user.courses.map((course: any) => course._id)); 
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getUserDetails();
  }, []);

  return (
    <View style={styles.container}>
  <FlatList
  data={courses}
  keyExtractor={(item) => item._id}
  renderItem={({ item }) => {
    const hasJoined = userCourses.includes(item._id);

    return (
      <View
        style={[
          styles.courseCard,
          item.capacity === 0 && !hasJoined && styles.courseFull,
        ]}
      >
        <View style={styles.courseHeader}>
          <Text style={styles.courseType}>
            {item.classType?.typeName || 'Unknown Class Type'}
          </Text>
          <Text style={styles.teacherName}>
            by {item.teacherName || 'Unknown Teacher'} 
          </Text>
        </View>
        <View style={styles.courseDetails}>
          <Text style={styles.courseDetailText}>
            Day: {item.dayOfWeek || 'N/A'} 
          </Text>
          <Text style={styles.courseDetailText}>
            Time: {item.courseTime ? formatTime(item.courseTime) : 'N/A'}
          </Text>
          <Text style={styles.courseDetailText}>
            Location: {item.location || 'Unknown Location'} 
          </Text>
          <Text style={styles.courseDetailText}>
            Duration: {item.duration ? `${item.duration} minutes` : 'N/A'} 
          </Text>
          <Text style={styles.courseDetailText}>
            Capacity: {item.capacity === 0 ? 'Fully booked' : item.capacity}
          </Text>
        </View>

        {hasJoined || item.capacity > 0 ? (
          <TouchableOpacity
          style={styles.detailButton}
          onPress={() => {
            navigation.navigate("Detail Course", { courseId: item._id });
          }}
        >
          <Text style={styles.detailButtonText}>View Details</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.fullNotice}>
          <Text style={styles.fullNoticeText}>Full</Text>
        </View>
      )}
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  courseFull: {
    opacity: 0.5,
  },
  courseHeader: {
    marginBottom: 15,
  },
  courseType: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 5,
  },
  teacherName: {
    fontSize: 16,
    color: "#8e8e93",
  },
  courseDetails: {
    marginBottom: 20,
  },
  courseDetailText: {
    fontSize: 16,
    color: "#34495e",
    marginBottom: 5,
  },
  detailButton: {
    backgroundColor: "#2a7183",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  detailButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  fullNotice: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  fullNoticeText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default YogaCourseList;