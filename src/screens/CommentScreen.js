import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  Button,
  KeyboardAvoidingView,
} from 'react-native';
import config from '../config';
import CommentFeed from '../containers/CommentFeed';
import firestore from '@react-native-firebase/firestore';

export default function Comment(props) {
  const w = Dimensions.get('window');
  const commentsCollection = firestore().collection(
    `posts/${props.route.params.post}/comments`,
  );
  const [newComment, setNewComment] = useState('');

  return (
    <View style={{flex: 1, width: 100 + '%', height: 100 + '%'}}>
      <KeyboardAvoidingView
        style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}
        behavior="padding"
        enabled
        keyboardVerticalOffset={100}>
        <CommentFeed
          id={props.route.params.post}
          currentUserID={props.route.params.user.uid}
        />
        <View
          style={{
            flexDirection: 'row',
            width: w.width,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TextInput
            style={styles.TextInput}
            onChangeText={(text) => setNewComment(text)}
            value={newComment}
          />
          <Button
            title={'Add'}
            style={{alignItems: 'center'}}
            onPress={() => {
              if (newComment.length > 0) {
                console.log(props.route.params.user);
                commentsCollection
                  .add({
                    user: props.route.params.user,
                    text: newComment,
                    like_count: 0,
                    comment_date: firestore.FieldValue.serverTimestamp(),
                    likedUsers: [],
                  })
                  .then(() => {
                    console.log('Comment Added!');
                  });
                setNewComment('');
              } else {
                alert('Comments must be at least 1 character.');
              }
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    width: `${100}%`,
    height: 56,
    marginTop: 20,
    backgroundColor: 'rgb(250, 250, 250)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: config.styleConstants.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  CommentText: {
    fontSize: 20,
  },

  TextInput: {
    height: 40,
    borderColor: 'blue',
    borderWidth: 1,
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 10,
  },
});
