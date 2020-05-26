import React from 'react';
import {StyleSheet, View, SafeAreaView, StatusBar} from 'react-native';
import algoliasearch from 'algoliasearch';
import {InstantSearch} from 'react-instantsearch-native';
import SearchBox from '../search/SearchBox';
import InfiniteHits from '../search/InfiniteHits';
import {ToggleButton, Title} from 'react-native-paper';
import {connectStateResults} from 'react-instantsearch-native';

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

const SearchNotice = (props) => {
  if (props.query) {
    return <Title>No results have been found for: {props.query}</Title>;
  } else {
    return <Title>No query was entered</Title>;
  }
};

const Results = connectStateResults(({searchState, searchResults, children}) =>
  searchResults && searchState.query && searchResults.nbHits !== 0 ? (
    children
  ) : (
    <SearchNotice query={searchState.query} />
  ),
);

class Search extends React.Component {
  root = {
    Root: View,
    props: {
      style: {
        flex: 1,
      },
    },
  };

  state = {
    value: 'users',
  };

  render() {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>
          <InstantSearch
            searchClient={searchClient}
            indexName={this.state.value}
            root={this.root}>
            <SearchBox />
            <ToggleButton.Row
              onValueChange={(value) => {
                if (value) {
                  this.setState({value});
                }
              }}
              value={this.state.value}>
              <ToggleButton icon="account-circle" value="users" />
              <ToggleButton icon="note" value="posts" />
            </ToggleButton.Row>
            <Results>
              <InfiniteHits searchType={this.state.value} />
            </Results>
          </InstantSearch>
        </View>
      </SafeAreaView>
    );
  }
}

export default Search;
