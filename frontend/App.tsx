import { useState } from 'react';
import { Button, FlatList, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function App() {

  return (
    <View style={styles.container}>
      <Text style = {styles.header}>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "green",
    fontSize: 40,
    paddingHorizontal: 20,
    textAlign: "center"
  },
  container: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: '#f5f5f5',
  }
});
