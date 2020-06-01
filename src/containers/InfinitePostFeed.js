/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {Post} from '../presentation';
import firestore from '@react-native-firebase/firestore';
import {withNavigation} from 'react-navigation';

const {height, width} = Dimensions.get('window');

class InfinitePostFeed extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      documentData: [],
      limit: 4,
      lastVisible: null,
      loading: false,
      refreshing: false,
      user: props.user,
      empty: false,
      following: props.following,
    };
  }

  onRefresh = () => {
    if (this._isMounted) {
      this.setState({refreshing: true});
      this.retrieveData(false);
      this.setState({refreshing: false});
    }
  };

  componentDidUpdate(prevProps) {
    if (this._isMounted && this.props.feedType !== prevProps.feedType) {
      this.retrieveData(false);
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.retrieveData(false);
    });
    /*this.__unsubscribe = this.props.navigation.addListener('blur', () => {
      console.log('Blur');
      this.unsubscribe();
    });*/
  }

  componentWillUnmount() {
    this._isMounted = false;
    this._unsubscribe();
    //this.__unsubscribe();
  }

  onResult = (documentSnapshots) => {
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
        documentData: [],
        loading: false,
        empty: true,
      });
      return;
    }
    // Cloud Firestore: Last Visible Document (Document ID To Start From For Proceeding Queries)
    let lastVisible = documentData[documentData.length - 1].key;
    // Set State

    this.setState({
      documentData: documentData,
      lastVisible: lastVisible,
    });
  };

  onError = (error) => {
    console.error(error);
  };

  // Retrieve Data
  retrieveData = async (increment) => {
    if (!this._isMounted) {
      return;
    }
    try {
      let query;
      if (
        this.props.feedType &&
        this.props.following &&
        this.props.following.length > 0
      ) {
        query = firestore()
          .collection(
            this.state.user ? `users/${this.state.user.uid}/posts` : 'posts',
          )
          .where('user.uid', 'in', this.props.following)
          .orderBy('post_day', 'desc')
          .orderBy('like_count', 'desc')
          .limit(this.state.limit + 1)
          .onSnapshot(this.onResult, this.onError);
        this.unsubscribe = query;
      } else {
        query = firestore()
          .collection(
            this.state.user ? `users/${this.state.user.uid}/posts` : 'posts',
          )
          .orderBy('post_date', 'desc')
          .orderBy('like_count', 'desc')
          .limit(this.state.limit + 1)
          .onSnapshot(this.onResult, this.onError);
        this.unsubscribe = query;
      }

      if (increment) {
        this.setState({limit: this.state.limit + 1, loading: false});
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Retrieve More Data
  retrieveMore = async () => {
    if (!this._isMounted) {
      return;
    }
    this.setState({loading: true});
    this.retrieveData(true);
    this.setState({loading: false});
  };

  // Render Header
  renderHeader = () => {
    try {
      if (this.props.onHeader) {
        return this.props.onHeader();
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
      // Check If Loading
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
    if (!this.state.empty) {
      return <View style={styles.ccontainer}></View>;
    } else {
      return (
        <View style={styles.ccontainer}>
          <Text style={styles.noMessagesText}>No Posts :(</Text>
        </View>
      );
    }
  };

  render() {
    return (
      <FlatList
        // Data
        data={this.state.documentData}
        // Render Items
        renderItem={(item, index) => {
          return (
            <Post
              currentIndex={index}
              currentVisibleIndex={this.state.currentVisibleIndex}
              post={item.item.post}
              user={item.item.user}
              loc={item.item.ref}
            />
          );
        }}
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
            refreshing={this.state.refreshing}
          />
        }
        onEndReached={this.retrieveMore}
        onEndReachedThreshold={1.0}
        onMomentumScrollEnd={this.retrieveMore}
      />
    );
  }
}

export default withNavigation(InfinitePostFeed);

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
  vidcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
