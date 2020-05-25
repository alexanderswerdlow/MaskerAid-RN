import React from 'react';
import {StyleSheet, View, SafeAreaView, StatusBar} from 'react-native';
import algoliasearch from 'algoliasearch';
import {InstantSearch} from 'react-instantsearch-native';
import SearchBox from '../search/SearchBox';
import InfiniteHits from '../search/InfiniteHits';

const searchClient = algoliasearch(
  'V6KRQS64EW',
  'b97a806d8df3bc6cc32a451e85cd0807',
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#252b33',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

class Search extends React.Component {
  root = {
    Root: View,
    props: {
      style: {
        flex: 1,
      },
    },
  };

  render() {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>
          <InstantSearch
            searchClient={searchClient}
            indexName="posts"
            root={this.root}>
            <SearchBox />
            <InfiniteHits />
          </InstantSearch>
        </View>
      </SafeAreaView>
    );
  }
}

export default Search;
