import {Image, View, Text, TextInput} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
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
import {AuthContext} from '../navigation/AuthProvider';

function NewPost({navigation}) {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [response, setResponse] = useState(null);
  const [visible, setVisible] = useState(false);
  const [postDialogVisible, setPostDialogVisible] = useState(false);
  const [capWarnVisible, setCapWarnVisible] = useState(false);
  const [prompt, setPrompt] = useState(true);
  const [{success, uploading}, monitorUpload] = useUpload();
  const {theme} = useContext(AuthContext);

  const uploadFile = () => {
    if (response) {
      monitorUpload(response, title);
      setPrompt(true);
      setResponse(null);
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
    })
      .then((image) => {
        setResponse(image);
        setImage({uri: image.path});
      })
      .catch((error) => {
        console.log(error);
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
    })
      .then((image) => {
        setResponse(image);
        setImage({uri: image.path});
      })
      .catch((error) => {
        console.log(error);
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
                backgroundColor: theme.colors.primary,
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
                backgroundColor: theme.colors.primary,
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
          style={{margin: 20, width: 300}}
          value={title}
          defaultValue="Default Value"
          clearButtonMode="while-editing"
          onChangeText={(text) => setTitle(text)}
        />
        {uploading ? (
          <ProgressBar progress={0.5} color={theme.colors.primary} />
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
        theme={{colors: {accent: theme.colors.primary}}}
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
        theme={{colors: {accent: theme.colors.primary}}}
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
          style={{backgroundColor: 'white'}}
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
        color={theme.colors.primary}
      />
    </View>
  );
}

export default NewPost;
