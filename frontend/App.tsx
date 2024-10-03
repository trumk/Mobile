import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screen/HomeScreen';
import YogaCourseListScreen from './src/screen/YogaCourseListScreen';
import AddYogaCourseScreen from './src/screen/AddYogaCourseScreen';
import EditYogaCourseScreen from './src/screen/EditYogaCourseScreen';
import DetailYogaCourseScreen from './src/screen/DetailYogaCourseScreen';

export type RootStackParamList = {
    Home: undefined;
    YogaCourses: undefined;
    'Add YogaCourse': undefined;
    'Edit YogaCourse': { courseId: string }; 
    'Detail YogaCourse': { courseId: string }; 
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="YogaCourses" component={YogaCourseListScreen} />
                <Stack.Screen name="Add YogaCourse" component={AddYogaCourseScreen} />
                <Stack.Screen name="Edit YogaCourse" component={EditYogaCourseScreen} />
                <Stack.Screen name="Detail YogaCourse" component={DetailYogaCourseScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
