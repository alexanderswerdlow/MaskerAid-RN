import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {Platform} from 'react-native';

export const Firebase = {
  getPosts: async () => {
    try {
      const querySnapshot = await firestore().collection('posts').get();
      let posts = querySnapshot.docs.map((doc) => doc.data());
      return posts;
    } catch (error) {
      console.log('Error getting documents: ', error);
    }
  },
  uploadFileToFireBase: (response, user, loc) => {
    //const {path, uri} = response;
    //const fileSource = Platform.OS === 'android' ? path : uri;
    const storageRef = storage().ref(`posts/${loc}`);
    return storageRef.putFile(response.path);
  },
  post: (post_data, user, loc) => {
    console.log('Post Triggered');
    var post = {
      post_date: firestore.Timestamp.fromDate(new Date()),
      text: `${post_data}`,
      like_count: 0,
      user_name: user.displayName,
      user_photo: user.photoURL,
    };
    const batch = firestore().batch();

    batch.set(loc, post);
    const postsRef = firestore().collection('posts').doc(loc.id);
    batch.set(postsRef, post);
    batch.commit().then(() => {
      console.log('Posted!');
    });
  },
};

export default Firebase;
