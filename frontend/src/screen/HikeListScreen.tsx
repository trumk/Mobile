import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { Hike } from '../../type';

type HikeListScreenNavigationProp = StackNavigationProp<{
    'Edit Hike': { hikeId: string };
}>;

type Props = {
    navigation: HikeListScreenNavigationProp;
};

const HikeListScreen: React.FC<Props> = ({ navigation }) => {
    const [hikes, setHikes] = useState<Hike[]>([]);

    useEffect(() => {
        const fetchHikes = async () => {
            try {
                const response = await axios.get('http://192.168.1.14:5000/api/hikes');
                console.log(response.data); // Kiểm tra dữ liệu
                setHikes(response.data);
            } catch (error) {
                console.error('Error fetching hikes:', error); // Xử lý lỗi
            }
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
                        <Button
                            title="Edit"
                            onPress={() => {
                                console.log(`Navigating to edit hike with ID: ${item._id}`);
                                navigation.navigate('Edit Hike', { hikeId: item._id });
                            }}
                        />
                    </View>
                )}
            />
        </View>
    );
};

export default HikeListScreen;
