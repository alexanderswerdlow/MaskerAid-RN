import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import config from '../config';
import {Platform} from 'react-native';

export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  GoogleSignin.configure({
    webClientId:
      Platform.OS === 'ios' ? config.webClientIdIos : config.webClientIdAndroid,
    offlineAccess: true,
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async () => {
          try {
            console.log('Signing In');
            const {idToken} = await GoogleSignin.signIn();
            const googleCredential = auth.GoogleAuthProvider.credential(
              idToken,
            );
            auth().signInWithCredential(googleCredential);
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
            .catch(async function (error) {
              const {idToken} = await GoogleSignin.signIn();
              const googleCredential = auth.GoogleAuthProvider.credential(
                idToken,
              );
              const userCredential = await auth().signInWithCredential(
                googleCredential,
              );
              var user = auth().currentUser;
              user.delete().then(function () {
                console.log('User Deleted');
                auth()
                  .signOut()
                  .catch(async function (error) {
                    console.log(error);
                  });
              });
            });
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
