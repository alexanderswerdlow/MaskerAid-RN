import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import TodoScreen from '../screens/Todos';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Todos" component={TodoScreen} />
    </Stack.Navigator>
  );
}
