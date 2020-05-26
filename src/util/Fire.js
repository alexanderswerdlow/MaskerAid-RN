import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
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
    return storageRef.putFile(response.path, {
      cacheControl: 'max-age=7200', // cache photos for two hours
    });
  },
  post: (post_data, p_user, loc) => {
    console.log('Post Triggered');

    var s_user = {
      photoURL: p_user.photoURL,
      displayName: p_user.displayName,
      email: p_user.email,
      uid: p_user.uid,
    };

    var post = {
      post_date: firestore.FieldValue.serverTimestamp(),
      text: `${post_data}`,
      like_count: 0,
      user: s_user,
    };

    const batch = firestore().batch();

    batch.set(loc, post);
    const postsRef = firestore().collection('posts').doc(loc.id);
    batch.set(postsRef, post);
    return batch.commit();
  },
  deletePost: async (post_id, user) => {
    //Deletes Photo, Thumbnail, then DB entry
    var storageRef = storage().ref(`posts/${post_id}`);
    var thumbStorageRef = storage().ref(`posts/thumbnails/${post_id}_50x50`);
    storageRef
      .delete()
      .then(function () {
        thumbStorageRef
          .delete()
          .then(function () {
            const usersQuerySnapshot = firestore()
              .collection(`users/${user.uid}/posts`)
              .doc(post_id);
            const postsQuerySnapshot = firestore()
              .collection('posts')
              .doc(post_id);
            const batch = firestore().batch();
            batch.delete(usersQuerySnapshot);
            batch.delete(postsQuerySnapshot);
            return batch.commit();
          })
          .catch(function (error) {
            console.log('Could Not Delete Photo Thumbnail: ' + error);
          });
      })
      .catch(function (error) {
        console.log('Could Not Delete Photo: ' + error);
      });
  },
  likePost: (post, loc, liked) => {
    const postReference = firestore().doc(`posts/${loc.id}`);
    const userPostReference = firestore().doc(
      `users/${post.user_id}/posts/${loc.id}`,
    );
    return firestore().runTransaction(async (transaction) => {
      // Get post data first
      const postSnapshot = await transaction.get(postReference);
      const userPostSnapshot = await transaction.get(userPostReference);

      if (!postSnapshot.exists) {
        throw 'Post does not exist!';
      }

      if (!userPostSnapshot.exists) {
        throw 'User Post does not exist!';
      }

      await transaction.update(postReference, {
        like_count: liked
          ? postSnapshot.data().like_count - 1
          : postSnapshot.data().like_count + 1,
      });

      await transaction.update(userPostReference, {
        like_count: liked
          ? userPostSnapshot.data().like_count - 1
          : userPostSnapshot.data().like_count + 1,
      });
    });
  },
};

export default Firebase;
