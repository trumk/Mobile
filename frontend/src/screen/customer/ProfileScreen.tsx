import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';

const ProfileScreen: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get('http://192.168.1.14:5000/api/auth/user'); 
                setUser(response.data.user);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user details:', error);
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1e90ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: 'https://example.com/profile-pic-url' }} 
                    style={styles.profileImage}
                />
                <Text style={styles.username}>{user?.username}</Text>
                <Text style={styles.email}>{user?.email}</Text>
            </View>

            <View style={styles.body}>
                <Text style={styles.sectionTitle}>Profile Details</Text>
                <Text style={styles.detailItem}>Username: {user?.username}</Text>
                <Text style={styles.detailItem}>Email: {user?.email}</Text>
                <Text style={styles.detailItem}>Role: {user?.role}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#1e90ff',
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    email: {
        fontSize: 16,
        color: '#fff',
    },
    body: {
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    detailItem: {
        fontSize: 16,
        marginBottom: 10,
        color: '#666',
    },
});

export default ProfileScreen;
