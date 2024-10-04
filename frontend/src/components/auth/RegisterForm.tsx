import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';

interface RegisterFormProps {
    onRegisterSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>(''); 
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>(''); 
    const [showPassword, setShowPassword] = useState<boolean>(false); 
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false); 

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            await axios.post('http://192.168.1.14:5000/api/auth/register', {
                username,
                email,
                password,
            });
            Alert.alert('Success', 'User registered successfully');
            onRegisterSuccess();
        } catch (error) {
            Alert.alert('Registration Error', 'Error registering user');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>

            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="#666"
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholderTextColor="#666"
            />

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.inputPassword}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword} 
                    placeholderTextColor="#666"
                />
                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
            </View>

        <View style={[styles.passwordContainer, styles.marginTop]}>
                <TextInput
                    style={styles.inputPassword}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword} 
                    placeholderTextColor="#666"
                />
                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    <Text style={styles.toggleText}>{showConfirmPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 24,
    },
    input: {
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 12,
        fontSize: 16,
        color: '#333',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputPassword: {
        flex: 1,
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#333',
    },
    toggleButton: {
        padding: 10,
    },
    toggleText: {
        color: '#1e90ff',
        fontWeight: 'bold',
    },
    registerButton: {
        backgroundColor: '#1e90ff',
        borderRadius: 8,
        paddingVertical: 15,
        marginTop: 20,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    marginTop:{
        marginTop: 10
    }
});

export default RegisterForm;
