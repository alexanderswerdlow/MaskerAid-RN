import {useState, useCallback, useContext} from 'react';
import storage from '@react-native-firebase/storage';
import {Firebase} from './Fire.js';
import {AuthContext} from '../navigation/ContextProvider';
import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';

export const useUpload = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const {user} = useContext(AuthContext);

  const monitorUpload = useCallback((response, title) => {
    console.log('Post Triggered');
    setUploading(true);
    setSuccess(false);
    setProgress(0);
    setError(null);
    const userPostsRef = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('posts')
      .doc();

    const uploadTask = Firebase.uploadFileToFireBase(
      response,
      user,
      userPostsRef.id,
    );

    uploadTask.on(
      storage.TaskEvent.STATE_CHANGED,
      async (snapshot) => {
        var percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Image Upload: ' + percent + '% done');
        setProgress(percent);
      },
      (error) => {
        setError(error);
      },
      function () {
        console.log('Image Upload complete!');
        Firebase.post(title, user, userPostsRef).then(() => {
          setSuccess(true);
          setUploading(false);
          console.log('Post Complete!');
        });
      },
    );
  }, []);

  const state = {
    progress,
    uploading,
    success,
    error,
  };

  return [state, monitorUpload];
};
