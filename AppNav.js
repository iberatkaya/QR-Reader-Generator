import { createStackNavigator, createAppContainer, createDrawerNavigator, DrawerItems } from 'react-navigation';
import React from "react";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
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
    navigationOptions : {
      drawerIcon: () => <Icon name = "home" size = {24} color = "#444444" />,
      drawerLabel: "Home"
    },
  },
  History: {
    screen: createStackNavigator({HistoryScreen}),
    navigationOptions : {
      drawerIcon: () => <Icon name = "history" size = {24} color = "#444444" />,
      drawerLabel: "History"
    }
  },
  Settings: {
    screen: createStackNavigator({SettingsScreen}),
    navigationOptions: {
      drawerIcon: () => <Icon name = "settings" size = {24} color = "#444444" />,
      drawerLabel: "Settings"
    }
  },
},
  {
    drawerWidth: width * 0.8,
    contentComponent: (props) => (
      <View>
        <Image 
          source = {require('./assets/qrflogo.png')}
          style={{width: width * 0.8, height: height * 0.25}}
        />
        <ScrollView>
          <DrawerItems {...props} 
            activeLabelStyle = {{color: 'black'}}
          />
          <TouchableOpacity 
            style = {{paddingLeft: 16, paddingBottom: 13, paddingTop: 10}}
            onPress = {() => {Linking.openURL("https://play.google.com/store/apps/details?id=com.kaya.qr_reader_and_generator");}}
          >
            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name = "star" size = {24} color = "#888888" />
              <Text style = {{fontSize: 14, fontWeight: 'bold', paddingLeft: 32 , color: 'black'}}>Rate App</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style = {{paddingLeft: 16, paddingVertical: 14.5}}
            onPress = {() => {Linking.openURL("mailto:ibraberatkaya@gmail.com?subject=Feedback");}}
          >
          <View style = {{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name = "email" size = {24} color = "#888888" />
            <Text style = {{fontSize: 14, fontWeight: 'bold', paddingLeft: 32 , color: 'black'}}>Feedback</Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style = {{paddingLeft: 16, paddingVertical: 14.5}}
            onPress = {() => {Alert.alert("Help", "Click the scan button to scan a QR Code with your camera. You can click the icon below the text in the result screen to call or text a number, add an event etc.\n\nClick the generate button to generate a QR Code (requires internet connection). Click on the QR Code to download it.");}}
          >
          <View style = {{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name = "help-circle" size = {24} color = "#888888" />
            <Text style = {{fontSize: 14, fontWeight: 'bold', paddingLeft: 32 , color: 'black'}}>Help</Text>
          </View>
          </TouchableOpacity> 
        </ScrollView>
      </View>
     )
  }
);


AppNavigator.navigationOptions = ({
  drawerIcon: (<Icon name = "home" />),
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