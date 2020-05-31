import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export const Firebase = {
  isFollowing: (self_user, other_user) => {
    if (self_user.uid == other_user.uid) {
      return false;
    }
    const snapshot = firestore()
      .collection('users')
      .where('uid', '==', self_user.uid)
      .where('_following', 'array-contains', other_user.uid)
      .get()
      .then(function (querySnapshot) {
        return !querySnapshot.empty;
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error);
      });
  },
  setFollowing: async (self_user, other_user, val) => {
    if (self_user.uid == other_user.uid) {
      return;
    }
    const querySnapshot = await firestore()
      .collection('users')
      .doc(self_user.uid);

    const batch = firestore().batch();

    batch.update(querySnapshot, {
      _following: val
        ? firestore.FieldValue.arrayUnion(other_user.uid)
        : firestore.FieldValue.arrayRemove(other_user.uid),
    });

    const otherQuerySnapshot = await firestore()
      .collection('users')
      .doc(other_user.uid);

    batch.update(otherQuerySnapshot, {
      _followers: val
        ? firestore.FieldValue.arrayUnion(self_user.uid)
        : firestore.FieldValue.arrayRemove(self_user.uid),
    });

    const selfFollowingRef = firestore().doc(
      `users/${self_user.uid}/following/${other_user.uid}`,
    );

    batch.set(selfFollowingRef, {
      uid: other_user.uid,
      displayName: other_user.displayName,
      email: other_user.email,
      photoURL: other_user.photoURL,
    });

    const otherFollowingRef = firestore().doc(
      `users/${other_user.uid}/followers/${self_user.uid}`,
    );

    batch.set(otherFollowingRef, {
      uid: self_user.uid,
      displayName: self_user.displayName,
      email: self_user.email,
      photoURL: self_user.photoURL,
    });

    batch.commit();

    const following_count_ref = firestore().doc(`users/${self_user.uid}`);
    const follower_count_ref = firestore().doc(`users/${other_user.uid}`);

    return firestore().runTransaction(async (transaction) => {
      const followingCountData = await transaction.get(following_count_ref);
      const followerCountData = await transaction.get(follower_count_ref);

      await transaction.update(following_count_ref, {
        following_count: followingCountData.exists
          ? followingCountData.data().following_count + (val ? 1 : -1)
          : 1,
      });

      await transaction.update(follower_count_ref, {
        follower_count: followerCountData.exists
          ? followerCountData.data().follower_count + (val ? 1 : -1)
          : 1,
      });
    });
  },
  uploadFileToFireBase: (response, user, loc) => {
    const storageRef = storage().ref(`posts/${loc}`);
    return storageRef.putFile(response.path, {
      cacheControl: 'max-age=7200', // cache photos for two hours
    });
  },
  post: async (post_data, p_user, loc) => {
    console.log('Firestore Post Triggered');

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
    batch.commit();

    console.log('Firestore Post Success');

    const post_count_ref = firestore().doc(`users/${p_user.uid}`);
    try {
      await firestore().runTransaction(async (transaction) => {
        return transaction.get(post_count_ref).then(function (postCountData) {
          if (!postCountData.exists) {
            transaction.set(post_count_ref, {post_count: 1});
          } else {
            var new_post_count = postCountData.data().post_count + 1;
            transaction.update(post_count_ref, {post_count: new_post_count});
          }
        });
      });
    } catch (e) {
      console.log('post transaction failed', e);
    }
  },
  deletePost: async (post_id, user, isVideo) => {
    try {
      var storageRef = storage().ref(`posts/${post_id}`);
      let delPhoto = await storageRef.delete();
    } catch (e) {
      console.log('delete media failed', e);
    }

    if (!isVideo) {
      try {
        var thumbStorageRef = storage().ref(`posts/thumb_${post_id}`);
        let delThumb = await thumbStorageRef.delete();
      } catch (e) {
        console.log('delete media failed', e);
      }
    }

    const usersQuerySnapshot = firestore().doc(
      `users/${user.uid}/posts/${post_id}`,
    );
    const postsQuerySnapshot = firestore().collection('posts').doc(post_id);
    const batch = firestore().batch();
    batch.delete(usersQuerySnapshot);
    batch.delete(postsQuerySnapshot);
    let delPost = batch.commit();

    const post_count_ref = firestore().doc(`users/${user.uid}`);
    try {
      await firestore().runTransaction(async (transaction) => {
        return transaction.get(post_count_ref).then(function (postCountData) {
          if (!postCountData.exists || postCountData.data() == 0) {
            transaction.set(post_count_ref, {post_count: 0});
          } else {
            var new_post_count = postCountData.data().post_count - 1;
            new_post_count = new_post_count < 0 ? 0 : new_post_count;
            transaction.update(post_count_ref, {post_count: new_post_count});
          }
        });
      });
    } catch (e) {
      console.log('transaction failed', e);
    }
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
