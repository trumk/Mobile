import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Navbar from '../../components/Navbar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';
import { fetchCourses } from '../apiRequest';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [topCourses, setTopCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTopCourses = async () => {
            try {
                const courses = await fetchCourses();
                const sortedCourses = courses
                    .sort((a: any, b: any) => b.participantCount - a.participantCount)
                    .slice(0, 3);

                setTopCourses(sortedCourses);
            } catch (error) {
                console.error('Error fetching top courses:', error);
            } finally {
                setLoading(false);
            }
        };

        loadTopCourses();
    }, []);

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

                <View style={styles.coursesSection}>
                    <Text style={styles.sectionTitle}>Top Popular Courses</Text>
                    {loading ? (
                        <ActivityIndicator size="large" color="#4CAF50" style={styles.loadingIndicator} />
                    ) : (
                        topCourses.map((course) => (
                            <View key={course._id} style={styles.courseWrapper}>
                                <Image source={{ uri: "https://placehold.co/100x100" }} style={styles.courseImage} />
                                <View style={styles.courseDetails}>
                                    <Text style={styles.courseTitle}>Day: {course.dayOfWeek}</Text>
                                    <Text style={styles.courseDetail}>Location: {course.location}</Text>
                                    <Text style={styles.courseDetail}>Participants: {course.participantCount}</Text>
                                    <TouchableOpacity style={styles.courseButton} onPress={() => navigation.navigate('Detail Course', { courseId: course._id })}>
                                        <Text style={styles.courseButtonText}>View Details</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    headerImage: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
        marginBottom: 20,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#3C3A36',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#606060',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    exploreButton: {
        marginTop: 20,
        backgroundColor: '#1b9cbd',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 30,
        shadowColor: '#054a54',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    coursesSection: {
        marginTop: 30,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    loadingIndicator: {
        marginVertical: 20,
    },
    courseWrapper: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    courseImage: {
        width: 90,
        height: 90,
        borderRadius: 12,
        marginRight: 15,
    },
    courseDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    courseTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2A2A2A',
        marginBottom: 5,
    },
    courseDetail: {
        fontSize: 14,
        color: '#606060',
        marginBottom: 3,
    },
    courseButton: {
        backgroundColor: '#1E88E5',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    courseButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default HomeScreen;