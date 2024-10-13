import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { login } from '../../screen/apiRequest'; 

interface LoginFormProps {
    onLoginSuccess: (role: string) => void;
    onRegisterNavigate: () => void; 
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onRegisterNavigate }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false); 

    const handleLogin = async () => {
        try {
            const response = await login(username, password); 
            if (response.role === 'admin') {
                onLoginSuccess('admin');
            } else {
                onLoginSuccess('customer');
            }
        } catch (error) {
            Alert.alert('Login Error', 'Invalid username or password');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Username or Email"
                value={username}
                onChangeText={setUsername}
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
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerLink} onPress={onRegisterNavigate}>
                <Text style={styles.registerText}>
                    Do not have an account? <Text style={styles.registerTextBold}>Register here!</Text>
                </Text>
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
    loginButton: {
        backgroundColor: '#1e90ff',
        borderRadius: 8,
        paddingVertical: 15,
        marginTop: 20,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    registerLink: {
        marginTop: 20,
        alignItems: 'center',
    },
    registerText: {
        fontSize: 14,
        color: '#555',
    },
    registerTextBold: {
        fontWeight: 'bold',
        color: '#1e90ff',
    },
});

export default LoginForm;
