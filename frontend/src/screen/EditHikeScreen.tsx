    // EditHikeScreen.tsx
    import React, { useEffect, useState } from 'react';
    import { View, Text } from 'react-native';
    import HikeForm from '../components/HikeForm';
    import { StackNavigationProp } from '@react-navigation/stack';
    import { RouteProp } from '@react-navigation/native';
    import { Hike } from '../../type';
    import axios from 'axios';
import HikeEdit from '../components/HikeEdit';

    type EditHikeScreenNavigationProp = StackNavigationProp<{
        'Hikes': undefined;
    }>;

    type EditHikeScreenRouteProp = RouteProp<{
        'Edit Hike': { hikeId: string };
    }, 'Edit Hike'>;

    type Props = {
        navigation: EditHikeScreenNavigationProp;
        route: EditHikeScreenRouteProp; 
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
            try {
                // Gọi API PUT để cập nhật dữ liệu hike
                await axios.put(`http://192.168.1.14:5000/api/hikes/${route.params.hikeId}`, updatedHike);
                
                // Sau khi cập nhật thành công, điều hướng về màn hình 'Hikes'
                navigation.navigate('Hikes');
            } catch (error) {
                console.error('Failed to update hike:', error);
            }
        };
        

        return (
            <View>
                {hike && <HikeEdit hike={hike} onSubmit={handleEditHike} />}
            </View>
        );
    };

    export default EditHikeScreen;
