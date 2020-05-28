import React, {useState, useEffect, useContext} from 'react';
import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../navigation/AuthProvider';

export default function Users({navigation}) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState([]); // Initial empty array of users
  const {user} = useContext(AuthContext);

  useEffect(() => {
    const subscriber = firestore()
      .collection(`users/${user.uid}/messages`)
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

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={users}
      renderItem={({item}) => (
        <TouchableHighlight
          onPress={() => {
            navigation.navigate('Chat', {user: {uid: item.uid}});
          }}>
          <View
            style={{
              height: 50,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>User Name: {item.displayName}</Text>
          </View>
        </TouchableHighlight>
      )}
    />
  );
}
