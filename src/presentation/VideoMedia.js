import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import InViewPort from './InViewPort';
import Video from 'react-native-video';

export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paused: false,
      source: props.source,
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

  onBuffer = () => {
    //console.log('Video Buffer');
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
          muted={true}
          resizeMode="cover"
          shouldPlay={false}
          repeat={true}
          style={{width: 300, height: 300}}
          paused={this.state.paused}
          onError={this.videoError}
          onBuffer={this.onBuffer}
        />
      );
    } else {
      console.log(this.props.source.uri);
      return <Text>Words</Text>;
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <InViewPort onChange={this.handlePlaying}>{this.Media()}</InViewPort>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
