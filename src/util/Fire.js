import frs from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export const Firebase = {
  sanitizeUser: (user) => {
    return {
      photoURL: user.photoURL,
      displayName: user.displayName,
      email: user.email,
      uid: user.uid,
    };
  },
  isFollowing: (self_user, other_user) => {
    //You can never follow
    if (self_user.uid == other_user.uid) {
      return false;
    }
    frs()
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
  setFollowing: async (self_user, other_user, follow) => {
    //Cannot follow/unfollow yourself
    if (self_user.uid == other_user.uid) {
      return;
    }

    const batch = frs().batch();
    const selfRef = frs().doc(`users/${self_user.uid}`);
    const otherRef = frs().doc(`users/${other_user.uid}`);
    const selfFollowingRef = frs().doc(`users/${self_user.uid}/following/${other_user.uid}`);
    const otherFollowingRef = frs().doc(`users/${other_user.uid}/followers/${self_user.uid}`);

    batch.update(selfRef, {
      _following: follow ? frs.FieldValue.arrayUnion(other_user.uid) : frs.FieldValue.arrayRemove(other_user.uid),
      following_count: frs.FieldValue.increment(follow ? 1 : -1),
    });

    batch.update(otherRef, {
      _followers: follow ? frs.FieldValue.arrayUnion(self_user.uid) : frs.FieldValue.arrayRemove(self_user.uid),
      follower_count: frs.FieldValue.increment(follow ? 1 : -1),
    });

    if (follow) {
      batch.set(selfFollowingRef, Firebase.sanitizeUser(other_user));
      batch.set(otherFollowingRef, Firebase.sanitizeUser(self_user));
    } else {
      batch.delete(selfFollowingRef);
      batch.delete(otherFollowingRef);
    }

    batch.commit();
  },
  uploadFileToFireBase: (response, user, loc) => {
    const storageRef = storage().ref(`posts/${loc}`);
    return storageRef.putFile(response.path, {
      cacheControl: 'max-age=86400', // cache media for 24 hours
    });
  },
  post: async (post_data, p_user, loc) => {
    var d = new Date();

    var post = {
      post_date: frs.FieldValue.serverTimestamp(),
      post_day: d.getDate(),
      text: `${post_data}`,
      like_count: 0,
      user: Firebase.sanitizeUser(p_user),
    };

    const batch = frs().batch(); // Create batched write
    batch.set(loc, post); // Write post object to loc reference
    const postsRef = frs().collection('posts').doc(loc.id); // Create new reference using the loc reference ID
    batch.set(postsRef, post); // Write post object to postsRef reference
    const post_count_ref = frs().doc(`users/${p_user.uid}`);
    batch.update(post_count_ref, {post_count: frs.FieldValue.increment(1)});
    try {
      await batch.commit(); // Atomically write to both locations
      console.log('Firestore Post Success');
    } catch (err) {
      console.log('Failed to write post');
      return;
    }
  },
  deletePost: async (post_id, user, isVideo) => {
    if (!isVideo) {
      try {
        var thumbStorageRef = storage().ref(`posts/${post_id}_400x400`);
        await thumbStorageRef.delete();
      } catch (e) {
        console.log('Delete Thumbnail failed', e);
      }
    }

    try {
      var storageRef = storage().ref(`posts/${post_id}`);
      await storageRef.delete();
    } catch (e) {
      console.log('Delete media failed', e);
    }

    const usersQuerySnapshot = frs().doc(`users/${user.uid}/posts/${post_id}`);
    const postsQuerySnapshot = frs().doc(`posts/${post_id}`);
    const postCountRef = frs().doc(`users/${user.uid}`);
    const batch = frs().batch();

    batch.delete(usersQuerySnapshot);
    batch.delete(postsQuerySnapshot);
    batch.update(postCountRef, {post_count: frs.FieldValue.increment(-1)});

    try {
      await batch.commit();
    } catch (e) {
      console.log('Delete post failed', e);
      return;
    }
  },
  likePost: async (post_id, post_user_id, user_id, liked) => {
    const batch = frs().batch();
    const userRef = frs().doc(`users/${post_user_id}/posts/${post_id}`);
    batch.update(userRef, {
      like_count: frs.FieldValue.increment(liked ? -1 : 1),
      like_users: !liked ? frs.FieldValue.arrayUnion(user_id) : frs.FieldValue.arrayRemove(user_id),
    });
    const postsRef = frs().collection('posts').doc(post_id);
    batch.update(postsRef, {
      like_count: frs.FieldValue.increment(liked ? -1 : 1),
      like_users: !liked ? frs.FieldValue.arrayUnion(user_id) : frs.FieldValue.arrayRemove(user_id),
    });
    await batch.commit();
  },
  /*
  Method taken from: https://stackoverflow.com/a/37802747
  Returns the relative date string
  Takes a JavaScript DateObject
  */
  timeAgo: (timeAgo) => {
    let locales = {
      prefix: '',
      sufix: 'ago',

      seconds: 'less than a minute',
      minute: 'about a minute',
      minutes: '%d minutes',
      hour: 'about an hour',
      hours: 'about %d hours',
      day: 'a day',
      days: '%d days',
      month: 'about a month',
      months: '%d months',
      year: 'about a year',
      years: '%d years',
    };

    var seconds = Math.floor((new Date() - parseInt(timeAgo.getTime())) / 1000),
      separator = locales.separator || ' ',
      words = locales.prefix + separator,
      interval = 0,
      intervals = {
        year: seconds / 31536000,
        month: seconds / 2592000,
        day: seconds / 86400,
        hour: seconds / 3600,
        minute: seconds / 60,
      };

    var distance = locales.seconds;

    for (var key in intervals) {
      interval = Math.floor(intervals[key]);

      if (interval > 1) {
        distance = locales[key + 's'];
        break;
      } else if (interval === 1) {
        distance = locales[key];
        break;
      }
    }

    distance = distance.replace(/%d/i, interval);
    words += distance + separator + locales.sufix;

    return words.trim();
  },
};

export default Firebase;
