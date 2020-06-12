import React, {useCallback, useState, useEffect, useContext} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {ActivityIndicator} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {GlobalContext} from '../navigation/ContextProvider';
import Fire from '../util/Fire';

export default function Chat(props) {
  const [messages, setMessages] = useState([]);
  const {user} = useContext(GlobalContext);
  const [loading, setLoading] = useState(true); // Set loading to true on component mount

  useEffect(() => {
    firestore().doc(`users/${user.uid}/messages/${props.route.params.user.uid}`).set(props.route.params.user);
    firestore().doc(`users/${props.route.params.user.uid}/messages/${user.uid}`).set(Fire.sanitizeUser(user));

    const subscriber = firestore()
      .collection(`users/${user.uid}/messages/${props.route.params.user.uid}/messages`)
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((documentSnapshot) => {
          messages.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setMessages(messages);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  const onSend = useCallback((newMessages) => {
    setMessages((prevMessages) => [...newMessages, ...prevMessages]);
    newMessages[0].createdAt = Date.parse(newMessages[0].createdAt);
    newMessages[0].user.avatar = user.photoURL;
    const batch = firestore().batch();
    const loc = firestore().doc(`users/${user.uid}/messages/${props.route.params.user.uid}/messages`).doc();
    batch.set(loc, newMessages[0]);
    const postsRef = firestore().doc(`users/${props.route.params.user.uid}/messages/${user.uid}/messages/${loc.id}`);
    batch.set(postsRef, newMessages[0]);
    batch.commit(); // Write message to both users profile's
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
