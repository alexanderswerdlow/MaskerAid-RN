import React, {useState, useContext} from 'react';
import {StyleSheet, TextInput, Button} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {AuthContext} from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';

const options = {
  title: 'Select Photo',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

function NewPost({navigation}) {
  const {user} = useContext(AuthContext);
  const [avatarSource, setAvatarSource] = useState('');
  const [post_text, setPostText] = React.useState('Useless Placeholder');

  async function _loadImage() {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setAvatarSource(response.uri);
      }
    });
  }

  async function post() {
    console.log('Post Triggered');
    var post = {
      post_date: firestore.Timestamp.fromDate(new Date()),
      text: `${post_text}`,
      like_count: 0,
      user_name: user.displayName,
      user_photo: user.photoURL,
    };
    const batch = firestore().batch();
    const userPostsRef = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('posts')
      .doc();
    batch.set(userPostsRef, post);
    const postsRef = firestore().collection('posts').doc();
    batch.set(postsRef, {loc: userPostsRef, post_date: post.post_date});
    batch.commit().then(function () {
      console.log('Post Successful');
    });
  }

  return (
    <>
      <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(text) => setPostText(text)}
        value={post_text}
      />
      <Button title="Post" onPress={() => post()} />
    </>
  );
}

export default NewPost;
