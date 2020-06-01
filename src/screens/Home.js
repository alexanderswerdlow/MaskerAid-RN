import React from 'react';
import {View} from 'react-native';
import {PostFeed} from '../containers';
import {Button} from 'react-native-paper';

export default function Home({navigation}) {
  return (
    <View style={{flex: 1, width: 100 + '%', height: 100 + '%'}}>
      <PostFeed navigation={navigation} />
    </View>
  );
}
