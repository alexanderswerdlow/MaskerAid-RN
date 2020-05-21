import {useState, useCallback, useContext} from 'react';
import storage from '@react-native-firebase/storage';
import {Firebase} from './Fire.js';
import {AuthContext} from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';

export const useUpload = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const {user} = useContext(AuthContext);

  const monitorUpload = useCallback((response, title) => {
    console.log('Hook');
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
        setProgress(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        );
        if (snapshot.state === storage.TaskState.SUCCESS) {
          setSuccess(true);
        }
      },
      (error) => {
        setError(error);
      },
    );

    uploadTask
      .then(() => {
        Firebase.post(title, user, userPostsRef);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  const state = {
    progress,
    uploading,
    success,
    error,
  };

  return [state, monitorUpload];
};
