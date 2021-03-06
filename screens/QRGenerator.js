import React from "react";
import { View, Text, TextInput, TouchableOpacity, ToastAndroid, Alert, PermissionsAndroid, Platform } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-root-toast';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from '@react-native-community/cameraroll';

export default class QRGeneratorScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text: ""
        }
    }

    static navigationOptions = {
        title: 'Generate',
        headerStyle: { backgroundColor: 'skyblue', elevation: 2 },
        headerTintColor: '#fff',
        headerRight: (
            <TouchableOpacity
                onPress={() => {
                    Alert.alert("Help", "Enter text to generate a QR Code. Click the QR Code to download it.");
                }}
                style={{ paddingRight: 12 }}
            >
                <Icon name="help-circle-outline" size={30} color="#ffffff" />
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <TextInput
                    placeholder="Enter text to generate a QR Code. Click it to download!"
                    placeholderTextColor="#888888"
                    style={{
                        flex: 1, backgroundColor: "#eeeeff", marginLeft: 10, marginRight: 10, marginTop: 10,
                        fontSize: 18, padding: 8
                    }}
                    textAlignVertical="top"
                    returnKeyType="done"
                    blurOnSubmit={true}
                    multiline={true}
                    onChangeText={(edittext) => {
                        this.setState({ text: encodeURIComponent(edittext).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/!/g, "%21").replace(/'/g, "%27").replace(/\*/g, "%2A") });
                        //console.log(encodeURIComponent(edittext).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/!/g, "%21").replace(/'/g, "%27").replace(/\*/g, "%2A"));
                    }}
                />
                <TouchableOpacity style={{ flex: 2, justifyContent: "center", alignItems: 'center' }}
                    onPress={() => {
                        var text = this.state.text;
                        if (text != "") {
                            if(Platform.OS === "android"){
                                PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then((res) => {
                                    if (res == 'granted') {
                                        try{
                                            RNFetchBlob
                                                .config({
                                                    path: RNFetchBlob.fs.dirs.CacheDir + '/qr.jpg'
                                                })
                                                .fetch('GET', "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + text)
                                                .then((resp) => {
                                                    CameraRoll.saveToCameraRoll('file://' + resp.path());
                                                    ToastAndroid.show("Downloaded", ToastAndroid.SHORT);
                                                }).catch((e) => console.log(e));
                                        }
                                        catch(e){
                                            console.log(e);
                                        }
                                    }
                                });
                            }
                            else{
                                try{
                                    RNFetchBlob
                                        .config({
                                            path: RNFetchBlob.fs.dirs.CacheDir + '/qr.jpg'
                                        })
                                        .fetch('GET', "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + text)
                                        .then((resp) => {
                                            CameraRoll.saveToCameraRoll('file://' + resp.path());
                                            Toast.show("Downloaded");
                                        }).catch((e) => console.log(e));
                                }
                                catch(e){
                                    console.log(e);
                                }
                            }
                        }
                    }}
                >
                    <Image
                        source={{ uri: this.state.text != "" ? ("https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + this.state.text) : "a" }}
                        //onLoadStart={(e) => {console.log("https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + this.state.text)}}
                        indicator={ProgressBar}
                        style={{ width: 200, height: 200 }}

                    />
                </TouchableOpacity>
                <View style={{ flex: 1 }}></View>
            </View>
        );
    }

}
