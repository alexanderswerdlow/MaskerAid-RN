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
          console.log('Sign In');
          const {idToken} = await GoogleSignin.signIn();
          const googleCredential = auth.GoogleAuthProvider.credential(idToken);
          auth().signInWithCredential(googleCredential);
        },
        logout: async () => {
          try {
            await auth().signOut();
            //await GoogleSignin.revokeAccess();
            //await GoogleSignin.signOut();
          } catch (e) {
            console.error(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
