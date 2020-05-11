import React from 'react';
import {View, StyleSheet, Button} from 'react-native';

export default function Login({navigation}) {
  return (
    <View style={styles.container}>
      <Button
        title={'Login'}
        style={styles.input}
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});
