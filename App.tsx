import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// Import only the screens you want to work on
import LoginScreen from "./screens/LoginScreen";
import WelcomeChefScreen from "./screens/AdminWelcomeScreen";
import MenuScreen from "./screens/MenuScreen"; // Make sure this is imported
import EditMenuScreen from "./screens/EditMenuScreen";
// import RemoveItemScreen from "./screens/RemoveItemsScreen";
// import FilterByCourseScreen from "./screens/FilterByCourseScreen";
// import CheckoutScreen from "./screens/CheckoutScreen";

export type RootStackParamList = {
  Login: undefined;
  WelcomeChef: undefined;
  Menu: undefined;
  EditMenu: undefined;
  RemoveItems: undefined;
  FilterByCourse: undefined;
  Checkout: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: "#e8eaf6" },
          headerTintColor: "#000",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />

        <Stack.Screen
          name="WelcomeChef"
          component={WelcomeChefScreen}
          options={{ title: "Welcome Chef" }}
        />

        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{ title: "Menu" }}
        />

        <Stack.Screen
          name="EditMenu"
          component={EditMenuScreen}
          options={{ title: "Edit Menu" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
