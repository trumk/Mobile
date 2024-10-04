import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Navbar from '../../components/Navbar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();

    const handleLinkPress = (link: string) => {
        if (link === 'Login') {
            navigation.navigate('Login'); 
        } else if (link === 'Profile') {
            navigation.navigate('Profile'); 
        } else {
            console.log(`${link} link pressed`); 
        }
    };

    return (
        <View style={styles.container}>
            <Navbar username="CustomerUsername" onLinkPress={handleLinkPress} />

            <View style={styles.content}>
                <Text style={styles.welcomeText}>Welcome to the Customer Home Screen</Text>
                <Text style={styles.description}>
                    Here you can explore the yoga courses, contact us, and more.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default HomeScreen;
