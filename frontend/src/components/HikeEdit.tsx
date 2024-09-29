// HikeEdit.tsx
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';
import HikeForm from './HikeForm';
import { Hike } from '../../type';

type HikeEditProps = {
    route: { params: { hikeId: string } };
};

const HikeEdit: React.FC<HikeEditProps> = ({ route }) => {
    const [hike, setHike] = React.useState<Hike | null>(null);

    useEffect(() => {
        const fetchHike = async () => {
            const response = await axios.get(`http://192.168.1.14:5000/api/hikes/${route.params.hikeId}`);
            setHike(response.data);
        };

        fetchHike();
    }, [route.params.hikeId]);

    const handleUpdate = async (updatedHike: Omit<Hike, '_id'>) => {
        await axios.put(`http://192.168.1.14:5000/api/hikes/${route.params.hikeId}`, updatedHike);
        // Xử lý sau khi cập nhật thành công, có thể điều hướng về HikeList
    };

    return (
        <View>
            {hike ? (
                <HikeForm hike={hike} onSubmit={handleUpdate} />
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
};

export default HikeEdit;
