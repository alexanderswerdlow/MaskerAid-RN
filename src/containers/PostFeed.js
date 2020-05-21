/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {FlatList, Text, View} from 'react-native';
import {Post} from '../presentation';
import {ActivityIndicator, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';

function PostFeed(props) {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection(
        props.userData ? `users/${props.userData.uid}/posts` : 'posts',
      )
      .orderBy('post_date', 'desc')
      .limit(20)
      .onSnapshot((querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((postSnapshot) => {
          posts.push({
            key: postSnapshot.data().post_date,
            post: postSnapshot.data(),
            ref: postSnapshot.ref,
          });
        });
        setPosts(posts);
        setLoading(false);
      });
    return () => subscriber();
  }, []);

  const renderItem = ({item}) => {
    return <Post post={item.post} loc={item.ref} />;
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

export default PostFeed;
