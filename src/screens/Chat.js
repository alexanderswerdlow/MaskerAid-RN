import React, {useCallback, useState, useEffect, useContext} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../navigation/AuthProvider';

export default function Chat(props) {
  const [messages, setMessages] = useState([]);
  const {user} = useContext(AuthContext);
  const [loading, setLoading] = useState(true); // Set loading to true on component mount

  useEffect(() => {
    /*firestore().doc(`users/${user.uid}/messages`).add({
      name: 'Ada Lovelace',
    });*/
    const subscriber = firestore()
      .collection(
        `users/${user.uid}/messages/${props.route.params.user.uid}/messages`,
      )
      .onSnapshot((querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((documentSnapshot) => {
          messages.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setMessages(messages);
        console.log(messages[0]);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  const onSend = useCallback((newMessages) => {
    setMessages((prevMessages) => [...newMessages, ...prevMessages]);
    //console.log(newMessages[0]);

    const temp = newMessages[0];
    const createdAt = Date.parse(temp.createdAt);
    newMessages[0].createdAt = createdAt;

    const batch = firestore().batch();
    const loc = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('messages')
      .doc(props.route.params.user.uid)
      .collection('messages')
      .doc();
    batch.set(loc, newMessages[0]);
    const postsRef = firestore()
      .collection('users')
      .doc(props.route.params.user.uid)
      .collection('messages')
      .doc(user.uid)
      .collection('messages')
      .doc(loc.id);
    batch.set(postsRef, JSON.parse(JSON.stringify(newMessages[0])));
    batch.commit();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => onSend(newMessages)}
      user={{
        _id: user.uid,
      }}
    />
  );
}
