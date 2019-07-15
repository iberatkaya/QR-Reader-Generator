import React from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity, ToastAndroid, PermissionsAndroid, Linking } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AutoLink from 'react-native-autolink';
import RNCalendarEvents from 'react-native-calendar-events';
import SQLite from 'react-native-sqlite-2';
const db = SQLite.openDatabase("Scanned.db", '1.0', '', 1);

export default class QRScanResultScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Result',
            headerStyle: { backgroundColor: 'skyblue', elevation: 2 },
            headerTintColor: '#fff',
            headerRight: (
                <View>
                    {
                        (navigation.getParam('type') == "Event" || navigation.getParam('type') == "Email" || navigation.getParam('type') == "Number" || navigation.getParam('type') == "SMS") ? (
                            <TouchableOpacity
                                onPress={() => {
                                    if (navigation.getParam('type') == "Event")
                                        Alert.alert("Help", "Click the icon to add the event to your calendar.");
                                    else if (navigation.getParam('type') == "Email")
                                        Alert.alert("Help", "Click the icon to send an email.");
                                    else if (navigation.getParam('type') == "Number")
                                        Alert.alert("Help", "Click the icon to call the number.");
                                    else if (navigation.getParam('type') == "SMS")
                                        Alert.alert("Help", "Click the icon to send an SMS.");
                                }}
                                style={{ paddingRight: 12 }}
                            >
                                <Icon name="help-circle" size={32} color="#ffffff" />
                            </TouchableOpacity>) : <View></View>
                    }
                </View>
            )
        };
    };


    componentDidMount() {
        const { navigation } = this.props;
        var type = navigation.getParam('type');
        var textvalue = navigation.getParam('textvalue');
        db.transaction(tx => {
            tx.executeSql('INSERT INTO QRS(type, value) VALUES(?, ?)', [type, textvalue], (tx, res) => { }, () => { });
        });
    }

    render() {

        return (
            <View style={{ flex: 1, alignItems: "stretch" }}>
                <View style={{ flex: 0.3, backgroundColor: "rgba(180, 180, 250, 0.3)", alignItems: 'center' }}>
                    <Text style={{ color: "red", fontSize: 39, paddingBottom: 2, paddingTop: 6, fontFamily: 'sans-serif-light' }}>{this.props.navigation.getParam('type')}</Text>
                    <TouchableOpacity onPress={async () => {
                        var obj = this.props.navigation.getParam('obj');
                        if (this.props.navigation.getParam('type') == "Event") {
                            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR).then((res) => {
                                if (res == 'granted') {
                                    this.createCalEv(obj).then((x) => {
                                        ToastAndroid.show("Added to Calendar", ToastAndroid.SHORT)
                                    }).catch((e) => {
                                        ToastAndroid.show("Error. Couldn't add.", ToastAndroid.SHORT)
                                    });
                                }
                                else
                                    ToastAndroid.show("Permission not granted.", ToastAndroid.SHORT)
                            });
                        }
                        else if (this.props.navigation.getParam('type') == "Email")
                            Linking.openURL("mailto:" + obj.Email + "?subject=" + encodeURIComponent(obj.Subject).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/!/g, "%21").replace(/'/g, "%27").replace(/\*/g, "%2A") + "&body=" + encodeURIComponent(obj.Body).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/!/g, "%21").replace(/'/g, "%27").replace(/\*/g, "%2A"));
                        else if (this.props.navigation.getParam('type') == "SMS")
                            Linking.openURL("sms:" + obj.Number + "?body=" + encodeURIComponent(obj.Message).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/!/g, "%21").replace(/'/g, "%27").replace(/\*/g, "%2A"));
                        else if (this.props.navigation.getParam('type') == "Number")
                            Linking.openURL("tel:" + obj.Number);
                    }
                    }>
                        <Icon name={this.props.navigation.getParam('icon')} style={{ paddingBottom: 4 }} size={42} color="#111111" />
                    </TouchableOpacity>
                </View>
                <ScrollView style={{ flex: 0.7, overflow: 'scroll', backgroundColor: 'rgba(250, 180, 180, 0.3)', paddingLeft: 14, paddingRight: 12, paddingTop: 6 }}>
                    <AutoLink style={{ fontSize: 23, paddingBottom: 12, color: '#000000' }} text={this.props.navigation.getParam('textvalue')} />
                </ScrollView>
            </View>
        );
    }


    createCalEv = async (obj) => {
        var prop = "DTSTART";
        var stdate = obj[prop][0] + obj[prop][1] + obj[prop][2] + obj[prop][3] + "-" + obj[prop][4] + obj[prop][5] + "-" + obj[prop][6] + obj[prop][7] + "T" + obj[prop][9] + obj[prop][10] + ":" + obj[prop][11] + obj[prop][12] + ':00.000Z';
        prop = "DTEND";
        var enddate = obj[prop][0] + obj[prop][1] + obj[prop][2] + obj[prop][3] + "-" + obj[prop][4] + obj[prop][5] + "-" + obj[prop][6] + obj[prop][7] + "T" + obj[prop][9] + obj[prop][10] + ":" + obj[prop][11] + obj[prop][12] + ':00.000Z';
        //Alert.alert('ev' ,"st " + stdate + '\ned' + enddate);
        RNCalendarEvents.saveEvent(
            obj.SUMMARY,
            {
                startDate: stdate,
                endDate: enddate
            }
        );
    }


}
