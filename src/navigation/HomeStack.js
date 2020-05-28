/* eslint-disable react/display-name */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import ProfileScreen from '../screens/Profile';
import NewPostScreen from '../screens/NewPost';
import MessagesScreen from '../screens/Messages';
import ChatScreen from '../screens/Chat';
import SearchScreen from '../screens/Search';
import {AuthContext} from '../navigation/AuthProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SettingsScreen from '../screens/Settings';

const Tab = createBottomTabNavigator();

const MainStack = createStackNavigator();

function MainStackScreen() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen name="ViewProfile" component={ProfileScreen} />
      <MainStack.Screen name="Chat" component={ChatScreen} />
    </MainStack.Navigator>
  );
}

const SearchStack = createStackNavigator();

function SearchStackScreen() {
  return (
    <SearchStack.Navigator>
      <MainStack.Screen name="Search" component={SearchScreen} />
      <MainStack.Screen
        name="ViewSearchProfile"
        options={{title: 'Profile'}}
        component={ProfileScreen}
      />
      <MainStack.Screen name="Chat" component={ChatScreen} />
    </SearchStack.Navigator>
  );
}

const MessagesStack = createStackNavigator();

function MessagesStackScreen() {
  return (
    <MessagesStack.Navigator>
      <MainStack.Screen name="Messages" component={MessagesScreen} />
      <MainStack.Screen name="Chat" component={ChatScreen} />
    </MessagesStack.Navigator>
  );
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
          } else if (route.name === 'Search') {
            iconName = 'ios-search';
          } else if (route.name === 'Messages') {
            iconName = 'ios-mail';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'rgb('+global.Rvalue+','+global.Gvalue+','+global.Bvalue+')',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="Home" component={MainStackScreen} />
      <Tab.Screen name="Post" component={NewPostScreen} />
      <Tab.Screen name="Messages" component={MessagesStackScreen} />
      <Tab.Screen name="Search" component={SearchStackScreen} />
      <Tab.Screen name="Profile">
        {(props) => <ProfileScreen {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
