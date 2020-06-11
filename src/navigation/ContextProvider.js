import React, {createContext, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import config from '../config';
import {Platform} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';

export const GlobalContext = createContext({});

export const ContextProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [theme, changeTheme] = useState({
    ...DefaultTheme,
    backgroundColor: 'pink',
    colors: {
      ...DefaultTheme.colors,
    },
  });

  useEffect(() => {
    if (user) {
      firestore().doc(`users/${user.uid}`).update({theme});
    }
  }, [theme]);

  useEffect(() => {
    if (user) {
      firestore()
        .doc(`users/${user.uid}`)
        .get()
        .then((documentSnapshot) => {
          if (documentSnapshot.exists && documentSnapshot.data().theme) {
            changeTheme(documentSnapshot.data().theme);
          }
        });
    }
  }, [user]);

  GoogleSignin.configure({
    webClientId:
      Platform.OS === 'ios' ? config.webClientIdIos : config.webClientIdAndroid,
    offlineAccess: true,
  });

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        theme,
        changeTheme,
        login: async () => {
          try {
            console.log('Signing In');
            // Get the users ID token
            const {idToken} = await GoogleSignin.signIn();

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(
              idToken,
            );

            // Sign-in the user with the credential
            return auth().signInWithCredential(googleCredential);
          } catch (error) {
            console.log(error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              // user cancelled the login flow
              console.log('Sign In Cancelled');
            } else if (error.code === statusCodes.IN_PROGRESS) {
              // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // play services not available or outdated
              console.log('Play Services Not Available');
            } else {
              // some other error happened
              console.log('Sign In Error');
            }
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.error(e);
          }
        },
        deleteAccount: async () => {
          var user = auth().currentUser;
          user
            .delete()
            .then(function () {
              console.log('User Deleted');
              auth().signOut();
            })
            .catch(async function () {
              // If the user has not recently logged in, they must re-auth
              Alert.alert(
                'You must re-authenticate before deleting your account',
                'Your account will be permanately deleted',
                [
                  {
                    text: 'OK',
                    onPress: async () => {
                      const {idToken} = await GoogleSignin.signIn();
                      const googleCredential = auth.GoogleAuthProvider.credential(
                        idToken,
                      );
                      await auth().signInWithCredential(googleCredential);
                      var user = auth().currentUser;
                      user.delete().then(function () {
                        console.log('User Deleted');
                        auth()
                          .signOut()
                          .catch(async function (error) {
                            console.log(error);
                          });
                      });
                    },
                  },
                ],
                {cancelable: false},
              );
            });
        },
      }}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </GlobalContext.Provider>
  );
};
