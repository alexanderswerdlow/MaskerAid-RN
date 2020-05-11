import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/Home';
import LoginScreen from './screens/Login';
import React from 'react';

const Stack = createStackNavigator();

export default function MaskerAid() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
