import React, {useState, useEffect} from 'react';
import {FlatList, View, Text, TouchableOpacity, StyleSheet, RefreshControl} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {ListItem} from 'react-native-elements';
import {ActivityIndicator, Colors} from 'react-native-paper';

export default function UserList({route, navigation}) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState([]); // Initial empty array of users

  useEffect(() => {
    const subscriber = firestore()
      .collection(`users/${route.params.user.uid}/${route.params.listType}`)
      .onSnapshot((querySnapshot) => {
        const users = [];
        querySnapshot.forEach((documentSnapshot) => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setUsers(users);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.push('ViewProfile', {user: item});
      }}>
      <ListItem
        title={item.displayName}
        subtitle={item.email}
        leftAvatar={{
          source: item.photoURL && {uri: item.photoURL},
        }}
        bottomDivider
        chevron
      />
    </TouchableOpacity>
  );

  const listEmpty = () => (
    <View style={styles.container}>
      <Text style={styles.noMessagesText}>
        {route.params.listType == 'followers' ? 'This user has no followers' : 'This user is not following anyone'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator animating={true} color={Colors.red800} />
      </View>
    );
  }

  return (
    <FlatList
      refreshControl={<RefreshControl refreshing={loading} />}
      keyExtractor={(item, index) => index.toString()}
      data={users}
      renderItem={renderItem}
      ListEmptyComponent={listEmpty}
    />
  );
}

const styles = StyleSheet.create({
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
  container: {
    justifyContent: 'center',
    flex: 1,
    margin: 10,
  },
});
