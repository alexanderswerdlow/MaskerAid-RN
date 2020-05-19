import React, {useContext} from 'react';
import {View, Text, StyleSheet, Image, Dimensions, Button} from 'react-native';
import config from '../config';
import Icon from 'react-native-vector-icons/Fontisto';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import {AuthContext} from '../navigation/AuthProvider';
import { Container, Content, Header, Left, Body, Right } from 'react-native-elements';

export default function Profile({navigation}) {
    const screenWidth = Dimensions.get('window').width;
    const {user, logout} = useContext(AuthContext);
    return (
        <View>
             <Image 
                style={styles.userPic} 
                source={{uri: user.photoURL}}
                resizeMode="stretch"
                />
        </View>
    );
  }
  
const styles = StyleSheet.create({
    userPic: {
        alignSelf: 'center',
        width: 100,
        height: 100,
        borderRadius: 75,
    },

    userName: {

    }
});