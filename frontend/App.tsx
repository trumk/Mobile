import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screen/customer/HomeScreen';
import YogaCourseListScreen from './src/screen/admin/YogaCourseListScreen';
import AddYogaCourseScreen from './src/screen/admin/AddYogaCourseScreen';
import EditYogaCourseScreen from './src/screen/admin/EditYogaCourseScreen';
import DetailYogaCourseScreen from './src/screen/admin/DetailYogaCourseScreen';
import LoginScreen from './src/screen/LoginScreen';
import RegisterScreen from './src/screen/RegisterScreen';
import HomeScreenAdmin from './src/screen/admin/HomeScreenAdmin';

export type RootStackParamList = {
    Home: undefined;
    YogaCourses: undefined;
    'Add YogaCourse': undefined;
    'Edit YogaCourse': { courseId: string }; 
    'Detail YogaCourse': { courseId: string }; 
    Login: undefined;
    Register: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                {/* auth */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                {/* admin */}
                <Stack.Screen name="Admin Homepage" component={HomeScreenAdmin} />
                <Stack.Screen name="YogaCourses" component={YogaCourseListScreen} />
                <Stack.Screen name="Add YogaCourse" component={AddYogaCourseScreen} />
                <Stack.Screen name="Edit YogaCourse" component={EditYogaCourseScreen} />
                <Stack.Screen name="Detail YogaCourse" component={DetailYogaCourseScreen} />
                {/* customer */}
                <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
