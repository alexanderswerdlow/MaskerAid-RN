import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import InViewPort from './InViewPort';
import Video from 'react-native-video';
import {ActivityIndicator} from 'react-native-paper';
export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paused: false,
      source: props.source,
      opacity: 0,
    };
  }

  pauseVideo = () => {
    this.setState({paused: true});
  };

  playVideo = () => {
    this.setState({paused: false});
  };

  handlePlaying = (isVisible) => {
    isVisible ? this.playVideo() : this.pauseVideo();
  };

  componentWillUnmount() {
    this.setState({paused: true});
  }

  onError = () => {
    console.log('Video Error');
  };

  onLoadStart = () => {
    this.setState({opacity: 1});
  };

  onLoad = () => {
    this.setState({opacity: 0});
  };

  onBuffer = ({isBuffering}) => {
    this.setState({opacity: isBuffering ? 1 : 0});
  };

  Media = () => {
    if (this.props.source) {
      return (
        <Video
          ref={(ref) => {
            this.video = ref;
          }}
          source={{uri: this.props.source}}
          rate={1.0}
          volume={1.0}
          muted={this.props.muted}
          resizeMode="cover"
          shouldPlay={false}
          repeat={true}
          style={{width: 300, height: 300}}
          paused={this.state.paused}
          onError={this.videoError}
          onBuffer={this.onBuffer}
          onLoadStart={this.onLoadStart}
          onLoad={this.onLoad}
        />
      );
    } else {
      return <View></View>;
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <InViewPort onChange={this.handlePlaying}>
          {this.Media()}
          <ActivityIndicator animating size="large" style={[styles.indicator, {opacity: this.state.opacity}]} />
        </InViewPort>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    position: 'absolute',
    top: 130,
    left: 70,
    right: 70,
    height: 50,
  },
});
