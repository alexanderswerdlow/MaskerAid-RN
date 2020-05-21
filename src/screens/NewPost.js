import {Image, View, Text, StyleSheet, TextInput, Button} from 'react-native';
import React, {useState} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {ProgressBar, Colors} from 'react-native-paper';
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

  const selectImage = () => {
    const options = {
      noData: true,
    };

    ImagePicker.openPicker({
      width: 1000,
      height: 1000,
      cropping: true,
      forceJpg: true,
    }).then((image) => {
      setResponse(image);
      setImage({uri: image.path});
    });
  };

  return (
    <View style={{flex: 1, marginTop: 60}}>
      <View>
        {image ? (
          <Image source={image} style={{width: '100%', height: 300}} />
        ) : (
          <Button
            title="Add Image"
            onPress={() => selectImage()}
            style={{
              alignItems: 'center',
              padding: 10,
              margin: 30,
            }}
          />
        )}
      </View>
      <View style={{marginTop: 80, alignItems: 'center'}}>
        <Text>Post Details</Text>
        <TextInput
          placeholder="Enter title of the post"
          style={{margin: 20}}
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <Button title="Add post" onPress={() => uploadFile()} />
      </View>
    </View>
  );
}

export default NewPost;
