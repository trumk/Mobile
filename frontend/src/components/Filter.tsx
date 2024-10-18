import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { fetchClassTypes } from '../screen/apiRequest'; 
import { ClassType } from '../../types';

type FilterProps = {
  onFilter: (duration: string, classType: string) => void; 
};

const durationOptions = [30, 60, 120]; 

const Filter: React.FC<FilterProps> = ({ onFilter }) => {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedClassType, setSelectedClassType] = useState<string>('');
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const loadClassTypes = async () => {
      try {
        const data = await fetchClassTypes();
        setClassTypes(data);
      } catch (error) {
        console.error('Failed to fetch class types:', error);
      }
    };

    loadClassTypes();
  }, []);

  const handleApplyFilter = () => {
    const durationString = selectedDuration !== null ? selectedDuration.toString() : ""; 
    onFilter(durationString, selectedClassType);
    setDropdownVisible(false); // Ẩn dropdown sau khi áp dụng bộ lọc
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
            <Text style={styles.label}>Filter by Duration</Text>
            <Picker
              selectedValue={selectedDuration}
              onValueChange={(itemValue) => setSelectedDuration(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Duration" value={null} />
              {durationOptions.map((option) => (
                <Picker.Item key={option} label={`${option} minutes`} value={option} />
              ))}
            </Picker>

            <Text style={styles.label}>Filter by Class Type</Text>
            <Picker
              selectedValue={selectedClassType}
              onValueChange={(itemValue) => setSelectedClassType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Class Type" value="" />
              {classTypes.map((classType) => (
                <Picker.Item key={classType._id} label={classType.typeName} value={classType._id} />
              ))}
            </Picker>

            <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilter}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={() => setDropdownVisible(false)}>
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
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#f0f4f8',
  },
  filterButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    marginBottom: 20,
  },
  applyButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Filter;
