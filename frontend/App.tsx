// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screen/HomeScreen';
import HikeListScreen from './src/screen/HikeListScreen';
import AddHikeScreen from './src/screen/AddHikeScreen';
import EditHikeScreen from './src/screen/EditHikeScreen';

export type RootStackParamList = {
    Home: undefined;
    Hikes: undefined;
    'Add Hike': undefined;
    'Edit Hike': { hikeId: string }; // Thêm tham số cho Edit Hike
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Hikes" component={HikeListScreen} />
                <Stack.Screen name="Add Hike" component={AddHikeScreen} />
                <Stack.Screen name="Edit Hike" component={EditHikeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
