import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';

interface NavbarProps {
    username: string;
    onLinkPress: (link: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLinkPress }) => {
    const [username, setUsername] = useState<string>('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://192.168.1.10:5000/api/auth/user');
                setUsername(response.data.user.username);
            } catch (error) {
                console.error('Error fetching user', error);
            }
        };

        fetchUser();
    }, []);

    return (
        <View style={styles.navbar}>
            <View style={styles.logoContainer}>
                <Image
                    source={{ uri: 'https://png.pngtree.com/template/20190313/ourmid/pngtree-yoga-lifestyle-logo-image_66792.jpg' }} 
                    style={styles.logo}
                />
            </View>

            <View style={styles.linksContainer}>
                <TouchableOpacity onPress={() => onLinkPress('Home')}>
                    <Text style={styles.link}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onLinkPress('YogaCourses')}>
                    <Text style={styles.link}>Courses</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onLinkPress('Search')}>
                    <Text style={styles.link}>Search</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.usernameContainer}>
                <Text style={styles.username}>{username}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10, 
        paddingHorizontal: 15, 
        backgroundColor: '#1e90ff',
        elevation: 4,
    },
    logoContainer: {
        flex: 1,
    },
    logo: {
        width: 45, 
        height: 45,
        resizeMode: 'contain',
    },
    linksContainer: {
        flex: 3, 
        flexDirection: 'row',
        justifyContent: 'space-around', 
    },
    link: {
        color: '#fff',
        fontSize: 14, 
        fontWeight: 'bold',
        marginHorizontal: 10, 
    },
    usernameContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    username: {
        color: '#ff0000',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default Navbar;
