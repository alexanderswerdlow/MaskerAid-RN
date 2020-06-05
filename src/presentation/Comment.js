import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import * as RootNavigation from '../navigation/RootNavigation.js';

export default function Comment(props) {
  const [heart, setHeart] = useState('hearto');
  const [heartIconColor, setHeartIconColor] = useState('rgb(0,0,0)');
  useEffect(() => {
    if (props.liked) {
      setHeart('heart');
      setHeartIconColor('rgb(252,61,57)');
    } else {
      setHeart('hearto');
      setHeartIconColor('rgb(0,0,0)');
    }
  });
  return (
    <View style={{flex: 1, width: 100 + '%'}}>
      <View style={styles.userCaption}>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <TouchableOpacity
            onPress={() => {
              RootNavigation.navigate('ViewProfile', {
                user: props.user,
              });
            }}>
            <Image
              style={styles.userPic}
              source={{
                uri: props.user.photoURL,
              }}
            />
          </TouchableOpacity>
          <View style={styles.caption}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  RootNavigation.navigate('ViewProfile', {
                    user: props.user,
                  });
                }}>
                <Text>
                  <Text style={{fontWeight: 'bold'}}>
                    {props.user.displayName}{' '}
                  </Text>
                  {props.comment.text}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{fontWeight: 'bold'}}>
              {props.comment.like_count} Likes
            </Text>
          </View>
        </View>

        <View
          style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
          <TouchableOpacity
            onPress={() => {
              if (props.liked) {
                props.removeLike(props.id, props.comment.like_count);
              } else {
                props.addLike(props.id, props.comment.like_count);
              }
            }}>
            <Icon name={heart} style={{color: heartIconColor}} size={17} />
          </TouchableOpacity>
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
