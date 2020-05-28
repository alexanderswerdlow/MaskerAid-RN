import 'react-native-gesture-handler';
import React, {Component} from 'react';
import MaskerAid from './src/MaskerAid.js';
import {AuthProvider} from './src/navigation/AuthProvider';
import ThemeContext from './src/ThemeContext';

export default class App extends Component {
  render() {
    const theme =
      'rgb(' + global.Rvalue + ',' + global.Gvalue + ',' + global.Bvalue + ')';
    return (
      <AuthProvider>
        <MaskerAid />
      </AuthProvider>
    );
  }
}
