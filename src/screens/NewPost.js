import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";

class NewPost extends Component {
    login() {
        this.props.navigation.navigate("main");
    }

    render() {
        return (
            <TouchableOpacity
                style={{
                    height: 100 + "%",
                    width: 100 + "%",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >

                <Text>NEW POST</Text>
            </TouchableOpacity>
        );
    }
}

export default NewPost;