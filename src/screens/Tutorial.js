/* eslint-disable max-len */
import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Login from './Login';
import Ionicons from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
  text: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 15,
  },
  title: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 16,
  },
});

const slides = [
  {
    key: 1,
    title: 'Get started with MaskerAid!',
    text:
      'As you safely quarantine, one way to productively spend your time is to make homemade masks! MaskerAid offers you a creative platform through which you can share your unique mask creations with the world, and gather inspiration for your next one!',
    image: require('../images/socialDistancing.png'),
    backgroundColor: '#FF585E',
  },
  {
    key: 2,
    title: 'Step 1: Login with a Gmail account.',
    text:
      'MaskerAid uses Gmail to create your account, making it super easy and eliminates the need to remember yet ANOTHER password.',
    image: require('../images/gmail.png'),
    backgroundColor: '#71F79F',
  },
  {
    key: 3,
    title: 'Step 2: Take a picture or video showing off your masks!',
    text:
      "You can upload photos you've taken/edited already, or simply use the camera feature within MaskerAid to get a photo of your mask!",
    image: require('../images/maskpic.png'),
    backgroundColor: '#3DD6D0',
  },
  {
    key: 4,
    title:
      'Step 3: Upload the picture with a cool caption! It could be information on what you used for the mask or how you made it!',
    text: 'With MaskerAid, you can even use emojis to go along with your post!',
    image: require('../images/post.png'),
    backgroundColor: '#15B097',
  },
  {
    key: 5,
    title:
      'Step 4: You are done! You can follow and like mask content from other users as well!',
    text:
      'Following another user will make sure their content will appear on your home feed.\nAdditionally, you can directly message users privately if you would like to reach out or just talk with friends!\n\nWe hope you enjoy MaskerAid and are staying safe in these uncertain times.',
    image: require('../images/180.png'),
    backgroundColor: '#100F0f',
  },
];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRealApp: false,
    };
  }
  _renderItem = ({item}) => {
    console.log(item);
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: item.backgroundColor,
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingBottom: 100,
        }}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={item.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };
  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    this.setState({showRealApp: true});
  };
  render() {
    if (this.state.showRealApp) {
      return <Login />;
    } else {
      return (
        <AppIntroSlider
          renderItem={this._renderItem}
          data={slides}
          onDone={this._onDone}
          showSkipButton={true}
          onSkip={this._onSkip}
          keyExtractor={(item, index) => index.toString()}
        />
      );
    }
  }
}
