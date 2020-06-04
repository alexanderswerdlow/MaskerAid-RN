/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {Post} from '../presentation';
import {
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
const {height, width} = Dimensions.get('window');
import {Switch} from 'react-native-paper';

export default class InfinitePostFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documentData: [],
      limit: 10,
      lastVisible: null,
      loading: false,
      refreshing: false,
      user: props.user,
      updating: true,
      isSwitchOn: false,
    };
  }

  update = (no_load) => {
    try {
      this.retrieveData(false, no_load, false);
    } catch (error) {
      console.log(error);
    }
  };

  onRefresh = () => {
    this.setState({
      documentData: [],
    });
    this.update(false);
  };

  // Component Did Mount
  componentDidMount = () => {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({updating: true});
      this.update(true);
      this.setState({updating: false});
    });
  };

  componentWillUnmount() {
    this._unsubscribe();
  }

  // Retrieve Data
  retrieveData = async (retrieveMore, no_load, follower_feed) => {
    try {
      if (!retrieveMore) {
        this.setState({
          loading: no_load ? false : true,
        });
      } else {
        this.setState({
          refreshing: true,
        });
      }
      // Cloud Firestore: Query
      let initialQuery;

      if (
        (follower_feed || this.state.isSwitchOn) &&
        this.props.following &&
        this.props.following.length > 0
      ) {
        console.log('here');
        if (!retrieveMore) {
          initialQuery = await firestore()
            .collection(
              this.state.user ? `users/${this.state.user.uid}/posts` : 'posts',
            )
            .where('user.uid', 'in', this.props.following)
            .orderBy('post_date', 'desc')
            .limit(this.state.limit);
        } else {
          initialQuery = await firestore()
            .collection(
              this.state.user ? `users/${this.state.user.uid}/posts` : 'posts',
            )
            .where('user.uid', 'in', this.props.following)
            .orderBy('post_date', 'desc')
            .startAfter(this.state.lastVisible)
            .limit(this.state.limit);
        }
      } else {
        console.log('down');
        if (!retrieveMore) {
          initialQuery = await firestore()
            .collection(
              this.state.user ? `users/${this.state.user.uid}/posts` : 'posts',
            )
            .orderBy('post_date', 'desc')
            .limit(this.state.limit);
        } else {
          initialQuery = await firestore()
            .collection(
              this.state.user ? `users/${this.state.user.uid}/posts` : 'posts',
            )
            .orderBy('post_date', 'desc')
            .startAfter(this.state.lastVisible)
            .limit(this.state.limit);
        }
      }

      // Cloud Firestore: Query Snapshot
      let documentSnapshots = await initialQuery.get();
      // Cloud Firestore: Document Data
      let documentData = [];
      documentSnapshots.forEach((postSnapshot) => {
        documentData.push({
          key: postSnapshot.data().post_date,
          post: postSnapshot.data(),
          user: postSnapshot.data().user,
          ref: postSnapshot.ref,
        });
      });

      if (documentData.length == 0) {
        this.setState({
          loading: false,
        });
        return;
      }

      // Cloud Firestore: Last Visible Document (Document ID To Start From For Proceeding Queries)
      let lastVisible = documentData[documentData.length - 1].key;
      // Set State

      if (!retrieveMore) {
        this.setState({
          documentData: documentData,
          lastVisible: lastVisible,
          loading: false,
        });
      } else {
        this.setState({
          documentData: [...this.state.documentData, ...documentData],
          lastVisible: lastVisible,
          refreshing: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Retrieve More Data
  retrieveMore = async () => {
    this.retrieveData(true, false, false);
  };

  _onToggleSwitch = () => {
    this.setState({isSwitchOn: !this.state.isSwitchOn, lastVisible: null});
    try {
      this.setState({
        documentData: [],
      });
      this.retrieveData(false, false, true);
    } catch (error) {
      console.log(error);
    }
  };

  // Render Header
  renderHeader = () => {
    try {
      if (this.props.onHeader) {
        return this.props.onHeader();
      } else if (this.props.feedType == 'dynamic') {
        return (
          <Switch
            value={this.state.isSwitchOn}
            onValueChange={this._onToggleSwitch}
          />
        );
      } else {
        return <Text style={styles.headerText}>Posts</Text>;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Render Footer
  renderFooter = () => {
    try {
      if (this.state.loading) {
        return <ActivityIndicator />;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  };

  listEmpty = () => {
    return (
      <View style={styles.ccontainer}>
        {!this.state.updating && (
          <Text style={styles.noMessagesText}>No Posts :(</Text>
        )}
      </View>
    );
  };

  onDelete = (index) => {
    console.log('delete: ' + index);
    var array = [...this.state.documentData];
    console.log(array);
    array.splice(index, 1);
    console.log(array);
    this.setState({
      documentData: array,
      limit: this.state.limit - 1,
    });
  };

  _renderItem = (item, index) => {
    return (
      <Post
        post={item.post}
        user={item.user}
        loc={item.ref}
        onDelete={() => {
          this.onDelete(index);
        }}
      />
    );
  };

  render() {
    return (
      <FlatList
        // Data
        data={this.state.documentData}
        renderItem={({item, index}) => this._renderItem(item, index)} //Passing as object from here.
        // Item Key
        keyExtractor={(item, index) => String(index)}
        // Header (Title)
        ListHeaderComponent={this.renderHeader}
        // Footer (Activity Indicator)
        ListFooterComponent={this.renderFooter}
        ListEmptyComponent={this.listEmpty}
        refreshControl={
          <RefreshControl
            onRefresh={this.onRefresh}
            refreshing={this.state.loading}
          />
        }
        // On End Reached (Takes a function)
        onEndReached={this.retrieveMore}
        // How Close To The End Of List Until Next Data Request Is Made
        onEndReachedThreshold={1}
        // Refreshing (Set To True When End Reached)
        refreshing={this.state.refreshing}
      />
    );
  }
}
// Styles
const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
  },
  headerText: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '600',
    color: '#000',
    marginLeft: 12,
    marginBottom: 12,
  },
  itemContainer: {
    height: 80,
    width: width,
    borderWidth: 0.2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
  },

  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  noMessagesText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 30,
  },
  ccontainer: {
    justifyContent: 'center',
    flex: 1,
    margin: 10,
  },
});
