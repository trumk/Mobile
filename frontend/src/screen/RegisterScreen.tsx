import React from 'react';
import { View, StyleSheet } from 'react-native';
import RegisterForm from '../components/auth/RegisterForm';
import { StackNavigationProp } from '@react-navigation/stack';

interface RegisterScreenProps {
    navigation: StackNavigationProp<any, any>;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
    const handleRegisterSuccess = () => {
        navigation.navigate('Login'); 
    };

    return (
        <View style={styles.container}>
            <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default RegisterScreen;
