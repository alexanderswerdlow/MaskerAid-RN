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
// Screen Dimensions
const {height, width} = Dimensions.get('window');

export default class InfinitePostFeed extends React.Component {
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
    };
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    this.retrieveData(false);
    this.setState({refreshing: false});
  };

  // Component Did Mount
  componentDidMount = () => {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.retrieveData(false);
    });
  };

  componentWillUnmount() {
    this._unsubscribe();
  }

  onResult = (documentSnapshots) => {
    let documentData = [];
    documentSnapshots.forEach((postSnapshot) => {
      documentData.push({
        key: postSnapshot.data().post_date,
        post: postSnapshot.data(),
        user: postSnapshot.data().user,
        ref: postSnapshot.ref,
        like_count: postSnapshot.data().like_count,
      });
    });

    if (documentData.length == 0) {
      this.setState({
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
    try {
      let initialQuery = await firestore()
        .collection(
          this.state.user ? `users/${this.state.user.uid}/posts` : 'posts',
        )
        .orderBy('post_date', 'desc')
        .limit(this.state.limit + 1)
        .onSnapshot(this.onResult, this.onError);
      if (increment) {
        this.setState({limit: this.state.limit + 1, loading: false});
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Retrieve More Data
  retrieveMore = async () => {
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
        console.log('loading...');
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
