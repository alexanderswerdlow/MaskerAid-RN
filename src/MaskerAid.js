import 'react-native-gesture-handler';
import AuthStack from './navigation/AuthStack';
import HomeStack from './navigation/HomeStack';
import {AuthContext} from './navigation/AuthProvider';
import React, {useState, useContext, useEffect} from 'react';
import {ActivityIndicator, Colors} from 'react-native-paper';

import auth from '@react-native-firebase/auth';
import {NavigationContainer} from '@react-navigation/native';
import {StyleSheet, SafeAreaView} from 'react-native';
import HomePage from './screens/Home';

export default function MaskerAid() {
  const [initializing, setInitializing] = useState(true);
  const {user, setUser} = useContext(AuthContext);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return (
      <>
        <ActivityIndicator animating={true} color={Colors.red800} />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        {user ? <HomeStack /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
