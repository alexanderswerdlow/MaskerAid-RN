import React, {useEffect, useContext, useState} from 'react';
import {View} from 'react-native';
import {PostFeed} from '../containers';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../navigation/ContextProvider';
import {Switch} from 'react-native-paper';

export default function Home({navigation}) {
  const [toggle, setToggle] = useState(false);
  const {user} = useContext(AuthContext);
  const [following, setFollowing] = useState([]);
  useEffect(() => {
    const subscriber = firestore()
      .doc(`users/${user.uid}`)
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot.data() && documentSnapshot.data()._following) {
          setFollowing(documentSnapshot.data()._following);
        }
      });
    return () => subscriber();
  }, []);

  return (
    <>
      <Switch
        value={toggle}
        onValueChange={() => {
          setToggle(!toggle);
        }}
      />
      <View style={{flex: 1, width: 100 + '%', height: 100 + '%'}}>
        <PostFeed
          feedType={toggle}
          following={following}
          navigation={navigation}
        />
      </View>
    </>
  );
}
