import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";

type LoginNavProp = StackNavigationProp<RootStackParamList, "Login">;

type Props = { navigation: LoginNavProp };

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username.toLowerCase() === "chef") {
      navigation.navigate("WelcomeChef");
    } else {
      navigation.navigate("Menu", {});
    }
  };

  return (
    <ImageBackground source={require("../assets/Background.jpg")} style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to Christoffel's Menu</Text>
        <Image source={require("../assets/Logo.jpg")} style={styles.logo} />
        <Text style={styles.subtitle}>We hope you have an amazing experience with us</Text>

        <Image source={require("../assets/Menu Banner.jpg")} style={styles.banner} />

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleLogin}>
          <Text style={styles.saveText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "100%",
    padding: 20,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#fff", textAlign: "center" },
  subtitle: { fontStyle: "italic", marginBottom: 15, color: "#fff", textAlign: "center" },
  logo: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  banner: { width: 220, height: 120, marginBottom: 20 },
  label: { alignSelf: "flex-start", marginLeft: "10%", fontWeight: "bold", marginTop: 10, color: "#fff" },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 15,
  },
  saveText: { color: "#fff", fontWeight: "bold" },
});
