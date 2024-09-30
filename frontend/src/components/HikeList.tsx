// components/HikeList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';

type Hike = {
    _id: string;
    name: string;
};

type RootStackParamList = {
    'Detail Hike': { hikeId: string };
};

type HikeListProps = {
    hikes: Hike[]; 
    navigation: any; 
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
        <View style={styles.container}>
            <FlatList
                data={hikes}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.hikeCard}>
                        <Text style={styles.hikeName}>{item.name}</Text>
                        <TouchableOpacity 
                            style={styles.detailButton} 
                            onPress={() => navigation.navigate('Detail Hike', { hikeId: item._id })}
                        >
                            <Text style={styles.detailButtonText}>Detail</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f4f8',
    },
    hikeCard: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    hikeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    detailButton: {
        backgroundColor: '#2a7183', // Màu khác cho nút "Detail"
        paddingVertical: 10,
        borderRadius: 5,
        width: '100%', // Đặt chiều rộng là 100%
        alignItems: 'center', // Căn giữa nội dung trong nút
    },
    detailButtonText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default HikeList;
