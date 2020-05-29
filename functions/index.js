/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');

const admin = require('firebase-admin');
const firebase_tools = require('firebase-tools');
const firebase = admin.initializeApp();

const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;

const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

//Deletes corresponding database entry when the user is removed from firebase auth
exports.deleteUserData = functions.auth.user().onDelete((user) => {
  admin
    .firestore()
    .collection('users')
    .doc(user.uid)
    .collection('posts')
    .get()
    .then((querySnapshot) => {
      console.log('Total posts: ', querySnapshot.size);
      querySnapshot.forEach((documentSnapshot) => {
        admin
          .firestore()
          .collection('posts')
          .doc(documentSnapshot.id)
          .delete()
          .then(() => {
            console.log('Post successfully deleted!');
          })
          .catch((error) => {
            console.error('Error removing Post: ', error);
          });

        admin
          .firestore()
          .collection('users')
          .doc(user.uid)
          .collection('posts')
          .doc(documentSnapshot.id)
          .delete()
          .then(() => {
            console.log('Post successfully deleted!');
          })
          .catch((error) => {
            console.error('Error removing Post: ', error);
          });
      });
    })
    .then(() => {
      admin
        .firestore()
        .collection('users')
        .doc(user.uid)
        .delete()
        .then(() => {
          console.log('User successfully deleted!');
        })
        .catch((error) => {
          console.error('Error removing User: ', error);
        });
    })
    .catch((error) => {
      console.error('Error removing User Data: ', error);
    });

  firebase_tools.firestore.delete(`users/${user.uid}/`, {
    project: process.env.GCLOUD_PROJECT,
    recursive: true,
    yes: true,
    token: functions.config().fb.token,
  });

  const index = client.initIndex('users');
  return index.deleteObject(user.uid, (err) => {
    if (err) throw err;
    console.log('User Removed from Algolia Index', user.uid);
  });
});

exports.createUserData = functions.auth.user().onCreate((user) => {
  var person = {
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    uid: user.uid,
    objectID: user.uid,
    follower_count: 0,
    following_count: 0,
    post_count: 0,
  };
  const doc = admin.firestore().doc(`/users/${user.uid}`).set(person);
  const index = client.initIndex('users');
  return index.saveObject(person);
});

exports.onPostUpdate = functions.firestore
  .document('posts/{postId}')
  .onWrite((change, context) => {
    const index = client.initIndex('posts');

    if (!change.after.data()) {
      index.deleteObject(context.params.postId, (err) => {
        if (err) throw err;
        console.log('Post Removed from Algolia Index', postId);
      });

      const bucket = firebase.storage().bucket();
      bucket.file(`posts/thumbnails/${context.params.postId}_50x50`).delete();
      return bucket.file(`posts/${context.params.postId}`).delete();
    }

    const post = change.after.data();
    post.objectID = context.params.postId;

    return index.saveObject(post, (err, content) => {
      if (err) throw err;
      console.log('Post Updated in Algolia Index', post.objectID);
    });
  });
