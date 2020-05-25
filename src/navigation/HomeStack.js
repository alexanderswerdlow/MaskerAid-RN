/* eslint-disable react/display-name */
import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home';
import ProfileScreen from '../screens/Profile';
import NewPostScreen from '../screens/NewPost';
import {AuthContext} from '../navigation/AuthProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import UserProfile from '../screens/UserProfile';

const Tab = createBottomTabNavigator();

const MainStack = createStackNavigator();

function MainStackScreen() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen name="User Profile" component={UserProfile} />
    </MainStack.Navigator>
  )
}

export default function App() {
  const {user} = React.useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'ios-home';
          } else if (route.name === 'Profile') {
            iconName = 'ios-person';
          } else if (route.name === 'Post') {
            iconName = 'ios-clipboard';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'blue',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="Home" component={MainStackScreen} />
      <Tab.Screen name="Post" component={NewPostScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} userData={user} />
    </Tab.Navigator>
  );
}