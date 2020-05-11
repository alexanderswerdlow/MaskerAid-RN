/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import MaskerAid from "./src/MaskerAid.js";

export default class App extends Component{
  render() {
    return ( 
        <MaskerAid />
    );
  }
}
