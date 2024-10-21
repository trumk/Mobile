import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Picker } from "@react-native-picker/picker";

type FilterProps = {
  onFilter: (dayOfWeek: string) => void;
};

const dayOptions = [
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
  { label: "Sunday", value: "Sunday" },
];

const Filter: React.FC<FilterProps> = ({ onFilter }) => {
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleApplyFilter = () => {
    if (selectedDay === "") {
      onFilter("");
    } else {
      onFilter(selectedDay);
    }
    setDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setDropdownVisible(!isDropdownVisible)}
      >
        <Text style={styles.filterButtonText}>Filter Courses</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="slide"
        visible={isDropdownVisible}
        onRequestClose={() => setDropdownVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.dropdownContainer}>
            <Text style={styles.label}>Filter by Day of the Week</Text>
            <Picker
              selectedValue={selectedDay}
              onValueChange={(itemValue) => {
                setSelectedDay(itemValue);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select Day" value="" />
              {dayOptions.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFilter}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setDropdownVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#f0f4f8",
  },
  filterButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dropdownContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  picker: {
    width: "100%",
    marginBottom: 20,
  },
  applyButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Filter;
