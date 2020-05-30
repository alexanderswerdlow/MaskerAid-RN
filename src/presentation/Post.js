import React, {useContext, useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import config from '../config';
import Icon from 'react-native-vector-icons/Fontisto';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import {AuthContext} from '../navigation/AuthProvider';
import storage from '@react-native-firebase/storage';
import ProgressiveImage from './ProgressiveImage';
import DoubleTap from './DoubleTap';
import Fire from '../util/Fire';
import {Dialog, Portal, Button, Paragraph} from 'react-native-paper';
import * as RootNavigation from '../navigation/RootNavigation.js';
import PropTypes from 'prop-types';

export default function Post(props) {
  const w = Dimensions.get('window');
  const {user} = useContext(AuthContext);
  const [liked, setLiked] = useState(false);
  const [thumbnail, setThumbnail] = useState('');
  const [image, setImage] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const heartIconColor = liked ? 'rgb(252,61,57)' : null;
  const heartIconID = liked ? 'heart' : 'hearto';
  const [like_count, set_like_count] = useState(0);

  useEffect(() => {
    const subscriber = props.loc.onSnapshot((postSnapshot) => {
      if (postSnapshot.data()) {
        set_like_count(postSnapshot.data().like_count);
      }
    });
    return () => subscriber();
  }, []);

  const likePhoto = () => {
    if (like_count == 0 && liked) {
      props.loc
        .update({
          like_count: 1,
        })
        .then(() => {
          console.log('Fixed Like');
        });
    } else {
      setLiked(!liked);
      props.loc
        .update({
          like_count: liked ? like_count - 1 : like_count + 1,
        })
        .then(() => {
          console.log('Liked!');
        });
    }
  };

  useEffect(() => {
    storage()
      .ref(`posts/thumbnails/${props.loc.id}_50x50`)
      .getDownloadURL()
      .then(function (url) {
        setThumbnail(url);
      })
      .catch(function (error) {
        console.log('Could not retrieve thumbnail: ' + error);
      });
    storage()
      .ref(`posts/${props.loc.id}`)
      .getDownloadURL()
      .then(function (url) {
        setImage(url);
      })
      .catch(function (error) {
        console.log('Could not retrieve image: ' + error);
      });
  });

  return (
    <View style={{flex: 1, width: 100 + '%'}}>
      <View style={styles.userBar}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              RootNavigation.navigate('Profile', {
                user: props.user,
              });
            }}>
            <Image style={styles.userPic} source={{uri: props.user.photoURL}} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              RootNavigation.navigate('ViewProfile', {
                user: props.user,
              });
            }}>
            <Text style={styles.username}>{props.user.displayName}</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.dotmenu}>...</Text>
        </View>
      </View>
      <DoubleTap onDoubleTap={() => likePhoto()} activeOpacity={0.7}>
        <ProgressiveImage
          thumbnailSource={thumbnail ? {uri: thumbnail} : null}
          source={image ? {uri: image} : null}
          style={{width: w.width, height: w.width}}
          resizeMode="cover"
        />
      </DoubleTap>
      <View style={styles.iconBar}>
        <IconAntDesign
          name={heartIconID}
          size={30}
          style={{padding: 5, color: heartIconColor}}
          onPress={() => likePhoto()}
        />
        <TouchableOpacity 
          onPress = {() => {
            RootNavigation.navigate('CommentScreen', {
              post: props.loc.id
            });
          }}
        >
          <Icon name={'comment'} size={27} style={{padding: 5}} />
        </TouchableOpacity>
        {user.uid == props.user.uid && (
          <IconAntDesign
            name={'delete'}
            size={30}
            style={{padding: 5}}
            onPress={() => setDialogVisible(true)}
          />
        )}
      </View>
      <View style={styles.commentBar}>
        <View style={{flexDirection: 'row'}}>
          <IconAntDesign name={'heart'} size={10} style={{padding: 5}} />
          <Text>{like_count} Likes</Text>
        </View>
        <View style={styles.caption}>
          <Text style={styles.username}>{props.user.displayName}</Text>
          <Text style={styles.username}>{props.post.text}</Text>
        </View>
      </View>
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => {
            setDialogVisible(false);
          }}>
          <Dialog.Title>
            Are you sure you want to delete your post?
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              There&apos;s no way to retrieve it once deleted
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button
              onPress={() => {
                Fire.deletePost(props.loc.id, user);
                setDialogVisible(false);
              }}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    width: 100 + '%',
    height: 56,
    marginTop: 20,
    backgroundColor: 'rgb(250, 250, 250)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: config.styleConstants.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },

  userBar: {
    width: 100 + '%',
    height: config.styleConstants.rowHeight,
    backgroundColor: 'rgb(255,255,255)',
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },

  userPic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  username: {
    marginLeft: 10,
  },

  dotmenu: {
    alignItems: 'center',
    fontSize: 30,
  },

  iconBar: {
    height: config.styleConstants.rowHeight,
    width: 100 + '%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: config.styleConstants.borderColor,
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
  },

  commentBar: {
    height: config.styleConstants.rowHeight,
    width: 100 + '%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: config.styleConstants.borderColor,
    flexDirection: 'column',
    paddingHorizontal: 10,
  },

  caption: {
    flexDirection: 'row',
    position: 'absolute',
    marginTop: 17,
    marginLeft: 4,
  },
});

Post.propTypes = {
  user: PropTypes.objectOf(PropTypes.string),
  loc: PropTypes.any.isRequired,
};
