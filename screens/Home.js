import React from "react";
import { View, Text, TouchableOpacity, ToastAndroid, Alert, StatusBar, PermissionsAndroid, Platform } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SQLite from 'react-native-sqlite-2';
const db = SQLite.openDatabase("Scanned.db", '1.0', '', 1);
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import SplashScreen from 'react-native-splash-screen';
import { adunitid, myappid,demointerstitial, adunitidios } from './appid';
import { AdMobInterstitial } from 'react-native-admob';

var showad = 0;

//adb reverse tcp:8081 tcp:8081

export default class HomeScreen extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'QR Reader & Generator',
    headerStyle: { backgroundColor: 'skyblue', elevation: 2 },
    headerTintColor: '#fff',
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          navigation.openDrawer();
        }}
      >
        <Icon
          style={{ paddingLeft: 12 }}
          size={32}
          name="menu"
        />
      </TouchableOpacity>
    )
  });

  async componentDidMount() {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS QRS (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, value TEXT);', [], (tx, res) => { }, () => { });
    });
    SplashScreen.hide();
    await AdMobInterstitial.setAdUnitID(Platform.OS === 'android' ? adunitid : adunitidios);
    await AdMobInterstitial.requestAd();
  }


  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="rgba(105, 156, 195, 1)" />
        <View style={{ flex: 1, alignItems: "stretch" }}>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: "rgba(255, 140, 140, 0.7)" }}
            onPress={async () => {
              showad++;
              if (showad == 2 || showad == 5 || showad == 8)
                AdMobInterstitial.showAd();
              if(Platform.OS === "android"){
                await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then((res) => {
                  if (res == 'granted')
                    this.props.navigation.navigate("QRScan");
                });
              }
              else{
                const res = await request(PERMISSIONS.IOS.CAMERA)
                console.log(res)
                if(res === "granted")
                  this.props.navigation.navigate("QRScan");
              }
            }}>
            <View style={{ alignItems: 'center', paddingBottom: 20, justifyContent: 'center', flex: 1 }}>
              <Text style={{ color: 'white', fontSize: 50, paddingBottom: 12, fontFamily: Platform.OS === "android" ? 'sans-serif-light' : "Helvetica" }}>Scan</Text>
              <Icon name='qrcode-scan' size={64} color="#333333" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: "rgba(180, 180, 255, 0.7)" }}
            onPress={() => {
              showad++;
              if (showad == 2 || showad == 5 || showad == 8) {
                AdMobInterstitial.showAd();
              }
              this.props.navigation.navigate("QRGenerator");
            }}>
            <View style={{ alignItems: 'center', paddingBottom: 20, justifyContent: 'center', flex: 1 }}>
              <Text style={{ color: 'white', fontSize: 44, paddingBottom: 10, fontFamily: Platform.OS === "android" ? 'sans-serif-light' : "Helvetica" }}>Generate</Text>
              <Icon name='qrcode' size={68} color="#333333" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}