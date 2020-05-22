const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

//Deletes corresponding database entry when the user is removed from firebase auth
exports.deleteUserData = functions.auth
  .user()
  .onDelete((user) => admin.database().ref(`/users/${user.uid}`).remove());
