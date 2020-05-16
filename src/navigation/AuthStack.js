import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/Login';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{header: () => null}}
      />
    </Stack.Navigator>
  );
}
