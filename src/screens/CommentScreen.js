import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import config from '../config';
import IosIcon from 'react-native-vector-icons/Ionicons';
import CommentFeed from '../containers/CommentFeed';

export default function Comment(props) {
  const w = Dimensions.get('window');

  return (
    <View style={{flex: 1, width: 100 + '%', height: 100 + '%'}}>
      <View style={styles.nav}>
        <IosIcon size={30} style={{marginLeft: 20}} name="ios-arrow-back" />
        <Text style={styles.CommentText}>Comments</Text>
      </View>
      <CommentFeed />
      <View
        style={{
          flexDirection: 'row',
          width: w.width,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TextInput style={styles.TextInput} />
        <TouchableOpacity style={{alignItems: 'center'}}>
          <Text>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    width: `${100}%`,
    height: 56,
    marginTop: 20,
    backgroundColor: 'rgb(250, 250, 250)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: config.styleConstants.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  CommentText: {
    fontSize: 20,
    flex: 1,
    paddingRight: 21,
    textAlign: 'center',
  },

  TextInput: {
    height: 40,
    borderColor: 'blue',
    borderWidth: 1,
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 13,
    paddingLeft: 10,
  },
});
