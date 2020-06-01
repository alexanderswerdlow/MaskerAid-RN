import React, {useState, useEffect, useContext} from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../navigation/ContextProvider';
import {ListItem} from 'react-native-elements';
import {ActivityIndicator, Colors} from 'react-native-paper';

export default function Messages({navigation}) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState([]); // Initial empty array of users
  const {user} = useContext(AuthContext);

  useEffect(() => {
    const subscriber = firestore()
      .collection(`users/${user.uid}/messages`)
      .onSnapshot((querySnapshot) => {
        const users = [];
        querySnapshot.forEach((documentSnapshot) => {
          console.log(documentSnapshot.id);
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
        navigation.navigate('Chat', {user: item});
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
      <Text style={styles.noMessagesText}>No Messages :(</Text>
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
