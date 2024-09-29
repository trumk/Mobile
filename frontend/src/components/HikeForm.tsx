// HikeForm.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { Hike } from '../../type';

type HikeFormProps = {
    hike?: Hike; // Có thể truyền vào một hike để chỉnh sửa
    onSubmit: (hike: Omit<Hike, '_id'>) => void; // Bỏ qua trường _id khi gửi
};

const HikeForm: React.FC<HikeFormProps> = ({ hike, onSubmit }) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [parkingAvailable, setParkingAvailable] = useState('');
    const [length, setLength] = useState(0);
    const [difficulty, setDifficulty] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (hike) {
            setName(hike.name);
            setLocation(hike.location);
            setDate(hike.date);
            setParkingAvailable(hike.parkingAvailable);
            setLength(hike.length);
            setDifficulty(hike.difficulty);
            setDescription(hike.description || '');
        }
    }, [hike]);

    const handleSubmit = () => {
        onSubmit({
            name,
            location,
            date,
            parkingAvailable,
            length,
            difficulty,
            description,
        });
    };

    return (
        <View>
            <Text>Name:</Text>
            <TextInput value={name} onChangeText={setName} />
            <Text>Location:</Text>
            <TextInput value={location} onChangeText={setLocation} />
            <Text>Date:</Text>
            <TextInput value={date} onChangeText={setDate} />
            <Text>Parking Available:</Text>
            <TextInput value={parkingAvailable} onChangeText={setParkingAvailable} />
            <Text>Length:</Text>
            <TextInput 
                value={length.toString()} 
                keyboardType="numeric" 
                onChangeText={(value) => setLength(Number(value))} 
            />
            <Text>Difficulty:</Text>
            <TextInput value={difficulty} onChangeText={setDifficulty} />
            <Text>Description:</Text>
            <TextInput value={description} onChangeText={setDescription} />
            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
};

export default HikeForm;
