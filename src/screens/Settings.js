import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Settings,
} from 'react-native';
import {AuthContext} from '../navigation/AuthProvider';
import {withNavigation, NavigationEvents} from 'react-navigation';
import Slider from '@react-native-community/slider';

class SettingsScreen extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    global.Rvalue = 47;
    global.Gvalue = 141;
    global.Bvalue = 255;
    this.state = {
      Rvalue: global.Rvalue,
      Gvalue: global.Gvalue,
      Bvalue: global.Bvalue,
    };
  }

  changeR(Rvalue) {
    global.Rvalue = Rvalue;
    this.setState(() => {
      return {
        Rvalue: parseFloat(Rvalue),
      };
    });
  }

  changeG(Gvalue) {
    global.Gvalue = Gvalue;
    this.setState(() => {
      return {
        Gvalue: parseFloat(Gvalue),
      };
    });
  }

  changeB(Bvalue) {
    global.Bvalue = Bvalue;
    this.setState(() => {
      return {
        Bvalue: parseFloat(Bvalue),
      };
    });
  }

  render() {
    const {Rvalue} = this.state.Rvalue;
    const {Gvalue} = this.state.Gvalue;
    const {Bvalue} = this.state.Bvalue;
    return (
      <View>
        <Text style={styles.themeText}>Theme</Text>
        <View>
          <Slider
            style={{padding: 30, alignSelf: 'center', width: 250, hieght: 400}}
            step={1}
            minimumValue={0}
            maximumValue={255}
            minimumTrackTintColor={
              'rgb(' +
              global.Rvalue +
              ',' +
              global.Gvalue +
              ',' +
              global.Bvalue +
              ')'
            }
            onValueChange={this.changeR.bind(this)}
            value={Rvalue}
          />
        </View>
        <View>
          <Slider
            style={{padding: 30, alignSelf: 'center', width: 250, hieght: 400}}
            step={1}
            minimumValue={0}
            maximumValue={255}
            minimumTrackTintColor={
              'rgb(' +
              global.Rvalue +
              ',' +
              global.Gvalue +
              ',' +
              global.Bvalue +
              ')'
            }
            onValueChange={this.changeG.bind(this)}
            value={Gvalue}
          />
        </View>
        <View>
          <Slider
            style={{padding: 30, alignSelf: 'center', width: 250, hieght: 400}}
            step={1}
            minimumValue={0}
            maximumValue={255}
            minimumTrackTintColor={
              'rgb(' +
              global.Rvalue +
              ',' +
              global.Gvalue +
              ',' +
              global.Bvalue +
              ')'
            }
            onValueChange={this.changeB.bind(this)}
            value={Bvalue}
          />
        </View>
      </View>
    );
  }
}

export default withNavigation(SettingsScreen);

const styles = StyleSheet.create({
  themeText: {
    marginTop: 20,
    alignSelf: 'center',
    fontSize: 20,
  },
});
