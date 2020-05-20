import React from 'react';
import { StyleSheet, Button, View, Text } from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import TodoScreen from '../screens/Todos';
import NewPost from '../screens/NewPost';
import { createBottomTabNavigator } from 'react-navigation-tabs'; 
import { createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator();

const TabNavigator = createBottomTabNavigator(
  {
    Home: { screen: HomeScreen,
      navigationOptions:{
        tabBarlabel:'Home',
        tabBarIcon:({tintColor})=>(  
          <Icon name="ios-person" color={tintColor} size={25}/>  
      )  
      }
    },

    Post: {screen: NewPost, 
      navigationOptions:{
        tabBarLabel:'Make a post',
        tabBarIcon:({tintColor})=>(  
          <Icon name="ios-person" color={tintColor} size={25}/>  
      )  
      }
    },
  },
);

const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    justifyContent: 'center',  
    alignItems: 'center'  
  },  
});  

export default createAppContainer(TabNavigator);
 /* export default function HomeStack() {
  return (
     <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Todos" component={TodoScreen} />
    </Stack.Navigator> 
  );
} 

 export const TabBar = createAppContainer(TabNavigator); */
