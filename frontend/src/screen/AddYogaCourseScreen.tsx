import React from 'react';
import { View } from 'react-native';
import YogaCourseForm from '../components/YogaCourseForm'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { YogaCourse } from '../../types'; 
import axios from 'axios';

type AddYogaCourseScreenNavigationProp = StackNavigationProp<{
    'YogaCourses': undefined; 
}>;

type Props = {
    navigation: AddYogaCourseScreenNavigationProp;
};

const AddYogaCourseScreen: React.FC<Props> = ({ navigation }) => {
    const handleAddYogaCourse = async (course: Omit<YogaCourse, '_id'>) => {
        try {
            const response = await axios.post('http://192.168.1.10:5000/api/courses', course); 
            console.log('Yoga Course added:', response.data);
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
