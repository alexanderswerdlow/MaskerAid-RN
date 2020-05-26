/* eslint-disable promise/always-return */
const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');

const admin = require('firebase-admin');
admin.initializeApp();

const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;

const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

//Deletes corresponding database entry when the user is removed from firebase auth
exports.deleteUserData = functions.auth.user().onDelete((user) => {
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

  const index = client.initIndex('users');
  index.deleteObject(user.uid, (err) => {
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
  };
  const doc = admin.firestore().doc(`/users/${user.uid}`).set(person);
  const index = client.initIndex('users');
  return index.saveObject(person);
});

exports.onPostUpdate = functions.firestore
  .document('posts/{postId}')
  .onWrite((change, context) => {
    const post = change.after.data();
    post.objectID = context.params.postId;
    const index = client.initIndex('posts');

    if (!change.after.data()) {
      return index.deleteObject(postId, (err) => {
        if (err) throw err;
        console.log('Post Removed from Algolia Index', postId);
      });
    }

    return index.saveObject(post, (err, content) => {
      if (err) throw err;
      console.log('Post Updated in Algolia Index', post.objectID);
    });
  });
