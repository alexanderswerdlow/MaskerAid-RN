import {Image, View, Text, TextInput} from 'react-native';
import React, {useState, useEffect} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {
  Dialog,
  Portal,
  Button,
  Paragraph,
  ProgressBar,
  ActivityIndicator,
  Colors,
  Snackbar,
} from 'react-native-paper';
import {useUpload} from '../util';

function NewPost({navigation}) {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [response, setResponse] = useState(null);
  const [visible, setVisible] = useState(false);
  const [postDialogVisible, setPostDialogVisible] = useState(false);
  const [capWarnVisible, setCapWarnVisible] = useState(false);
  const [prompt, setPrompt] = useState(true);
  const [{success, uploading, progress}, monitorUpload] = useUpload();

  const uploadFile = () => {
    if (response) {
      monitorUpload(response, title);
    }
  };

  useEffect(() => {
    if (success && prompt) {
      setVisible(true);
      setPrompt(false);
      setImage(null);
      setTitle('');
    }
  });

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
                backgroundColor:
                  'rgb(' +
                  global.Rvalue +
                  ',' +
                  global.Gvalue +
                  ',' +
                  global.Bvalue +
                  ')',
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
                backgroundColor:
                  'rgb(' +
                  global.Rvalue +
                  ',' +
                  global.Gvalue +
                  ',' +
                  global.Bvalue +
                  ')',
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
        {uploading ? (
          <ProgressBar progress={0.5} color={Colors.red800} />
        ) : (
          <Button
            mode="contained"
            disabled={image == null}
            onPress={() => {
              if (title != '') {
                setPostDialogVisible(true);
              } else {
                setCapWarnVisible(true);
              }
            }}
            style={{
              alignItems: 'center',
              padding: 10,
              margin: 30,
            }}>
            Add Post
          </Button>
        )}
      </View>
      <Snackbar
        duration={2000}
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}
        action={{
          label: 'Go Home',
          onPress: () => {
            setVisible(false);
            navigation.navigate('Home');
          },
        }}>
        Posted!
      </Snackbar>
      <Snackbar
        duration={4000}
        visible={capWarnVisible}
        onDismiss={() => {
          setCapWarnVisible(false);
        }}
        action={{
          label: 'Dismiss',
          onPress: () => {
            setCapWarnVisible(false);
          },
        }}>
        You must enter a caption!
      </Snackbar>
      <Portal>
        <Dialog
          visible={postDialogVisible}
          onDismiss={() => {
            setPostDialogVisible(false);
          }}>
          <Dialog.Title>Are you sure you want to post?</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Is this a photo of a mask?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setPostDialogVisible(false)}>Cancel</Button>
            <Button
              onPress={() => {
                uploadFile();
                setPostDialogVisible(false);
              }}>
              Yes!
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <ActivityIndicator
        size="large"
        animating={uploading}
        color={Colors.red800}
      />
    </View>
  );
}

export default NewPost;
