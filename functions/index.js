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
      return index.deleteObject(context.params.postId, (err) => {
        if (err) throw err;
        console.log('Post Removed from Algolia Index', postId);
      });
    }

    const post = change.after.data();
    post.objectID = context.params.postId;

    return index.saveObject(post, (err, content) => {
      if (err) throw err;
      console.log('Post Updated in Algolia Index', post.objectID);
    });
  });

const mkdirp = require('mkdirp');
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');

// Max height and width of the thumbnail in pixels.
const THUMB_MAX_HEIGHT = 200;
const THUMB_MAX_WIDTH = 200;
// Thumbnail prefix added to file names.
const THUMB_PREFIX = 'thumb_';

/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 * After the thumbnail has been generated and uploaded to Cloud Storage,
 * we write the public URL to the Firebase Realtime Database.
 */
exports.generateThumbnail = functions.storage
  .object()
  .onFinalize(async (object) => {
    // File and directory paths.
    const filePath = object.name;
    const contentType = object.contentType; // This is the image MIME type
    const fileDir = path.dirname(filePath);
    const fileName = path.basename(filePath);
    const thumbFilePath = path.normalize(
      path.join(fileDir, `${THUMB_PREFIX}${fileName}`),
    );
    const tempLocalFile = path.join(os.tmpdir(), filePath);
    const tempLocalDir = path.dirname(tempLocalFile);
    const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);

    // Exit if this is triggered on a file that is not an image.
    if (!contentType.startsWith('image/')) {
      return console.log('This is not an image.');
    }

    // Exit if the image is already a thumbnail.
    if (fileName.startsWith(THUMB_PREFIX)) {
      return console.log('Already a Thumbnail.');
    }

    // Cloud Storage files.
    const bucket = admin.storage().bucket(object.bucket);
    const file = bucket.file(filePath);
    const thumbFile = bucket.file(thumbFilePath);
    const metadata = {
      contentType: contentType,
      // To enable Client-side caching you can set the Cache-Control headers here. Uncomment below.
      // 'Cache-Control': 'public,max-age=3600',
    };

    // Create the temp directory where the storage file will be downloaded.
    await mkdirp(tempLocalDir);
    // Download file from bucket.
    await file.download({destination: tempLocalFile});
    console.log('The file has been downloaded to', tempLocalFile);
    // Generate a thumbnail using ImageMagick.
    await spawn(
      'convert',
      [
        tempLocalFile,
        '-thumbnail',
        `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`,
        tempLocalThumbFile,
      ],
      {capture: ['stdout', 'stderr']},
    );
    console.log('Thumbnail created at', tempLocalThumbFile);
    // Uploading the Thumbnail.
    await bucket.upload(tempLocalThumbFile, {
      destination: thumbFilePath,
      metadata: metadata,
    });
    console.log('Thumbnail uploaded to Storage at', thumbFilePath);
    // Once the image has been uploaded delete the local files to free up disk space.
    fs.unlinkSync(tempLocalFile);
    fs.unlinkSync(tempLocalThumbFile);

    return console.log('Thumbnail saved');
  });
