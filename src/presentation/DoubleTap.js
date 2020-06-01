/*
Taken mostly from: https://github.com/HandlebarLabs/react-native-examples-and-tutorials
Author: HandlebarLabs
*/
import React from 'react';
import {Vibration, TouchableWithoutFeedback} from 'react-native';

export default class DoubleTap extends React.Component {
  static defaultProps = {
    delay: 300,
    onDoubleTap: () => null,
  };

  lastTap = null;

  handleDoubleTap = () => {
    const now = Date.now();
    if (this.lastTap && now - this.lastTap < this.props.delay) {
      this.props.onDoubleTap();
      Vibration.vibrate();
    } else {
      this.lastTap = now;
    }
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.handleDoubleTap}>
        {this.props.children}
      </TouchableWithoutFeedback>
    );
  }
}
