import React from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import LoginForm from '../components/auth/LoginForm';

type RootStackParamList = {
    Home: undefined;
    "Admin Homepage": undefined;
    Register: undefined;
};

interface LoginScreenProps {
    navigation: StackNavigationProp<RootStackParamList, any>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const handleLoginSuccess = (role: string) => {
        if (role === 'admin') {
            navigation.navigate('Admin Homepage');
        } else {
            navigation.navigate('Home');
        }
    };

    const handleRegisterNavigate = () => {
        navigation.navigate('Register'); 
    };

    return (
        <View style={{ flex: 1 }}>
            <LoginForm onLoginSuccess={handleLoginSuccess} onRegisterNavigate={handleRegisterNavigate} />
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
