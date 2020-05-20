/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {FlatList, Text, View} from 'react-native';
import {Post} from '../presentation';
import {ActivityIndicator, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';

function PostFeed() {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [posts, setPosts] = useState([]); // Initial empty array of users

  useEffect(() => {
    const subscriber = firestore()
      .collection('posts')
      .orderBy('post_date', 'desc')
      .limit(20)
      .onSnapshot((querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((documentSnapshot) => {
          //Need to fix this to order posts
          documentSnapshot
            .data()
            .loc.get()
            .then((postSnapshot) => {
              posts.push({
                key: postSnapshot.data().post_date,
                post: postSnapshot.data(),
                loc: documentSnapshot.data().loc,
              });
              console.log(postSnapshot.data().post_date);
            });
        });
        setPosts(posts);
        setLoading(false);
        console.log('Loaded Posts');
      });

    return () => subscriber();
  }, []);

  const renderItem = ({item}) => {
    var i;
    for (i = 0; i < posts.length; i++) {
      //console.log(posts[i].post.post_date);
    }
    return <Post post={item.post} loc={item.loc} />;
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
