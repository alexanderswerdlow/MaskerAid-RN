import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import config from '../config';
import {PostFeed} from '../containers';
import {AuthContext} from '../navigation/AuthProvider';
import {Button} from 'react-native-paper';

export default function Home({navigation}) {
  const {theme, changeTheme} = useContext(AuthContext);
  return (
    <View style={{flex: 1, width: 100 + '%', height: 100 + '%'}}>
      <View style={styles.nav}>
        <Button
          onPress={() => {
            changeTheme({
              primary: theme.primary == '#34345c' ? '#DE6860' : '#34345c',
            });
          }}>
          Change
        </Button>
        <Text style={{color: theme.primary}}>Color</Text>
      </View>
      <PostFeed navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    width: `${100}%`,
    height: 56,
    backgroundColor: 'rgb('+global.Rvalue +','+global.Gvalue+','+global.Bvalue+')',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: config.styleConstants.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
