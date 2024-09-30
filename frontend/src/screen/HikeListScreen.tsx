// HikeListScreen.tsx
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HikeList from '../components/HikeList';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native'; 
import { Hike } from '../../type'; 
import axios from 'axios';

type RootStackParamList = {
    'Edit Hike': { hikeId: string; onEditSuccess: () => void }; // Thêm callback vào route params
    'Detail Hike': { hikeId: string };
};

type HikeListScreenProps = {
    navigation: StackNavigationProp<RootStackParamList>;
};

const HikeListScreen: React.FC<HikeListScreenProps> = ({ navigation }) => {
    const [hikes, setHikes] = useState<Hike[]>([]);

    const fetchHikes = async () => {
        try {
            const response = await axios.get('http://192.168.1.14:5000/api/hikes');
            setHikes(response.data);
        } catch (error) {
            console.error('Error fetching hikes:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchHikes();
        }, [])
    );

    const handleEditSuccess = () => {
        fetchHikes(); // Reload hikes sau khi edit thành công
    };

    return (
        <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Hike List</Text>
            <HikeList hikes={hikes} navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f4f8',
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default HikeListScreen;
