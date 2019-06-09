import React from "react";
import { View, Text, Picker, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import {AsyncStorage} from '@react-native-community/async-storage';


export default class SettingsScreen extends React.Component {

    _retrieveData = async () => {
        try{
             value = await AsyncStorage.getItem('ShowHint');
            if (value !== null) {
                return value;
            }
            else{
                return "Yes";
            }
        } catch (error) {
        }
    };

    _storeData = async (choise) => {
        try {
          await AsyncStorage.setItem('ShowHint', choise);
        } catch (error) {
          // Error saving data
        }
      };

    constructor(props){
        super(props);
        this.state = {
            showHint: 'a'
        }
    }

    componentDidMount(){
        this._retrieveData().then((value)=>{
            this.setState({showHint: value});
        });
    }
    
  static navigationOptions = ({ navigation }) => ({
    title: 'Settings',
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


    render(){
        return(
            <View>
                <View style = {{flexDirection: 'row', paddingTop: 10, paddingBottom: 8}}>
                    <Text style = {{alignSelf: 'center', fontSize: 18, paddingLeft: 18}}>Show Hint: </Text>
                    <Picker
                        style = {{width: 90, alignSelf: 'center'}}
                        selectedValue = {this.state.showHint}       
                        onValueChange = {(itemVal, itemindex) => {
                            this._storeData(itemVal);
                            this.setState({showHint: itemVal});
                        }}
                    >
                        <Picker.Item label = "Yes" value = "Yes" />
                        <Picker.Item label = "No" value = "No" />
                    </Picker>
                </View>
                <View
                style={{
                    borderBottomColor: 'rgba(40, 40, 40, 0.15)',
                    borderBottomWidth: 1,
                    }}
                />
            </View>
        );
    }
}