/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import React, {Component} from 'react';
import MaskerAid from './src/MaskerAid.js';

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <MaskerAid />
      </NavigationContainer>
    );
  }
}
