import React, {Component} from 'react';
import {Text} from 'react-native';
import {Provider, Snackbar} from 'react-native-paper';

export default class SnackBarComponent extends Component {
  //you dont need to maintain this local state anymore for this purpose
  /*constructor(props) {
    super(props);
    this.state = {
      snackbarVisible: false
    }
  }*/

  render() {
    return (
      <Provider>
        <Snackbar
          visible={this.props.snackbarVisible}
          onDismiss={() => this.props.dismissSnack()} //use that function here
        >
          <Text>{this.props.snackbarText}</Text>
        </Snackbar>
      </Provider>
    );
  }
}
