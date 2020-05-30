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
import CommentFeed from '../containers/CommentFeed';

export default function Comment(props) {
  const w = Dimensions.get('window');

  return (
    <View style={{flex: 1, width: 100 + '%', height: 100 + '%'}}>
      <View style={styles.nav}>
        <Text style= {styles.CommentText}>Comments</Text>
      </View>
      <CommentFeed id = {props.route.params.post}/>
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
  },

  TextInput: {
    height: 40,
    borderColor: 'blue',
    borderWidth: 1,
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 13,
    paddingLeft: 10,
  },
});
