import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type YogaCourse = {
    _id: string;
    classType: string;
    teacherName: string;
    dayOfWeek: string;
    courseTime: string;
    location: string;
    duration: number;
};

type RootStackParamList = {
    'Detail YogaCourse': { courseId: string };
    'Edit YogaCourse': { courseId: string; onEditSuccess: () => void };
};

type YogaCourseListProps = {
    courses: YogaCourse[]; 
    navigation: StackNavigationProp<RootStackParamList>;
};

const YogaCourseList: React.FC<YogaCourseListProps> = ({ courses, navigation }) => {
    return (
        <View style={styles.container}>
            <FlatList
                data={courses}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.courseCard}>
                        <Text style={styles.courseType}>{item.classType} - {item.teacherName}</Text>
                        <Text>Day: {item.dayOfWeek}</Text>
                        <Text>Time: {item.courseTime}</Text>
                        <Text>Location: {item.location}</Text>
                        <Text>Duration: {item.duration} minutes</Text>
                        <TouchableOpacity 
                            style={styles.detailButton} 
                            onPress={() => navigation.navigate('Detail YogaCourse', { courseId: item._id })} 
                        >
                            <Text style={styles.detailButtonText}>View Details</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f4f8',
    },
    courseCard: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    courseType: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    detailButton: {
        backgroundColor: '#2a7183', 
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    detailButtonText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default YogaCourseList;
