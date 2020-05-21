import {Image, View, Text, TextInput, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {ProgressBar, Colors, Button} from 'react-native-paper';
import {useUpload} from '../util';

function NewPost({navigation}) {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [response, setResponse] = useState(null);
  const [{uploading, progress}, monitorUpload] = useUpload();

  const uploadFile = () => {
    if (response) {
      monitorUpload(response, title);
    }
  };

  const takeImage = () => {
    ImagePicker.openCamera({
      width: 1000,
      height: 1000,
      cropping: true,
      forceJpg: true,
      mediaType: 'photo',
      maxFiles: 1,
    }).then((image) => {
      setResponse(image);
      setImage({uri: image.path});
    });
  };

  const selectImage = () => {
    ImagePicker.openPicker({
      width: 1000,
      height: 1000,
      cropping: true,
      forceJpg: true,
      mediaType: 'photo',
      maxFiles: 1,
    }).then((image) => {
      setResponse(image);
      setImage({uri: image.path});
    });
  };

  const alertUser = () =>
    Alert.alert(
      'Are you sure you want to post?',
      'Is this a photo of a mask?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => uploadFile()},
      ],
      {cancelable: false},
    );

  return (
    <View style={{flex: 1, marginTop: 60}}>
      <View>
        {image ? (
          <Image source={image} style={{width: '100%', height: 300}} />
        ) : (
          <>
            <Button
              icon="camera"
              mode="contained"
              onPress={() => takeImage()}
              style={{
                alignItems: 'center',
                padding: 10,
                margin: 30,
              }}>
              Take Photo
            </Button>
            <Button
              icon="camera"
              mode="contained"
              onPress={() => selectImage()}
              style={{
                alignItems: 'center',
                padding: 10,
                margin: 30,
              }}>
              Open from Camera Roll
            </Button>
          </>
        )}
      </View>
      <View style={{marginTop: 20, alignItems: 'center'}}>
        <Text>Post Details</Text>
        <TextInput
          placeholder="Enter a caption (Required)"
          style={{margin: 20}}
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <Button
          mode="contained"
          disabled={image == null || title == null}
          onPress={alertUser}
          style={{
            alignItems: 'center',
            padding: 10,
            margin: 30,
          }}>
          Add Post
        </Button>
      </View>
    </View>
  );
}

export default NewPost;
