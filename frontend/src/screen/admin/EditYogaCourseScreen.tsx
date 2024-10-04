import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import YogaCourseEdit from '../../components/admin/YogaCourseEdit'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { YogaCourse } from '../../../types'; 
import axios from 'axios';

type EditYogaCourseScreenNavigationProp = StackNavigationProp<{
    'YogaCourses': undefined;
}>;

type EditYogaCourseScreenRouteProp = RouteProp<{
    'Edit YogaCourse': { courseId: string };
}, 'Edit YogaCourse'>;

type Props = {
    navigation: EditYogaCourseScreenNavigationProp;
    route: EditYogaCourseScreenRouteProp; 
};

const EditYogaCourseScreen: React.FC<Props> = ({ navigation, route }) => {
    const [course, setCourse] = useState<YogaCourse | null>(null);

    useEffect(() => {
        const fetchCourse = async () => {
            const response = await axios.get(`http://192.168.1.14:5000/api/admin/courses/${route.params.courseId}`);
            setCourse(response.data);
        };
        fetchCourse();
    }, [route.params.courseId]);

    const handleEditYogaCourse = async (updatedCourse: Omit<YogaCourse, '_id'>) => {
        try {
            await axios.put(`http://192.168.1.14:5000/api/admin/courses/${route.params.courseId}`, updatedCourse);
            navigation.navigate('YogaCourses');
        } catch (error) {
            console.error('Failed to update yoga course:', error);
        }
    };

    return (
        <View>
            {course && <YogaCourseEdit course={course} onSubmit={handleEditYogaCourse} />}
        </View>
    );
};

export default EditYogaCourseScreen;
