import React from "react";
import { View, Text, TouchableOpacity, ToastAndroid, Alert, StatusBar, PermissionsAndroid} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { openDatabase } from 'react-native-sqlite-storage';
const db = openDatabase({name: "Scanned.db", location: 'default'});
import {adunitid, myappid} from './appid';
import firebase from "react-native-firebase";

firebase.admob().initialize(myappid);
const advert = firebase.admob().interstitial(adunitid/*'ca-app-pub-3940256099942544/1033173712'*/);
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();
advert.loadAd(request.build());

var showad = 0;

//adb reverse tcp:8081 tcp:8081

export default class HomeScreen extends React.Component { 

  static navigationOptions = ({ navigation }) => ({
    title: 'QR Reader & Generator',
    headerStyle: {backgroundColor: 'skyblue', elevation: 2},
    headerTintColor: '#fff',
    headerLeft: (
      <TouchableOpacity 
        onPress = {()=>{
          navigation.toggleDrawer();
        }}
      >    
      <Icon 
        style = {{paddingLeft: 12}}
        size = {32}
        name = "menu"
      />
      </TouchableOpacity>
    )
  }); 

  componentDidMount() {
    db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS QRS (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, value TEXT);', [], (tx, res) => {}, () => {});    
    });
  }


  render() {
    return (
      <View style = {{flex: 1}}>
        <StatusBar backgroundColor = "rgba(105, 156, 195, 1)" />
        <View style={{ flex: 1, alignItems: "stretch"}}>
          <TouchableOpacity
            style = {{flex: 1, backgroundColor: "rgba(255, 140, 140, 0.7)"}} 
            onPress={async () => {
              showad++;  
              if(showad == 2 || showad == 5 || showad == 8){      
                advert.show();
              }
              await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then((res) => {
                if(res == 'granted')
                  this.props.navigation.navigate("QRScan");
              });
            }}>
            <View style = {{alignItems: 'center', paddingBottom: 20, justifyContent: 'center', flex: 1}}> 
              <Text style = {{color: 'white', fontSize: 50, paddingBottom: 12, fontFamily: 'sans-serif-light'}}>Scan</Text>
              <Icon name = 'qrcode-scan' size = {64} color = "#333333"/>
            </View>
            </TouchableOpacity>
            <TouchableOpacity
              style = {{flex: 1, backgroundColor: "rgba(180, 180, 255, 0.7)"}} 
              onPress={() => {
                showad++;
                if(showad == 2 || showad == 5 || showad == 8){
                  advert.show();
                }
                this.props.navigation.navigate("QRGenerator");
              }}>
            <View style = {{alignItems: 'center', paddingBottom: 20, justifyContent: 'center', flex: 1}}> 
              <Text style = {{color: 'white', fontSize: 44, paddingBottom: 10, fontFamily: 'sans-serif-light'}}>Generate</Text>
              <Icon name = 'qrcode' size = {68} color = "#333333"/>
              </View>
            </TouchableOpacity>
          </View>
        </View>
    );
  }
}