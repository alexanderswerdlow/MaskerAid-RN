import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import config from '../config';
import {PostFeed} from '../containers';

export default function Home({navigation}) {
  return (
    <View style={{flex: 1, width: 100 + '%', height: 100 + '%'}}>
      <View style={styles.nav}>
        <Text style={{fontSize: 20}}>MaskerAid</Text>
      </View>
      <PostFeed />
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    width: `${100}%`,
    height: 56,
    backgroundColor:
      'rgb(' + global.Rvalue + ',' + global.Gvalue + ',' + global.Bvalue + ')',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: config.styleConstants.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
