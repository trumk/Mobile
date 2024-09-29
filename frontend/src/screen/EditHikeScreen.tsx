// EditHikeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import HikeForm from '../components/HikeForm';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Hike } from '../../type';
import axios from 'axios';

type EditHikeScreenNavigationProp = StackNavigationProp<{
    'Hike List': undefined;
}>;

type EditHikeScreenRouteProp = RouteProp<{
    'Edit Hike': { hikeId: string };
}, 'Edit Hike'>;

type Props = {
    navigation: EditHikeScreenNavigationProp;
    route: EditHikeScreenRouteProp; // Thêm kiểu cho route
};

const EditHikeScreen: React.FC<Props> = ({ navigation, route }) => {
    const [hike, setHike] = useState<Hike | null>(null);

    useEffect(() => {
        const fetchHike = async () => {
            const response = await axios.get(`http://192.168.1.14:5000/api/hikes/${route.params.hikeId}`);
            setHike(response.data);
        };
        fetchHike();
    }, [route.params.hikeId]);

    const handleEditHike = async (updatedHike: Omit<Hike, '_id'>) => {
        // Gọi API để cập nhật hike
        // ...
        navigation.navigate('Hike List');
    };

    return (
        <View>
            <Text>Edit Hike</Text>
            {hike && <HikeForm hike={hike} onSubmit={handleEditHike} />}
        </View>
    );
};

export default EditHikeScreen;
