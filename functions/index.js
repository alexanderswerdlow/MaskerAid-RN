const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');

const admin = require('firebase-admin');
admin.initializeApp();

const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key;

const ALGOLIA_INDEX_NAME = 'posts';
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

//Deletes corresponding database entry when the user is removed from firebase auth
exports.deleteUserData = functions.auth
  .user()
  .onDelete((user) => admin.database().ref(`/users/${user.uid}`).remove());

// Update the search index every time a blog post is written.
exports.onPostCreated = functions.firestore
  .document('posts/{postId}')
  .onCreate((snap, context) => {
    // Get the note document
    const post = snap.data();

    // Add an 'objectID' field which Algolia requires
    post.objectID = context.params.postId;

    // Write to the algolia index
    const index = client.initIndex(ALGOLIA_INDEX_NAME);
    return index.saveObject(post);
  });
