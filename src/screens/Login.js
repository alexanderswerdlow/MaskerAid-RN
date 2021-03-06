import React, {useContext} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {GoogleSigninButton} from '@react-native-community/google-signin';
import {GlobalContext} from '../navigation/ContextProvider';

export default function Login() {
  const {login} = useContext(GlobalContext);
  return (
    <View style={[styles.container, styles.pageContainer]}>
      <Image source={require('../images/180.png')} />
      <GoogleSigninButton
        style={{width: 192, height: 48}}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Auto}
        onPress={() => login()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  pageContainer: {flex: 1},
});
