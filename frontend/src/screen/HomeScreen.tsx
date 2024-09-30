import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type HomeScreenProps = {
    navigation: StackNavigationProp<any>;
    route: RouteProp<any, any>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Hike App</Text>
            <Text style={styles.subtitle}>Your adventure begins here!</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Hikes')}>
                <Text style={styles.buttonText}>View Hikes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Add Hike')}>
                <Text style={styles.buttonText}>Add New Hike</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f4f8', 
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2C3E50', 
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#34495E', 
        marginBottom: 30,
        textAlign: 'center', 
    },
    button: {
        backgroundColor: '#1E5B75', 
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginVertical: 10,
        elevation: 3, 
        width: '100%', 
    },
    buttonText: {
        color: '#ffffff', 
        fontSize: 16,
        textAlign: 'center', 
    },
});

export default HomeScreen;
