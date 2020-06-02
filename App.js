import 'react-native-gesture-handler';
import React, {Component} from 'react';
import MaskerAid from './src/MaskerAid.js';
import {ContextProvider} from './src/navigation/ContextProvider';

export default class App extends Component {
  render() {
    return (
      <ContextProvider>
        <MaskerAid />
      </ContextProvider>
    );
  }
}
