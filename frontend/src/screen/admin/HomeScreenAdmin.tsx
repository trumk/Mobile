import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { fetchUsers, fetchCourses } from '../apiRequest'; 

type HomeScreenProps = {
    navigation: StackNavigationProp<any>;
    route: RouteProp<any, any>;
};

const HomeScreenAdmin: React.FC<HomeScreenProps> = ({ navigation }) => {
    const [usersCount, setUsersCount] = useState<number | null>(null);
    const [coursesCount, setCoursesCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const usersResponse = await fetchUsers(); 
            const coursesResponse = await fetchCourses(); 

            setUsersCount(usersResponse.length);
            setCoursesCount(coursesResponse.length);
            setError(null);
        } catch (err) {
            setError('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                <TouchableOpacity style={styles.refreshButton} onPress={fetchData}>
                    <Text style={styles.buttonText}>Refresh</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Dashboard</Text>
            <Text style={styles.subtitle}>Manage yoga courses and users</Text>

            <View style={styles.infoContainer}>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>Total Users</Text>
                    <Text style={styles.infoNumber}>{usersCount}</Text>
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>Total Courses</Text>
                    <Text style={styles.infoNumber}>{coursesCount}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.refreshButton} onPress={fetchData}>
                <Text style={styles.buttonText}>Refresh Data</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('YogaCourses')}>
                <Text style={styles.buttonText}>View Yoga Courses</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Add YogaCourse')}>
                <Text style={styles.buttonText}>Add New Yoga Course</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f4f8', 
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2C3E50', 
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        color: '#34495E', 
        marginBottom: 40,
        textAlign: 'center', 
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        width: '100%',
    },
    infoBox: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 30,
        elevation: 2,
        width: '45%',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 16,
        color: '#2C3E50',
        marginBottom: 5,
    },
    infoNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E5B75',
    },
    button: {
        backgroundColor: '#1E5B75', 
        paddingVertical: 15,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginVertical: 10,
        elevation: 3, 
        width: '100%', 
    },
    refreshButton: {
        backgroundColor: '#2980b9', 
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginVertical: 10,
        elevation: 3, 
        width: '100%', 
    },
    buttonText: {
        color: '#ffffff', 
        fontSize: 16,
        textAlign: 'center', 
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
});

export default HomeScreenAdmin;
