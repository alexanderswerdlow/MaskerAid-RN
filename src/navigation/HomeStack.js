/* eslint-disable react/display-name */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import ViewProfileScreen from '../screens/Profile';
import NewPostScreen from '../screens/NewPost';
import SearchScreen from '../screens/Search';
import CommentScreen from '../screens/CommentScreen';
import {AuthContext} from '../navigation/AuthProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const MainStack = createStackNavigator();

function MainStackScreen() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen name="ViewProfile" component={ViewProfileScreen} />
      <MainStack.Screen name="CommentScreen" component={CommentScreen}/>
    </MainStack.Navigator>
  );
}

const SearchStack = createStackNavigator();

function SearchStackScreen() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen name="Search" component={SearchScreen} />
      <SearchStack.Screen
        name="ViewSearchProfile"
        options={{title: 'Profile'}}
        component={ViewProfileScreen}
      />    </SearchStack.Navigator>
  );
}

const ProfileStackScreen = createStackNavigator();

function ProfileScreen() {
  const {user} = React.useContext(AuthContext);
  return (
    <ProfileStackScreen.Navigator>
      <ProfileStackScreen.Screen name="Profile">
        {(props) => <ViewProfileScreen {...props} user={user} />}
      </ProfileStackScreen.Screen>
    </ProfileStackScreen.Navigator>
  );
}

export default function App() {
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
        activeTintColor: 'gray',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="Home" component={MainStackScreen} />
      <Tab.Screen name="Post" component={NewPostScreen} />
      <Tab.Screen name="Search" component={SearchStackScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}