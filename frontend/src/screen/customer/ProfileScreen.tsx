import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { fetchUserDetails } from '../apiRequest'; 

const ProfileScreen: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const fetchedUser = await fetchUserDetails();
                setUser(fetchedUser);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user details:', error);
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: 'https://example.com/profile-pic-url' }} 
                    style={styles.profileImage}
                />
                <Text style={styles.username}>{user?.username}</Text>
                <Text style={styles.email}>{user?.email}</Text>
            </View>

            <View style={styles.body}>
                <Text style={styles.sectionTitle}>Profile Details</Text>
                <Text style={styles.detailItem}>Username: {user?.username}</Text>
                <Text style={styles.detailItem}>Email: {user?.email}</Text>
                <Text style={styles.detailItem}>Role: {user?.role}</Text>

                <Text style={styles.sectionTitle}>Courses</Text>
                {user?.courses && user.courses.length > 0 ? (
                    user.courses.map((course: any) => (
                        <View key={course._id} style={styles.courseItem}>
                            <Text style={styles.courseName}>- {course.classType}</Text><Text>by {course.teacherName}</Text>   
                        </View>
                    ))
                ) : (
                    <Text style={styles.detailItem}>No courses enrolled</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#1e90ff',
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    email: {
        fontSize: 16,
        color: '#fff',
    },
    body: {
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    detailItem: {
        fontSize: 16,
        marginBottom: 10,
        color: '#666',
    },
    courseItem: {
        marginBottom: 10,
    },
    courseName: {
        fontSize: 16,
        color: '#333',
    },
});

export default ProfileScreen;
