/*
Author: Yamill Vallecillo
Source taken directly from: https://github.com/yamill/react-native-inviewport
Broken when installing as NPM Package, so copied directly into this file.
 */
'use strict';

import React, {Component} from 'react';
import {View, NativeMethodsMixin, Dimensions} from 'react-native';

export default class InViewPort extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {rectTop: 0, rectBottom: 0};
  }

  componentDidMount() {
    this._isMounted = true;

    if (!this.props.disabled) {
      this.startWatching();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.stopWatching();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.disabled) {
      this.stopWatching();
    } else {
      this.lastValue = null;
      this.startWatching();
    }
  }

  startWatching() {
    if (this.interval || !this._isMounted) {
      return;
    }
    this.interval = setInterval(() => {
      if (!this.myview) {
        return;
      }
      this.myview.measure((x, y, width, height, pageX, pageY) => {
        this.setState({
          rectTop: pageY,
          rectBottom: pageY + height,
          rectWidth: pageX + width,
        });
      });
      this.isInViewPort();
    }, this.props.delay || 100);
  }

  stopWatching() {
    this.interval = clearInterval(this.interval);
  }

  isInViewPort() {
    const window = Dimensions.get('window');
    const isVisible =
      this.state.rectBottom != 0 &&
      this.state.rectTop >= 0 &&
      this.state.rectBottom <= window.height &&
      this.state.rectWidth > 0 &&
      this.state.rectWidth <= window.width;
    if (this.lastValue !== isVisible) {
      this.lastValue = isVisible;
      this.props.onChange(isVisible);
    }
  }

  render() {
    return (
      <View
        collapsable={false}
        ref={(component) => {
          this.myview = component;
        }}
        {...this.props}>
        {this.props.children}
      </View>
    );
  }
}
