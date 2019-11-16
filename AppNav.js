import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import React from "react";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FIcon from 'react-native-vector-icons/FontAwesome5';
import { View, Text, Dimensions, FlatList, TouchableOpacity, Linking, Alert, Image, ScrollView, } from "react-native";
import HomeScreen from './screens/Home';
import QRScanScreen from './screens/QRScan';
import QRScanResultScreen from './screens/QRScanResult';
import SettingsScreen from './screens/Settings';
import QRGeneratorScreen from './screens/QRGenerator';
import QRScanGalleryScreen from './screens/QRScanGallery';
import HistoryScreen from './screens/History';

const { width, height } = Dimensions.get('screen');


const AppNavigator = createStackNavigator({
  Home: HomeScreen,
  Settings: SettingsScreen,
  History: HistoryScreen,
  QRScan: QRScanScreen,
  QRScanResult: QRScanResultScreen,
  QRGenerator: QRGeneratorScreen,
  QRScanGallery: QRScanGalleryScreen,
});


const DrawNavigator = createDrawerNavigator({
  Home: {
    screen: AppNavigator,
    navigationOptions: {
      drawerIcon: () => <Icon name="home" size={24} color="#444444" />,
      drawerLabel: "Home"
    },
  }
},
  {
    drawerWidth: width * 0.8,
    contentComponent: (props) => (
      <ScrollView>
        <Image
          source={require('./assets/qrflogo.png')}
          style={{ width: width * 0.8, height: height * 0.25 }}
        />
        <View>
          
        <TouchableOpacity
            style={{ paddingLeft: 16, paddingVertical: 14.5 }}
            onPress={() => { props.navigation.navigate("History") }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="history" size={24} color="#888" />
              <Text style={{ fontSize: 14, fontWeight: 'bold', paddingLeft: 32, color: 'black' }}>History</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ paddingLeft: 16, paddingVertical: 14.5 }}
            onPress={() => { props.navigation.navigate("Settings") }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="settings" size={24} color="#888" />
              <Text style={{ fontSize: 14, fontWeight: 'bold', paddingLeft: 32, color: 'black' }}>Settings</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ paddingLeft: 16, paddingBottom: 13, paddingTop: 10 }}
            onPress={() => { Linking.openURL("https://play.google.com/store/apps/details?id=com.kaya.qr_reader_and_generator"); }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="star" size={24} color="#888888" />
              <Text style={{ fontSize: 14, fontWeight: 'bold', paddingLeft: 32, color: 'black' }}>Rate App</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ paddingLeft: 16, paddingVertical: 14.5 }}
            onPress={() => { Linking.openURL("https://play.google.com/store/apps/details?id=com.kaya.qr_reader_and_generator_pro"); }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FIcon name="ad" size={24} color="#888" />
              <Text style={{ fontSize: 14, fontWeight: 'bold', paddingLeft: 32, color: 'black' }}>Ad Free Version</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ paddingLeft: 16, paddingVertical: 14.5 }}
            onPress={() => { Linking.openURL("https://play.google.com/store/apps/developer?id=IBK+Apps"); }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="google-play" size={24} color="#888" />
              <Text style={{ fontSize: 14, fontWeight: 'bold', paddingLeft: 32, color: 'black' }}>View Other Apps</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ paddingLeft: 16, paddingVertical: 14.5 }}
            onPress={() => { Linking.openURL("mailto:ibraberatkaya@gmail.com?subject=Feedback"); }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="email" size={24} color="#888888" />
              <Text style={{ fontSize: 14, fontWeight: 'bold', paddingLeft: 32, color: 'black' }}>Feedback</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ paddingLeft: 16, paddingVertical: 14.5 }}
            onPress={() => { Alert.alert("Help", "Click the scan button to scan a QR Code with your camera. You can click the icon below the text in the result screen to call or text a number, add an event etc.\n\nClick the generate button to generate a QR Code (requires internet connection). Click on the QR Code to download it."); }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="help-circle" size={24} color="#888888" />
              <Text style={{ fontSize: 14, fontWeight: 'bold', paddingLeft: 32, color: 'black' }}>Help</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
);


AppNavigator.navigationOptions = ({
  drawerIcon: (<Icon name="home" />),
});

AppNavigator.navigationOptions = ({ navigation }) => {  //Locks drawer when not in the home screen
  let drawerLockMode = 'unlocked';
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed';
  }
  return {
    drawerLockMode,
  };
};

const Enter = createStackNavigator({
  Home: {
    screen: DrawNavigator,
    navigationOptions: {
      header: null,
      headerStyle: {
        backgroundColor: 'rgb(105, 156, 195)',
      },
    }
  }
});


export default createAppContainer(Enter);