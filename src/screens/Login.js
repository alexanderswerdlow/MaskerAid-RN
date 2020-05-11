import React, {Component} from 'react';
import {View, StyleSheet, Alert, Text, Image, Button} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import config from '../config';

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      userInfo: null,
      error: null,
    };
  }

  async componentDidMount() {
    this._configureGoogleSignIn();
    await this._getCurrentUser();
  }

  _configureGoogleSignIn() {
    GoogleSignin.configure({
      webClientId: config.webClientId,
      offlineAccess: false,
    });
  }

  async _getCurrentUser() {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      this.setState({userInfo, error: null});
    } catch (error) {
      const errorMessage =
        error.code === statusCodes.SIGN_IN_REQUIRED
          ? 'Please sign in :)'
          : error.message;
      this.setState({
        error: new Error(errorMessage),
      });
    }
  }

  render() {
    const {userInfo} = this.state;

    const body = userInfo
      ? this.renderUserInfo(userInfo)
      : this.renderSignInButton();
    return (
      <View style={[styles.container, styles.pageContainer]}>
        <Button
          onPress={async () => {
            const isSignedIn = await GoogleSignin.isSignedIn();
            Alert.alert(String(isSignedIn));
          }}
          title="is user signed in?"
        />

        <Button
          onPress={async () => {
            const userInfo = await GoogleSignin.getCurrentUser();
            Alert.alert(
              'current user',
              userInfo ? JSON.stringify(userInfo.user) : 'null',
            );
          }}
          title="get current user"
        />

        <Button
          onPress={async () => {
            const isSignedIn = await GoogleSignin.isSignedIn();
            if (isSignedIn) {
              const isSignedIn = await GoogleSignin.getTokens();
              Alert.alert('tokens', JSON.stringify(isSignedIn));
            } else {
              Alert.alert('not signed in');
            }
          }}
          title="get tokens"
        />

        <Button
          onPress={async () => {
            const user = await GoogleSignin.getCurrentUser();
            if (user) {
              this.props.navigation.navigate('Home', {
                userInfo: user,
              });
            } else {
              Alert.alert('not signed in');
            }
          }}
          title="go to home page"
        />

        {body}
      </View>
    );
  }

  renderUserInfo(userInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.userInfo}>Welcome {userInfo.user.name}</Text>
        <Text>Your user info: {JSON.stringify(userInfo.user)}</Text>
        <Image
          style={styles.userPic}
          source={{
            uri: userInfo.user.photo,
          }}
        />
        <Button onPress={this._signOut} title="Log out" />
        {this.renderError()}
      </View>
    );
  }

  renderSignInButton() {
    return (
      <View style={styles.container}>
        <GoogleSigninButton
          style={{width: 192, height: 48}}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Auto}
          onPress={this._signIn}
        />
        {this.renderError()}
      </View>
    );
  }

  renderError() {
    const {error} = this.state;
    if (!error) {
      return null;
    }
    const text = `${error.toString()} ${error.code ? error.code : ''}`;
    return <Text>{text}</Text>;
  }

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({userInfo, error: null});
    } catch (error) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          // sign in was cancelled
          Alert.alert('cancelled');
          break;
        case statusCodes.IN_PROGRESS:
          // operation (eg. sign in) already in progress
          Alert.alert('in progress');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // android only
          Alert.alert('play services not available or outdated');
          break;
        default:
          Alert.alert('Something went wrong', error.toString());
          this.setState({
            error,
          });
      }
    }
  };

  _signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();

      this.setState({userInfo: null, error: null});
    } catch (error) {
      this.setState({
        error,
      });
    }
  };
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
  userInfo: {fontSize: 18, fontWeight: 'bold', marginBottom: 20},
  pageContainer: {flex: 1},
  userPic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
