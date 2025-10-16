import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// It's a good practice to define your stack params in a shared file
type RootStackParamList = {
  AdminWelcome: undefined;
  Menu: undefined;
  Login: undefined;
};

const LoginScreen = () => {
  // Provide the specific type to useNavigation for type safety
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Example authentication logic
    if (username === 'chef' && password === 'chef123') {
      navigation.navigate('AdminWelcome');
    } else if (username === 'guest' && password === 'guest123') {
      navigation.navigate('Menu');
    } else {
      Alert.alert('Login Failed', 'Invalid username or password.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground 
        source={require('../assets/background.jpg')} 
        style={styles.background}
      >
        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <Text style={styles.title}>Welcome to Christoffel’s Menu</Text>
          <Text style={styles.subtitle}>We hope you have an amazing experience with us</Text>
        </View>

        <Image 
          source={require('../assets/food-placeholder.png')} 
          style={styles.imagePlaceholder}
        />

        <View style={styles.formContainer}>
          <TextInput
            placeholder="Enter the username"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder="Enter the password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  logo: { width: 80, height: 80, marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#444', marginBottom: 10, textAlign: 'center' },
  imagePlaceholder: { width: 200, height: 150, marginVertical: 20 },
  formContainer: { width: '80%' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#cfe2ff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#000', fontWeight: '600' },
});

export default LoginScreen;
