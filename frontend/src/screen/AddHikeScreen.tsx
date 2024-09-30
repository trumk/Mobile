import React from 'react';
import { View, Text } from 'react-native';
import HikeForm from '../components/HikeForm';
import { StackNavigationProp } from '@react-navigation/stack';
import { Hike } from '../../type';
import axios from 'axios';

type AddHikeScreenNavigationProp = StackNavigationProp<{
    'Hikes': undefined; 
}>;

type Props = {
    navigation: AddHikeScreenNavigationProp;
};

const AddHikeScreen: React.FC<Props> = ({ navigation }) => {
    const handleAddHike = async (hike: Omit<Hike, '_id'>) => {
        try {
            const response = await axios.post('http://192.168.1.14:5000/api/hikes', hike);
            console.log('Hike added:', response.data);
            navigation.navigate('Hikes');
        } catch (error) {
            console.error('Error adding hike:', error);
        }
    };

    return (
        <View>
            <HikeForm onSubmit={handleAddHike} />
        </View>
    );
};

export default AddHikeScreen;
