import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Platform,
  StyleSheet,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, { Marker } from "react-native-maps";
import RNPickerSelect from "react-native-picker-select";
import { Hike } from "../../type";

type HikeFormProps = {
  hike?: Hike;
  onSubmit: (hike: Omit<Hike, "_id">) => void;
};

const HikeForm: React.FC<HikeFormProps> = ({ hike, onSubmit }) => {
  const [name, setName] = useState(hike?.name || "");
  const [location, setLocation] = useState(hike?.location || "");
  const [locationEnd, setLocationEnd] = useState(hike?.locationEnd || "");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [parkingAvailable, setParkingAvailable] = useState(
    hike?.parkingAvailable || "yes"
  );
  const [length, setLength] = useState(hike?.length || 0);
  const [difficulty, setDifficulty] = useState(hike?.difficulty || "easy");
  const [description, setDescription] = useState(hike?.description || "");
  const [weather, setWeather] = useState("sunny");

  // Hàm tính khoảng cách giữa hai tọa độ sử dụng công thức Haversine
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Bán kính Trái đất (km)
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Khoảng cách tính bằng km
  };

  // Tự động tính chiều dài khi `location` và `locationEnd` được chọn
  useEffect(() => {
    if (location && locationEnd) {
      const [lat1, lon1] = location.split(",").map(Number);
      const [lat2, lon2] = locationEnd.split(",").map(Number);
      const calculatedLength = calculateDistance(lat1, lon1, lat2, lon2);
      setLength(parseFloat(calculatedLength.toFixed(2))); // Giới hạn 2 chữ số thập phân
    }
  }, [location, locationEnd]);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      name,
      location,
      locationEnd,
      date: date.toISOString(),
      parkingAvailable,
      length, 
      difficulty,
      description,
      weather,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Name:</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        {/* Map cho điểm bắt đầu */}
        <Text style={styles.label}>Start Location:</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 16.047079,
            longitude: 108.20623,
            latitudeDelta: 8.0,
            longitudeDelta: 8.0,
          }}
          onPress={(e) =>
            setLocation(
              `${e.nativeEvent.coordinate.latitude}, ${e.nativeEvent.coordinate.longitude}`
            )
          }
        >
          {location && (
            <Marker
              coordinate={{
                latitude: parseFloat(location.split(",")[0]),
                longitude: parseFloat(location.split(",")[1]),
              }}
            />
          )}
        </MapView>

        {/* Map cho điểm kết thúc */}
        <Text style={styles.label}>End Location:</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 16.047079,
            longitude: 108.20623,
            latitudeDelta: 8.0,
            longitudeDelta: 8.0,
          }}
          onPress={(e) =>
            setLocationEnd(
              `${e.nativeEvent.coordinate.latitude}, ${e.nativeEvent.coordinate.longitude}`
            )
          }
        >
          {locationEnd && (
            <Marker
              coordinate={{
                latitude: parseFloat(locationEnd.split(",")[0]),
                longitude: parseFloat(locationEnd.split(",")[1]),
              }}
            />
          )}
        </MapView>

        <Text style={styles.label}>Date:</Text>
        <Button title="Choose Date" onPress={() => setShowDatePicker(true)} />
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <Text style={styles.label}>Parking Available:</Text>
        <RNPickerSelect
          onValueChange={setParkingAvailable}
          items={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
          value={parkingAvailable}
          style={pickerSelectStyles}
        />

        <Text style={styles.label}>Length (km):</Text>
        <TextInput
          style={styles.input}
          value={length ? length.toString() : ""} // Hiển thị như chuỗi
          keyboardType="numeric"
          onChangeText={(value) => {
            const numericValue = Number(value);
            setLength(isNaN(numericValue) ? 0 : numericValue); // Kiểm tra nếu không phải số, đặt là 0
          }}
        />

        <Text style={styles.label}>Difficulty:</Text>
        <RNPickerSelect
          onValueChange={setDifficulty}
          items={[
            { label: "Easy", value: "easy" },
            { label: "Normal", value: "normal" },
            { label: "Hard", value: "hard" },
          ]}
          value={difficulty}
          style={pickerSelectStyles}
        />

        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Weather:</Text>
        <RNPickerSelect
          onValueChange={setWeather}
          items={[
            { label: "Sunny", value: "sunny" },
            { label: "Rainy", value: "rainy" },
            { label: "Cloudy", value: "cloudy" },
            { label: "Snowy", value: "snowy" },
          ]}
          value={weather}
          style={pickerSelectStyles}
        />

        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: 200,
    marginBottom: 15,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  inputAndroid: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
};

export default HikeForm;
