import React from 'react';
import {StyleSheet, View, SafeAreaView, StatusBar} from 'react-native';
import algoliasearch from 'algoliasearch';
import {InstantSearch} from 'react-instantsearch-native';
import SearchBox from '../search/SearchBox';
import InfiniteHits from '../search/InfiniteHits';
import {ToggleButton, Title} from 'react-native-paper';
import {connectStateResults} from 'react-instantsearch-native';
import {AuthContext} from '../navigation/AuthProvider';

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
    return (
      <Title style={{marginLeft: 30, marginTop: 15}}>
        No query was entered
      </Title>
    );
  }
};

const Results = connectStateResults(({searchState, searchResults, children}) =>
  searchResults && searchResults.nbHits !== 0 ? (
    children
  ) : (
    <SearchNotice query={searchState.query} />
  ),
);

class Search extends React.Component {
  static contextType = AuthContext;
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
    const {theme} = this.context;
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
              style={{marginLeft: 30}}
              onValueChange={(value) => {
                if (value) {
                  this.setState({value});
                }
              }}
              value={this.state.value}>
              <ToggleButton
                color={theme.colors.primary}
                icon="account-circle"
                value="users"
              />
              <ToggleButton
                color={theme.colors.primary}
                icon="note"
                value="posts"
              />
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
