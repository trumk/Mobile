import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import YogaCourseEdit from '../../components/admin/YogaCourseEdit'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { YogaCourse } from '../../../types';
import { fetchCourseDetails, updateYogaCourse } from '../apiRequest'; 

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
            try {
                const data = await fetchCourseDetails(route.params.courseId);
                setCourse(data);
            } catch (error) {
                console.error('Failed to fetch course details:', error);
            }
        };
        fetchCourse();
    }, [route.params.courseId]);

    const handleEditYogaCourse = async (updatedCourse: Omit<YogaCourse, '_id'>) => {
        try {
            await updateYogaCourse(route.params.courseId, updatedCourse); 
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
