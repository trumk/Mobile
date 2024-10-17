import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
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
        <ScrollView style={styles.container}>
            <Navbar username="CustomerUsername" onLinkPress={handleLinkPress} />
            {/* Ảnh lớn đầu trang */}
            <Image
                source={{ uri: "https://cdn.pixabay.com/photo/2022/03/01/18/11/woman-7041806_960_720.jpg" }}  
                style={styles.headerImage}
            />

            <View style={styles.content}>
                <Text style={styles.welcomeText}>Welcome to Yoga Mastery</Text>
                <Text style={styles.description}>
                    Your journey to a peaceful mind and body starts here. Explore our yoga courses and join us today.
                </Text>
                <TouchableOpacity style={styles.exploreButton} onPress={() => navigation.navigate('Courses')}>
                    <Text style={styles.buttonText}>Explore Courses</Text>
                </TouchableOpacity>

                {/* Phần các loại yoga */}
                <View style={styles.coursesSection}>
                    <Text style={styles.sectionTitle}>Our Yoga Courses</Text>
                    
                    {/* Family Yoga */}
                    <Text style={styles.courseTitle}>Family Yoga</Text>
                    <View style={styles.courseWrapper}>
                        <Image source={{ uri: "https://aeliawellness.com.cy/wp-content/uploads/2019/11/1200-478618627-family-meditating-together-1024x683.jpg" }} style={styles.courseImage} />
                        <TouchableOpacity style={styles.courseButton} onPress={() => navigation.navigate('Courses')}>
                            <Text style={styles.courseButtonText}>Learn More</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Aerial Yoga */}
                    <Text style={styles.courseTitle}>Aerial Yoga</Text>
                    <View style={styles.courseWrapper}>
                        <Image source={{ uri: "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/aerial_yoga_la_gi_nhung_loi_ich_cua_bo_mon_nay_doi_voi_suc_khoe_cbddcd4aa1.jpg" }} style={styles.courseImage} />
                        <TouchableOpacity style={styles.courseButton} onPress={() => navigation.navigate('Courses')}>
                            <Text style={styles.courseButtonText}>Learn More</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Power Yoga */}
                    <Text style={styles.courseTitle}>Power Yoga</Text>
                    <View style={styles.courseWrapper}>
                        <Image source={{ uri: "https://fitcenter.vn/wp-content/uploads/2023/07/Power-yoga-la-gi.jpg" }} style={styles.courseImage} />
                        <TouchableOpacity style={styles.courseButton} onPress={() => navigation.navigate('Courses')}>
                            <Text style={styles.courseButtonText}>Learn More</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    headerImage: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e90ff',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
    },
    exploreButton: {
        marginTop: 20,
        backgroundColor: '#1e90ff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    coursesSection: {
        marginTop: 30,
        width: '100%',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    courseTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e90ff',
        marginBottom: 10,
        textAlign: 'center',
    },
    courseWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    courseImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    courseButton: {
        backgroundColor: '#1e90ff',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    courseButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
