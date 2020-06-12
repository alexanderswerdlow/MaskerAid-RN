/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {FlatList, Text, View, Alert} from 'react-native';
import {Post} from '../presentation';
import {ActivityIndicator, StyleSheet, Dimensions, RefreshControl} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Switch} from 'react-native-paper';
import {Tooltip} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {GlobalContext} from '../navigation/ContextProvider';
const {height, width} = Dimensions.get('window');

export default class InfinitePostFeed extends React.Component {
  static contextType = GlobalContext;

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

  componentDidMount = () => {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({updating: true});
      this.retrieveData(false, true);
    });
  };

  componentWillUnmount() {
    this._unsubscribe(); // Unsubscribe listener on unmount
  }

  // On pull-to-refresh (manual)
  onRefresh = () => {
    this.setState({documentData: []}); // Clear all posts
    this.retrieveData(false, false);
  };

  // Retrieve More Data (lazy-loading)
  retrieveMore = async () => {
    this.retrieveData(true, false); // Incrementally update array
  };

  // Called when switching feed  types
  toggleFeed = () => {
    this.retrieveData(false, false);
  };

  // Retrieve Data
  retrieveData = async (retrieveMore, no_load) => {
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

      // Base firestore query
      let postQuery = firestore().collection(this.state.user ? `users/${this.state.user.uid}/posts` : 'posts');

      // If feed type is following only and valid
      if (this.state.isSwitchOn && this.props.following && this.props.following.length > 0) {
        postQuery = postQuery.where('user.uid', 'in', this.props.following).orderBy('post_date', 'desc');
        if (!retrieveMore) {
          postQuery = postQuery.limit(this.state.limit);
        } else {
          postQuery = postQuery.startAfter(this.state.lastVisible).limit(this.state.limit);
        }
      } else if (this.state.isSwitchOn) {
        // If feed type is following only and doesn't follow anyone
        Alert.alert("You aren't following anyone yet");
        this.setState({isSwitchOn: false});
      } else {
        postQuery = postQuery.orderBy('post_date', 'desc');
        if (!retrieveMore) {
          postQuery = postQuery.limit(this.state.limit);
        } else {
          postQuery = postQuery.startAfter(this.state.lastVisible).limit(this.state.limit);
        }
      }

      let documentSnapshots = await postQuery.get(); // Make DB Call

      let documentData = [];
      documentSnapshots.forEach((postSnapshot) => {
        documentData.push({
          key: postSnapshot.data().post_date,
          post: postSnapshot.data(),
          user: postSnapshot.data().user,
          ref: postSnapshot.ref,
        });
      });

      this.setState({updating: false});

      if (documentData.length == 0) {
        // Empty posts feed
        this.setState({
          loading: false,
        });
        return;
      }

      // Last Visible Document
      let lastVisible = documentData[documentData.length - 1].key;

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

  _onToggleSwitch = () => {
    try {
      this.setState(
        {
          documentData: [],
          isSwitchOn: !this.state.isSwitchOn,
        },
        this.toggleFeed,
      );
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
        const {theme} = this.context;
        return (
          <>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.headerText}>Posts</Text>
              <View style={{flexDirection: 'row'}}>
                <Switch
                  style={{marginTop: 10, marginRight: 10}}
                  value={this.state.isSwitchOn}
                  onValueChange={this._onToggleSwitch}
                />
                <Tooltip width={280} popover={<Text>View Posts Only From Users You Follow</Text>}>
                  <Ionicons
                    style={{marginTop: 3, marginRight: 10}}
                    name="ios-person"
                    size={43}
                    color={theme.colors.primary}
                  />
                </Tooltip>
              </View>
            </View>
          </>
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
        {!this.state.updating && <Text style={styles.noMessagesText}>No Posts :(</Text>}
      </View>
    );
  };

  onDelete = (index) => {
    var array = [...this.state.documentData];
    array.splice(index, 1);
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
        index={index}
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
        refreshControl={<RefreshControl onRefresh={this.onRefresh} refreshing={this.state.loading} />}
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
    marginTop: 7,
    marginBottom: 5,
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
