import React from 'react';
import { View } from 'react-native';
import YogaCourseForm from '../../components/admin/YogaCourseForm'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { YogaCourse } from '../../../types';
import { addYogaCourse } from '../apiRequest';

type AddYogaCourseScreenNavigationProp = StackNavigationProp<{
    'YogaCourses': undefined;
}>;

type Props = {
    navigation: AddYogaCourseScreenNavigationProp;
};

const AddYogaCourseScreen: React.FC<Props> = ({ navigation }) => {
    const handleAddYogaCourse = async (course: Omit<YogaCourse, '_id'>) => {
        try {
            const response = await addYogaCourse(course);
            console.log('Yoga Course added:', response);
            navigation.navigate('YogaCourses');
        } catch (error) {
            console.error('Error adding yoga course:', error);
        }
    };

    return (
        <View>
            <YogaCourseForm onSubmit={handleAddYogaCourse} />
        </View>
    );
};

export default AddYogaCourseScreen;
