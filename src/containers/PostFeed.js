/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react';
import {FlatList} from 'react-native';
import {Post} from '../presentation';
import {ActivityIndicator} from 'react-native';
import firestore from '@react-native-firebase/firestore';

function useIsMountedRef() {
  const isMountedRef = useRef(null);
  useEffect(() => {
    isMountedRef.current = true;
    return () => (isMountedRef.current = false);
  });
  return isMountedRef;
}

function PostFeed(props) {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    const subscriber = firestore()
      .collection(props.user ? `users/${props.user.uid}/posts` : 'posts')
      .orderBy('post_date', 'desc')
      .limit(20)
      .onSnapshot((querySnapshot) => {
        if (isMountedRef.current) {
          const posts = [];
          querySnapshot.forEach((postSnapshot) => {
            posts.push({
              key: postSnapshot.data().post_date,
              post: postSnapshot.data(),
              user: postSnapshot.data().user,
              ref: postSnapshot.ref,
            });
          });
          setPosts(posts);
          setLoading(false);
        }
      });
    return () => subscriber();
  }, []);

  const renderItem = ({item}) => {
    if (item.post) {
      return <Post post={item.post} user={item.user} loc={item.ref} />;
    }
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
