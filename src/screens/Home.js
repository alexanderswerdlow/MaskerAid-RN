import React, {useEffect, useContext, useState} from 'react';
import {View} from 'react-native';
import {PostFeed} from '../containers';
import firestore from '@react-native-firebase/firestore';
import {GlobalContext} from '../navigation/ContextProvider';

export default function Home({navigation}) {
  const {user} = useContext(GlobalContext);
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
    <View style={{flex: 1, width: 100 + '%', height: 100 + '%'}}>
      <PostFeed feedType="dynamic" following={following} navigation={navigation} />
    </View>
  );
}
