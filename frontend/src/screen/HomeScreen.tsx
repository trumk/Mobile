import React from 'react';
import { View, Text, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type HomeScreenProps = {
    navigation: StackNavigationProp<any>;
    route: RouteProp<any, any>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Welcome to Hike App</Text>
            <Button title="View Hikes" onPress={() => navigation.navigate('Hikes')} />
            <Button title="Add New Hike" onPress={() => navigation.navigate('Add Hike')} />
        </View>
    );
};

export default HomeScreen;
