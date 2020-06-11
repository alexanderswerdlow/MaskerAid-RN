/* eslint-disable react/display-name */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import ViewProfileScreen from '../screens/Profile';
import NewPostScreen from '../screens/NewPost';
import MessagesScreen from '../screens/Messages';
import ChatScreen from '../screens/Chat';
import SearchScreen from '../screens/Search';
import UserListScreen from '../screens/UserList';
import {GlobalContext} from '../navigation/ContextProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SettingsScreen from '../screens/Settings';
import CommentScreen from '../screens/CommentScreen';

const Tab = createBottomTabNavigator();

const MainStack = createStackNavigator();

function MainStackScreen() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen
        name="ViewProfile"
        options={{title: 'Profile'}}
        component={ViewProfileScreen}
      />
      <MainStack.Screen
        name="UserList"
        options={{title: 'Followers/Following'}}
        component={UserListScreen}
      />
      <MainStack.Screen name="Chat" component={ChatScreen} />
      <MainStack.Screen name="Comments" component={CommentScreen} />
    </MainStack.Navigator>
  );
}

const SearchStack = createStackNavigator();

function SearchStackScreen() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen name="Search" component={SearchScreen} />
      <SearchStack.Screen
        name="ViewProfile"
        options={{title: 'Profile'}}
        component={ViewProfileScreen}
      />
      <SearchStack.Screen
        name="UserList"
        options={{title: 'Followers/Following'}}
        component={UserListScreen}
      />
      <SearchStack.Screen name="Chat" component={ChatScreen} />
      <SearchStack.Screen name="Comment" component={CommentScreen} />
    </SearchStack.Navigator>
  );
}

const MessagesStack = createStackNavigator();

function MessagesStackScreen() {
  return (
    <MessagesStack.Navigator>
      <MessagesStack.Screen name="Messages" component={MessagesScreen} />
      <MessagesStack.Screen name="Chat" component={ChatScreen} />
      <MessagesStack.Screen name="Comments" component={CommentScreen} />
    </MessagesStack.Navigator>
  );
}

const ProfileStackScreen = createStackNavigator();

function ProfileScreen() {
  const {user} = React.useContext(GlobalContext);
  return (
    <ProfileStackScreen.Navigator>
      <ProfileStackScreen.Screen name="Profile">
        {(props) => <ViewProfileScreen {...props} user={user} />}
      </ProfileStackScreen.Screen>
      <ProfileStackScreen.Screen name="Settings" component={SettingsScreen} />
      <ProfileStackScreen.Screen name="Comments" component={CommentScreen} />
      <ProfileStackScreen.Screen
        name="UserList"
        options={{title: 'Followers/Following'}}
        component={UserListScreen}
      />
      <ProfileStackScreen.Screen
        name="ViewProfile"
        options={{title: 'Profile'}}
        component={ViewProfileScreen}
      />
    </ProfileStackScreen.Navigator>
  );
}

export default function App() {
  const {theme} = React.useContext(GlobalContext);
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
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
        activeTintColor: theme.colors.primary,
        inactiveTintColor: 'gray',
        activeBackgroundColor: 'white',
      }}>
      <Tab.Screen name="Home" component={MainStackScreen} />
      <Tab.Screen name="Post" component={NewPostScreen} />
      <Tab.Screen name="Messages" component={MessagesStackScreen} />
      <Tab.Screen name="Search" component={SearchStackScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
