import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {HueSlider, SaturationSlider, LightnessSlider} from 'react-native-color';
import tinycolor from 'tinycolor2';
import {GlobalContext} from '../navigation/ContextProvider';
import {withNavigation} from 'react-navigation';

class SettingsScreen extends React.Component {
  static contextType = GlobalContext;
  state = {
    modalVisible: false,
    color: tinycolor('#70c1b3').toHsl(),
  };

  componentDidMount = () => {
    const {theme} = this.context;
    this.setState({color: tinycolor(theme.colors.primary).toHsl(), count: 0});
    this._unsubscribe = this.props.navigation.addListener('blur', () => {
      this.updateProfile();
    });
  };

  componentWillUnmount() {
    this._unsubscribe();
  }

  updateProfile = async () => {
    clearTimeout(this.sliderTimeoutId);
    this.sliderTimeoutId = setTimeout(() => {
      const {theme, changeTheme} = this.context;
      changeTheme({
        ...theme,
        colors: {primary: tinycolor(this.state.color).toHexString()},
        dark: false,
      });
    }, 150);
  };

  updateHue = (h) => {
    this.setState({color: {...this.state.color, h}});
    this.updateProfile();
  };

  updateSaturation = (s) => {
    this.setState({color: {...this.state.color, s}});
    this.updateProfile();
  };
  updateLightness = (l) => {
    this.setState({color: {...this.state.color, l}});
    this.updateProfile();
  };

  render() {
    const overlayTextColor = tinycolor(this.state.color).isDark()
      ? '#FAFAFA'
      : '#222';
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionText}>Primary Theme COlor</Text>
          <TouchableOpacity
            onPress={() => this.setState({modalVisible: true})}
            style={[
              styles.colorPreview,
              {backgroundColor: tinycolor(this.state.color).toHslString()},
            ]}>
            <Text style={[styles.colorString, {color: overlayTextColor}]}>
              {tinycolor(this.state.color).toHexString()}
            </Text>
          </TouchableOpacity>

          <Text style={styles.componentText}>{'<HueSlider/>'}</Text>
          <HueSlider
            style={styles.sliderRow}
            gradientSteps={40}
            value={this.state.color.h}
            onValueChange={this.updateHue}
          />
          <Text style={styles.componentText}>{'<SaturationSlider/>'}</Text>
          <SaturationSlider
            style={styles.sliderRow}
            gradientSteps={20}
            value={this.state.color.s}
            color={this.state.color}
            onValueChange={this.updateSaturation}
          />
          <Text style={styles.componentText}>{'<LightnessSlider/>'}</Text>
          <LightnessSlider
            style={styles.sliderRow}
            gradientSteps={20}
            value={this.state.color.l}
            color={this.state.color}
            onValueChange={this.updateLightness}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    paddingBottom: 16,
  },
  content: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  headerText: {
    marginTop: 24,
    fontSize: 34,
    lineHeight: 41,
    ...Platform.select({
      android: {
        fontFamily: 'sans-serif-bold',
      },
      ios: {
        fontWeight: '700',
        letterSpacing: 0.41,
      },
    }),
  },
  sectionText: {
    marginTop: 32,
    color: '#222',
    fontSize: 22,
    lineHeight: 28,
    alignSelf: 'center',
    ...Platform.select({
      android: {
        fontFamily: 'sans-serif-medium',
      },
      ios: {
        fontWeight: '600',
        letterSpacing: 0.75,
      },
    }),
  },
  componentText: {
    marginTop: 16,
    color: '#222',
    fontSize: 16,
    lineHeight: 21,
    ...Platform.select({
      android: {
        fontFamily: 'sans-serif-medium',
      },
      ios: {
        fontWeight: '600',
        letterSpacing: -0.408,
      },
    }),
  },
  colorPreview: {
    marginTop: 12,
    flexDirection: 'column',
    alignSelf: 'center',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 3,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    shadowOpacity: 0.25,
  },
  gradient: {
    alignSelf: 'stretch',
    marginLeft: 12,
    marginTop: 12,
    marginBottom: 16,
    height: 4,
  },
  sliderRow: {
    alignSelf: 'stretch',
    marginLeft: 12,
    marginTop: 12,
  },
  colorString: {
    fontSize: 34,
    lineHeight: 41,
    ...Platform.select({
      android: {
        fontFamily: 'monospace',
      },
      ios: {
        fontFamily: 'Courier New',
        fontWeight: '600',
        letterSpacing: 0.75,
      },
    }),
  },
});

export default withNavigation(SettingsScreen);
