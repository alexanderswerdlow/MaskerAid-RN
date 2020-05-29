import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import config from '../config';
import {PostFeed} from '../containers';
import {AuthContext} from '../navigation/AuthProvider';
import {Button} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
export default function Home({navigation}) {
  const {colors} = useTheme();
  return (
    <View style={{flex: 1, width: 100 + '%', height: 100 + '%'}}>
      <Button mode="contained">Example Button</Button>

      <PostFeed navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    width: `${100}%`,
    height: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: config.styleConstants.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
