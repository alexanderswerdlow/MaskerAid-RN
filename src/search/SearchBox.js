import React from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {connectSearchBox} from 'react-instantsearch-native';
import {Searchbar, DefaultTheme} from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 48,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

const SearchBox = ({currentRefinement, refine}) => (
  <View style={styles.container}>
    <Searchbar
      placeholder="Search"
      onChangeText={(value) => refine(value)}
      value={currentRefinement}
      theme={DefaultTheme}
    />
  </View>
);

SearchBox.propTypes = {
  currentRefinement: PropTypes.string.isRequired,
  refine: PropTypes.func.isRequired,
};

export default connectSearchBox(SearchBox);
