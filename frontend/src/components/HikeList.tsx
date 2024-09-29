// components/HikeList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';

type Hike = {
    _id: string;
    name: string;
};

type HikeListProps = {
    navigation: StackNavigationProp<{
        'Edit Hike': { hikeId: string };
    }>;
};

const HikeList: React.FC<HikeListProps> = ({ navigation }) => {
    const [hikes, setHikes] = useState<Hike[]>([]);

    useEffect(() => {
        const fetchHikes = async () => {
            const response = await axios.get('http://192.168.1.14:5000/api/hikes');
            setHikes(response.data);
        };
        fetchHikes();
    }, []);

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <FlatList
                data={hikes}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={{ marginBottom: 15 }}>
                        <Text>{item.name}</Text>
                        <Button title="Edit" onPress={() => navigation.navigate('Edit Hike', { hikeId: item._id })} />
                    </View>
                )}
            />
        </View>
    );
};

export default HikeList;
