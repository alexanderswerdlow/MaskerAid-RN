import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, Image, Dimensions, Button, TouchableOpacity} from 'react-native';
import config from '../config';
import Icon from 'react-native-vector-icons/Fontisto';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import {AuthContext} from '../navigation/AuthProvider';
import {PostFeed} from '../containers'

export default function Home({navigation}) {

  return (
    <View style = {{flex: 1, width: 100 +  "%", height: 100 + "%"}}>
        <View style={styles.nav}>
          <Text style={{fontSize: 20}}>MaskerAid</Text>
        </View>
        <PostFeed/>
    </View>
  );
}

const styles = StyleSheet.create({ 
  nav: {
    width: 100 + '%',
    height: 56,
    marginTop: 20,
    backgroundColor: 'rgb(250, 250, 250)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: config.styleConstants.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },

});
