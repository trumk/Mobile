import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
} from "react-native";
import { fetchUserDetails } from "../apiRequest";

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const fetchedUser = await fetchUserDetails();
        setUser(fetchedUser);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    getUserDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );
  }
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

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://img.freepik.com/free-photo/digital-art-style-yoga-illustration_23-2151536888.jpg",
        }}
        style={styles.headerBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../../../assets/logo.png")}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.username}>{user?.username}</Text>
        </View>
      </ImageBackground>

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Profile Details</Text>
        <View style={styles.detailItemWrapper}>
          <Text style={styles.detailLabel}>Username:</Text>
          <Text style={styles.detailItem}>{user?.username}</Text>
        </View>
        <View style={styles.detailItemWrapper}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailItem}>{user?.email}</Text>
        </View>

        <Text style={styles.sectionTitle}>Courses Enrolled</Text>
        {user?.courses && user.courses.length > 0 ? (
          user.courses.map((course: any) => (
            <View key={course._id} style={styles.courseCard}>
              <Text style={styles.courseName}>Course: {course.typeOfClass}</Text>
              <Text style={styles.courseDetail}>Location: {course.location}</Text>
              <Text style={styles.courseDetail}>
                Price per Class: ${course.pricePerClass}
              </Text>
              <Text style={styles.courseDetail}>Type: {course.typeOfClass}</Text>
              {course.class && course.class.length > 0 && (
                <View style={styles.classList}>
                  <Text style={styles.classTitle}>Classes:</Text>
                  {course.class.map((classItem: any) => (
                    <View key={classItem._id} style={styles.classCard}>
                      <Text style={styles.classDetail}>
                        Class Name: {classItem.className}
                      </Text>
                      <Text style={styles.classDetail}>
                        Teacher: {classItem.teacher}
                      </Text>
                      <Text style={styles.classDetail}>
                        Date: {formatDateTime(classItem.date)}
                      </Text>
                      <Text style={styles.classDetail}>
                        Duration: {classItem.duration} mins
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noCourses}>No courses enrolled</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerBackground: {
    width: "100%",
    height: 300,
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  header: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingVertical: 30,
  },
  imageContainer: {
    borderWidth: 3,
    borderColor: "transparent",
    borderRadius: 70,
    overflow: "hidden",
    padding: 3,
    backgroundColor: "#ffffff",
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  username: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 10,
    marginBottom: 20,
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  detailItemWrapper: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    width: 100,
  },
  detailItem: {
    fontSize: 16,
    color: "#777",
  },
  courseCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  courseName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1c2f28",
  },
  courseDetail: {
    fontSize: 16,
    color: "#777",
    marginTop: 5,
  },
  classList: {
    marginTop: 10,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e90ff",
    marginBottom: 5,
  },
  classCard: {
    backgroundColor: "#f4f4f8",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  classDetail: {
    fontSize: 15,
    color: "#555",
  },
  noCourses: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
});

export default ProfileScreen;