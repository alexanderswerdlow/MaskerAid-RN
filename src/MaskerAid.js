import 'react-native-gesture-handler';
import AuthStack from './navigation/AuthStack';
import HomeStack from './navigation/HomeStack';
import {AuthContext} from './navigation/ContextProvider';
import React, {useState, useContext, useEffect} from 'react';
import {ActivityIndicator, Colors} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {NavigationContainer} from '@react-navigation/native';
import {StyleSheet, SafeAreaView, YellowBox} from 'react-native';
import {navigationRef} from './navigation/RootNavigation';
import firestore from '@react-native-firebase/firestore';

export default function MaskerAid() {
  const [initializing, setInitializing] = useState(true);
  const {user, setUser} = useContext(AuthContext);
  const {theme} = useContext(AuthContext);

  async function bootstrap() {
    YellowBox.ignoreWarnings(["Can't perform a React state"]);
    YellowBox.ignoreWarnings(['Require cycle:']);
    YellowBox.ignoreWarnings(['Animated:']);
    YellowBox.ignoreWarnings(['Warning: componentWill']);
    await firestore().settings({
      persistence: false, // disable offline persistence
    });
  }

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
    bootstrap();
    return (
      <>
        <ActivityIndicator animating={true} color={theme.colors.primary} />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer ref={navigationRef}>
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
