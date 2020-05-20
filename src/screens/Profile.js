import React, {useContext} from 'react';
import {View, Text, StyleSheet, Image, Dimensions, Button} from 'react-native';
import {AuthContext} from '../navigation/AuthProvider';

export default function Profile({navigation}) {
  const {user, logout} = useContext(AuthContext);
  return (
    <View>
      <Image
        style={styles.userPic}
        source={{uri: user.photoURL}}
        resizeMode="stretch"
      />
      <Button title="Logout" onPress={() => logout()} />
    </View>
  );
}

const styles = StyleSheet.create({
  userPic: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 75,
  },

  userName: {},
});
