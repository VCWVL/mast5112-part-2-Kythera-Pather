import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, ImageBackground } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
// Import the shared types from App.tsx
import { RootStackParamList, Course } from "../App";

type EditMenuNavProp = StackNavigationProp<RootStackParamList, "EditMenu">;
type Props = {
  navigation: EditMenuNavProp;
};
const courses: Exclude<Course, 'Drinks'>[] = ['Specials', 'Starter', 'Main Course', 'Dessert'];

export default function EditMenuScreen({ navigation }: Props) {
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Exclude<Course, 'Drinks'> | ''>('');
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handleSave = () => {
    if (!dishName || !description || selectedCourse === '' || !price) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const newMenuItem = {
      id: Date.now().toString(), // Use a timestamp for a unique ID
      name: dishName,
      description: description,
      course: selectedCourse as Exclude<Course, 'Drinks'>,
      price: parseFloat(price),
      image: image, // Pass the image URI
    };

    // Navigate back to MenuScreen and pass the new item as a parameter
    navigation.navigate("Menu", { newMenuItem });

    // Clear the form for the next entry
    clearForm();
  };

  const clearForm = () => {
    // Clear form
    setDishName("");
    setDescription("");
    setSelectedCourse('');
    setPrice("");
    setImage(null);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ImageBackground source={require('../assets/Background.jpg')} style={styles.container} resizeMode="cover">
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollViewContainer}
            horizontal={false}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Image source={require("../assets/Logo.jpg")} style={styles.logo} />
              <Text style={styles.title}>Edit Menu Items</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Dish Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter a Dish Name"
                value={dishName}
                onChangeText={setDishName}
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter a description"
                value={description}
                onChangeText={setDescription}
                multiline
              />

              <Text style={styles.label}>Select the Course</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedCourse}
                  onValueChange={(itemValue: Exclude<Course, 'Drinks'> | '') => setSelectedCourse(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select a course" value="" />
                  {courses.map(course => <Picker.Item key={course} label={course} value={course} />)}
                </Picker>
              </View>

              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter a Price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.actionButtons}>
              {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.buttonText}>Upload Image</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.navButtons}>
              <TouchableOpacity style={styles.menuHomeButton} onPress={() => navigation.navigate("Menu", {})}>
                <Text style={styles.buttonText}>Menu-Home</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  scrollViewContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  logo: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  title: { fontSize: 24, fontWeight: 'bold' },
  formSection: { marginBottom: 20 },
  label: { fontWeight: 'bold', textDecorationLine: 'underline', marginBottom: 5, fontSize: 16 },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginBottom: 15,
    justifyContent: 'center',
  },
  picker: { height: 50, width: '100%' },
  actionButtons: { alignItems: 'center', marginBottom: 30 },
  uploadButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 15,
    marginTop: 15,
  },
  buttonText: { fontWeight: 'bold', color: '#333' },
  navButtons: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 }, // Centered the remaining button
  removeButtonText: { fontWeight: 'bold', color: '#333' },
  menuHomeButton: {
    backgroundColor: '#a0a0a0',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#ccc',
  },
});