// screens/DetailHikeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    'Detail Hike': { hikeId: string };
    'Edit Hike': { hikeId: string };
};

type DetailHikeScreenProps = {
    route: RouteProp<RootStackParamList, 'Detail Hike'>;
    navigation: StackNavigationProp<RootStackParamList>;
};

const DetailHikeScreen: React.FC<DetailHikeScreenProps> = ({ route, navigation }) => {
    const { hikeId } = route.params;
    const [hike, setHike] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHikeDetail = async () => {
            try {
                const response = await axios.get(`http://192.168.1.14:5000/api/hikes/${hikeId}`);
                setHike(response.data);
            } catch (err) {
                setError('Could not fetch hike details.');
            } finally {
                setLoading(false);
            }
        };
        fetchHikeDetail();
    }, [hikeId]);

    const formatDate = (isoString: string) => {
        return isoString.split('T')[0]; 
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://192.168.1.14:5000/api/hikes/${hikeId}`);
            Alert.alert('Success', 'Hike deleted successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (err) {
            Alert.alert('Error', 'Could not delete hike');
        }
    };

    const confirmDelete = () => {
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this hike?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'OK', onPress: handleDelete },
        ]);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#1E5B75" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{hike.name || 'No Name Available'}</Text>
            <Text style={styles.details}>Location: {hike.location || 'N/A'}</Text>
            <Text style={styles.details}>End Location: {hike.locationEnd || 'N/A'}</Text>
            <Text style={styles.details}>Date: {formatDate(hike.date) || 'N/A'}</Text>
            <Text style={styles.details}>Parking Available: {hike.parkingAvailable ? 'Yes' : 'No'}</Text>
            <Text style={styles.details}>Length: {hike.length || 'N/A'} km</Text>
            <Text style={styles.details}>Difficulty: {hike.difficulty || 'N/A'}</Text>
            <Text style={styles.details}>Weather: {hike.weather || 'N/A'}</Text>
            <Text style={styles.details}>Description: {hike.description || 'No Description Available'}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[styles.button, styles.editButton]} 
                    onPress={() => navigation.navigate('Edit Hike', { hikeId })}
                >
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, styles.deleteButton]} 
                    onPress={confirmDelete}
                >
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f4f8',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E5B75',
        marginBottom: 20,
    },
    details: {
        fontSize: 16,
        marginBottom: 10,
        color: '#34495E',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        width: '48%',
    },
    editButton: {
        backgroundColor: '#1E5B75',
    },
    deleteButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default DetailHikeScreen;
