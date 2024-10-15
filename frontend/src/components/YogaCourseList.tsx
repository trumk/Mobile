import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchUserDetails } from '../screen/apiRequest'; 
import { RootStackParamList } from '../../App'; 

type YogaCourse = {
    _id: string;
    classType: string;
    teacherName: string;
    dayOfWeek: string;
    courseTime: string;
    location: string;
    duration: number;
};

type YogaCourseListProps = {
    courses: YogaCourse[];
    navigation: StackNavigationProp<RootStackParamList, 'Detail YogaCourse' | 'Detail Course'>;
};

const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
};

const YogaCourseList: React.FC<YogaCourseListProps> = ({ courses, navigation }) => {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const user = await fetchUserDetails(); 
                setRole(user.role); 
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        getUserDetails();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={courses}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.courseCard}>
                        <Text style={styles.courseType}>
                            {item.classType} - {item.teacherName}
                        </Text>
                        <Text>Day: {item.dayOfWeek}</Text>
                        <Text>
                            Time: {item.courseTime ? formatDateTime(item.courseTime) : 'N/A'}
                        </Text>
                        <Text>Location: {item.location}</Text>
                        <Text>Duration: {item.duration} minutes</Text>
                        <TouchableOpacity
                            style={styles.detailButton}
                            onPress={() => {
                                if (role === 'admin') {
                                    navigation.navigate('Detail YogaCourse', { courseId: item._id });
                                } else if (role === 'customer') {
                                    navigation.navigate('Detail Course', { courseId: item._id });
                                }
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
        backgroundColor: '#f0f4f8',
    },
    courseCard: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    courseType: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    detailButton: {
        backgroundColor: '#2a7183',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    detailButtonText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default YogaCourseList;
