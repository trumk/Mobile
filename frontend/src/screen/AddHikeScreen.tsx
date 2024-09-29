// AddHikeScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import HikeForm from '../components/HikeForm';
import { StackNavigationProp } from '@react-navigation/stack';
import { Hike } from '../../type';

type AddHikeScreenNavigationProp = StackNavigationProp<{
    'Hike List': undefined;
}>;

type Props = {
    navigation: AddHikeScreenNavigationProp;
};

const AddHikeScreen: React.FC<Props> = ({ navigation }) => {
    const handleAddHike = async (hike: Omit<Hike, '_id'>) => {
        // Gọi API để thêm hike
        // ...
        navigation.navigate('Hike List'); // Chuyển đến màn hình danh sách hike
    };

    return (
        <View>
            <Text>Add Hike</Text>
            <HikeForm onSubmit={handleAddHike} />
        </View>
    );
};

export default AddHikeScreen;
