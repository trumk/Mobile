import React from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import LoginForm from '../components/auth/LoginForm';

type RootStackParamList = {
    Home: undefined;
    YogaCourses: undefined;
};

interface LoginScreenProps {
    navigation: StackNavigationProp<RootStackParamList, any>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const handleLoginSuccess = (role: string) => {
        if (role === 'admin') {
            navigation.navigate('YogaCourses'); 
        } else if (role === 'customer') {
            navigation.navigate('Home'); 
        } else {
            Alert.alert('Login Error', 'Invalid user role');
        }
    };

    return (
        <View style={styles.container}>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
});

export default LoginScreen;
