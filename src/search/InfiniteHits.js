import React from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import PropTypes from 'prop-types';
import {connectInfiniteHits} from 'react-instantsearch-native';
import {Post} from '../presentation';
import firestore from '@react-native-firebase/firestore';

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  item: {
    padding: 10,
    flexDirection: 'column',
  },
  titleText: {
    fontWeight: 'bold',
  },
});

const InfiniteHits = ({hits, hasMore, refine, searchType}) => (
  <FlatList
    data={hits}
    keyExtractor={(item) => item.objectID}
    ItemSeparatorComponent={() => <View style={styles.separator} />}
    onEndReached={() => hasMore && refine()}
    renderItem={({item}) => {
      if (searchType == 'users') {
        //Hack to ensure we don't get into an undefined state
        if (!item.user) {
          return (
            <View style={styles.item}>
              <Text>
                {JSON.parse(JSON.stringify(item.displayName).slice(0, 100))}
              </Text>
            </View>
          );
        }
      } else {
        //Hack to ensure we don't get into an undefined state
        //If the toggle switches instantly but the data persists
        //we don't want to try render with that invalid data
        if (item.user) {
          return (
            <Post
              post={item}
              user={item.user}
              loc={firestore().collection('posts').doc(item.objectID)}
            />
          );
        }
      }
    }}
  />
);

InfiniteHits.propTypes = {
  hits: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasMore: PropTypes.bool.isRequired,
  refine: PropTypes.func.isRequired,
};

export default connectInfiniteHits(InfiniteHits);
