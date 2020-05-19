import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import HomeScreen from '../screens/Home';
import ProfileScreen from '../screens/Profile';

/*class HomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.contatiner}>
        <Text>Home Screen</Text>
      </View>
    );
  }
}

class ProfileScreen extends React.Component {
  render() {
    return (
      <View style={styles.contatiner}>
        <Text>Profile Screen</Text>
    </View>
    );
  }
}

const TabNavigator = createBottomTabNavigator(
  {
    Home:{
      screen: HomeScreen,
        navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({tintColor})=>(
          <Icon name="ios-home" color={tintColor} size={25}/>
        )
      }
    },

    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({tintColor})=>(
          <Icon name="ios-person" color={tintColor} size={25}/>
        )
      }
    },
  },
  {
  initialRouteName: "Home"
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Todos" component={TodoScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
    );

  return (
    createAppContainer(TabNavigator)
  );
}*/

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
});

const AppContainer = createAppContainer(
  createBottomTabNavigator(
  {
    Home: HomeStack,
    Profile: ProfileStack,
  },
));

export default AppContainer;