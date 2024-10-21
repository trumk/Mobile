import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import YogaCourseList from '../../components/YogaCourseList';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { YogaCourse } from '../../../types';
import { fetchCourses, filterYogaCourses } from '../apiRequest';
import { RootStackParamList } from '../../../App';
import Filter from '../../components/Filter';

type CourseListProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Detail Course'>;
};

const CourseList: React.FC<CourseListProps> = ({ navigation }) => {
    const [courses, setCourses] = useState<YogaCourse[]>([]);

    const loadCourses = async () => {
        try {
            const data = await fetchCourses();
            setCourses(data);
        } catch (error) {
            console.error('Error fetching yoga courses:', error);
        }
    };

    const handleFilter = async (dayOfWeek: string) => {
        try {
            if (dayOfWeek === '') {
                // Nếu dayOfWeek là chuỗi rỗng, tải lại tất cả các khóa học
                await loadCourses();
            } else {
                console.log('Filtering by dayOfWeek:', dayOfWeek);
                const data = await filterYogaCourses(dayOfWeek);
                console.log('Filtered data:', data);
                setCourses(data);
            }
        } catch (error) {
            console.error('Failed to filter courses:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadCourses();
        }, [])
    );

    return (
        <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Yoga Course List</Text>
            <Filter onFilter={handleFilter} />
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

export default CourseList;
