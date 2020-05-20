import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import ImagePicker from 'react-native-image-picker';

const options = {
  title: 'Select Avatar',
  customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

function NewPost({navigation}) {
  const [avatarSource, setAvatarSource] = useState('');

  async function _loadImage() {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setAvatarSource(response.uri);
      }
    });
  }

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={() => _loadImage()}>
        <Text>NEW POST</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100 + '%',
    width: 100 + '%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NewPost;
