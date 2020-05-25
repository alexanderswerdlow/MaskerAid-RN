const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');

const admin = require('firebase-admin');
admin.initializeApp();

const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;

const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

//Deletes corresponding database entry when the user is removed from firebase auth
exports.deleteUserData = functions.auth
  .user()
  .onDelete((user) => admin.database().ref(`/users/${user.uid}`).remove());

exports.createUserData = functions.auth.user().onCreate((user) => {
  var person = {
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    objectID: user.uid,
  };
  const doc = admin.firestore().doc(`/users/${user.uid}`).set(person);
  const index = client.initIndex('users');
  return index.saveObject(person);
});

exports.onPostCreated = functions.firestore
  .document('posts/{postId}')
  .onCreate((snap, context) => {
    const post = snap.data();
    post.objectID = context.params.postId;
    const index = client.initIndex('posts');
    return index.saveObject(post);
  });
