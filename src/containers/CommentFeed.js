import React, {useState, useEffect, useRef} from 'react';
import {Comment} from '../presentation';
import {FlatList} from 'react-native';
import {ActivityIndicator} from 'react-native';
import firestore from '@react-native-firebase/firestore';

function useIsMountedRef(props) {
  const isMountedRef = useRef(null);
  useEffect(() => {
    isMountedRef.current = true;
    return () => (isMountedRef.current = false);
  });
  return isMountedRef;
}

export default function CommentFeed(props) {
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    const subscriber = firestore()
      .collection(props.id ? `posts/${props.id}/comments` : null)
      .orderBy('comment_date')
      .onSnapshot((querySnapshot) => {
        if (isMountedRef.current) {
          const comments = [];
          querySnapshot.forEach((postSnapshot) => {
            comments.push({
              key: postSnapshot.data().comment_date,
              comment: postSnapshot.data(),
              user: postSnapshot.data().user,
              ref: postSnapshot.ref,
            });
          });
          setComments(comments);
          setLoading(false);
        }
      });
    return () => subscriber();
  }, []);

  const addLike = (commentID, likeCount) => {
    firestore()
      .doc(`posts/${props.id}/comments/${commentID}`)
      .update({
        likedUsers: firestore.FieldValue.arrayUnion(props.currentUserEmail),
        like_count: likeCount + 1,
      });
  };

  const removeLike = (commentID, likeCount) => {
    firestore()
      .doc(`posts/${props.id}/comments/${commentID}`)
      .update({
        likedUsers: firestore.FieldValue.arrayRemove(props.currentUserEmail),
        like_count: likeCount - 1,
      });
  };

  const renderItem = ({item}) => {
    if (item.comment) {
      let liked = false;
      if (item.comment.likedUsers.includes(props.currentUserEmail)) {
        liked = true;
      }
      return (
        <Comment
          comment={item.comment}
          user={item.user}
          liked={liked}
          addLike={addLike}
          removeLike={removeLike}
          id={item.ref.id}
        />
      );
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={comments}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}
