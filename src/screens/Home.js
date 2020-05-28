import React, {useState} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import config from '../config';
import {PostFeed} from '../containers';

export default function Home({navigation}) {
  const [renderer, setRerender] = useState(false);
  return (
    <View style={{flex: 1, width: 100 + '%', height: 100 + '%'}}>
      <View style={styles.nav}>
        <Text style={{fontSize: 20}}>MaskerAid</Text>
      </View>
      <Button
        title="Refresh"
        onPress={() => {
          setRerender(!renderer);
        }}
      />
      <PostFeed refresh={renderer} />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});
