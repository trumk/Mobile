import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import YogaCourseList from '../../components/YogaCourseList';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { YogaCourse } from '../../../types';
import axios from 'axios';

type RootStackParamList = {
    'Edit YogaCourse': { courseId: string; onEditSuccess: () => void }; 
    'Detail YogaCourse': { courseId: string };
};

type YogaCourseListScreenProps = {
    navigation: StackNavigationProp<RootStackParamList>;
};

const YogaCourseListScreen: React.FC<YogaCourseListScreenProps> = ({ navigation }) => {
    const [courses, setCourses] = useState<YogaCourse[]>([]);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://192.168.1.14:5000/api/admin/courses');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching yoga courses:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCourses();
        }, [])
    );

    const handleEditSuccess = () => {
        fetchCourses(); 
    };

    return (
        <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Yoga Course List</Text>
            <YogaCourseList courses={courses} navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f4f8',
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default YogaCourseListScreen;
