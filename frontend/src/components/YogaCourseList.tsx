import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

type YogaCourse = {
    _id: string;
    classType: string; 
};

type RootStackParamList = {
    'Detail YogaCourse': { courseId: string }; 
};

type YogaCourseListProps = {
    courses: YogaCourse[]; 
    navigation: any; 
};

const YogaCourseList: React.FC<YogaCourseListProps> = ({ navigation }) => {
    const [courses, setCourses] = useState<YogaCourse[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            const response = await axios.get('http://192.168.1.14:5000/api/courses'); 
            setCourses(response.data);
        };
        fetchCourses();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={courses}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.courseCard}>
                        <Text style={styles.courseType}>{item.classType}</Text> 
                        <TouchableOpacity 
                            style={styles.detailButton} 
                            onPress={() => navigation.navigate('Detail YogaCourse', { courseId: item._id })} 
                        >
                            <Text style={styles.detailButtonText}>Detail</Text>
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
        width: '100%', 
        alignItems: 'center', 
    },
    detailButtonText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default YogaCourseList;
