import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import config from './config';
import Icon from 'react-native-vector-icons/Fontisto'
import IconAntDesign from 'react-native-vector-icons/AntDesign'

class MaskerAid extends Component {

    constructor(){
        super()
        this.state  =  {
            screenWidth: 0
        }
    }
    componentDidMount(){
        this.setState({
            screenWidth: Dimensions.get("window").width
        });
    }

   render() {
       return(
        <View>
            <View style = {styles.nav}>
                <Text style = {{fontSize: 20}}>MaskerAid</Text>
            </View>

            <View style = {styles.userBar}>

                <View style = {{flexDirection: "row", alignItems: 'center'}}>
                    
                    <Image  
                        style = {styles.userPic}
                        source = {{
                            uri: "https://avatars3.githubusercontent.com/u/60021093?s=400&u=2e82de2e9bec77ff75b3435fe20ab22e945b9155&v=4"
                        }}
                    />

                    <Text style= {styles.username} >Gary Hua</Text>

                </View>

                <View>
                    <Text style={styles.dotmenu} >...</Text>
                </View>
            </View>

            <Image 
                style =  {{width: this.state.screenWidth , height: 405}}
                source = {{
                    uri:
                        "https://en.bcdn.biz/Images/2018/6/6/ae2e9240-c42a-4a81-b6d8-ac65af25b827.jpg"
                }}
            />
            
            <View style= {styles.iconBar}>
                <IconAntDesign 
                    name = {"hearto"}
                    size =  {30}
                    style = {{padding: 5}}

                />

                <Icon 
                    name = {"comment"}
                    size = {27}
                    style = {{padding: 5}}
                
                />
            </View>
        </View>
       );
   }
}

const styles = StyleSheet.create({
  nav: {
    width: 100 + "%",
    height: 56,
    marginTop: 20, 
    backgroundColor: "rgb(250, 250, 250)",
    borderBottomWidth:  StyleSheet.hairlineWidth,
    borderBottomColor: config.styleConstants.borderColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  userBar: {
    width: 100 + "%",
    height: config.styleConstants.rowHeight,
    backgroundColor: "rgb(255,255,255)",
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: 'space-between'
  },  

  userPic:  {
    width: 40,
    height: 40,
    borderRadius: 20
  },

  username:  {
    marginLeft: 10
  },

  dotmenu: {
    alignItems: 'center',
    fontSize: 30
  },

  iconBar: {
    height: config.styleConstants.rowHeight,
    width: 100 + "%",
    borderBottomWidth:  StyleSheet.hairlineWidth,
    borderTopWidth:  StyleSheet.hairlineWidth,
    borderColor: config.styleConstants.borderColor,
    flexDirection: "row",
    paddingHorizontal: 10
  },

})


export default MaskerAid;