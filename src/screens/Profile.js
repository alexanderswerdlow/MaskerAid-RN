import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, Image, Dimensions, TouchableOpacity} from 'react-native';
import {AuthContext} from '../navigation/AuthProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';

export function handlePress() {
  return (
    <View>
      <Text>Hello</Text>
    </View>
  );
}

export default function Profile({navigation}) {
  const screenWidth = Dimensions.get('window').width;
  const {user, logout} = useContext(AuthContext);
  return (
    <View>
      <View>
        <View>
          <Image style={styles.userPic}
            source={{uri: user.photoURL}}
            resizeMode="stretch"
          />
          <Text style={styles.userName}>
            {user.displayName}
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.userStatus}>20</Text>
            <Text>Posts</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.userStatus}>20</Text>
            <Text>Following</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.userStatus}>20</Text>
            <Text>Followers</Text>
          </View>
        </View>
      </View>


      <View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => handlePress()}>
            <Ionicons name={'apps-outline'} size={27} style={{padding: 5}}/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userPic: {
    alignSelf: 'center',
    width: 125,
    height: 125,
    borderRadius: 75,
    marginTop: 30,
    borderWidth: 1,
    borderColor: 'black',
  },

  userName: {
    alignSelf: 'center',
    fontSize: 25,
    marginTop: 15,
    marginBottom: 20,
  },

  userStatus: {
    alignSelf: 'center',
    fontSize: 20,
  },

  feed: {
    alignSelf: 'center',
    fontSize: 40,
  }
});
