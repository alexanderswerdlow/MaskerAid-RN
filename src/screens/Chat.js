import React, {useCallback, useState, useEffect, useContext} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {ActivityIndicator} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {GlobalContext} from '../navigation/ContextProvider';

export default function Chat(props) {
  const [messages, setMessages] = useState([]);
  const {user} = useContext(GlobalContext);
  const [loading, setLoading] = useState(true); // Set loading to true on component mount

  useEffect(() => {
    firestore()
      .doc(`users/${user.uid}/messages/${props.route.params.user.uid}`)
      .set(props.route.params.user);

    firestore()
      .doc(`users/${props.route.params.user.uid}/messages/${user.uid}`)
      .set({
        uid: user.uid,
        photoURL: user.photoURL,
        email: user.email,
        displayName: user.displayName,
      });
    const subscriber = firestore()
      .collection(
        `users/${user.uid}/messages/${props.route.params.user.uid}/messages`,
      )
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

    const temp = newMessages[0];
    const createdAt = Date.parse(temp.createdAt);
    newMessages[0].createdAt = createdAt;
    newMessages[0].user.avatar = user.photoURL;
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
