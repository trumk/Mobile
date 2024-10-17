import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screen/customer/HomeScreen';
import LoginScreen from './src/screen/LoginScreen';
import RegisterScreen from './src/screen/RegisterScreen';
import ProfileScreen from './src/screen/customer/ProfileScreen';
import CourseList from './src/screen/customer/CourseList';
import CourseDetail from './src/screen/customer/CourseDetail';

export type RootStackParamList = {
    Home: undefined;
    YogaCourses: undefined;
    'Detail Course': { courseId: string };
    Login: undefined;
    Register: undefined;
    Profile: undefined;
    Courses: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                {/* auth */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                {/* customer */}
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} /> 
                <Stack.Screen name="Courses" component={CourseList} />
                <Stack.Screen name="Detail Course" component={CourseDetail} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
