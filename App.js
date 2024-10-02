// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Signup from './app/Signup';
import Login from './app/Login';
import Home from './app/HomeScreen'; // Màn hình Home
import AddServiceScreen from './app/AddServiceScreen';
import AuthLoading from './app/AuthLoading'; // Màn hình AuthLoading

import { LogBox } from 'react-native'; // Import LogBox

LogBox.ignoreLogs([
  "@firebase/auth: Auth (10.13.2): You are initializing Firebase Auth for React Native without providing AsyncStorage. Auth state will default to memory persistence and will not persist between sessions. In order to persist auth state, install the package",
]);

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthLoading" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AuthLoading" component={AuthLoading} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AddService" component={AddServiceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
