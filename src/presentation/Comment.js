import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import config from '../config';
import Icon from 'react-native-vector-icons/AntDesign';

export default function Comment(props) {
  return (
    <View style={{flex: 1, width: 100 + '%'}}>
      <View style={styles.userCaption}>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <Image
            style={styles.userPic}
            source={{
              uri: 'https://reactnative.dev/img/tiny_logo.png',
            }}
          />
          <View style={styles.caption}>
            <View>
              <Text>
                <Text style={{fontWeight: 'bold'}}>{props.name} </Text>
                {props.caption}
              </Text>
            </View>
            <Text style={{fontWeight: 'bold'}}>229 Likes</Text>
          </View>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
          <Icon name="hearto" size={14} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userCaption: {
    width: 100 + '%',
    backgroundColor: 'rgb(255,255,255)',
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    minHeight: 50,
  },

  userPic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  caption: {
    marginLeft: 10,
    flexDirection: 'column',
    flex: 1,
    marginTop: 5,
  },

  likeB: {
    alignItems: 'center',
  },
});
