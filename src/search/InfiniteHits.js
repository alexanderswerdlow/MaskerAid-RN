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
      console.log(item.user);
      if (searchType == 'users') {
        return (
          <View style={styles.item}>
            <Text>
              {JSON.parse(JSON.stringify(item.displayName).slice(0, 100))}
            </Text>
          </View>
        );
      } else {
        return (
          <Post
            post={item.post}
            user={item.user}
            loc={firestore().collection('posts').doc(item.objectID)}
          />
        );
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
