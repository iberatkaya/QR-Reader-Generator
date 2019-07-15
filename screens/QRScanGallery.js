import React from "react";
import { View, Text, ScrollView, ToastAndroid, Linking, PermissionsAndroid, Alert, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { QRreader } from 'react-native-qr-scanner';
import ImagePicker from 'react-native-image-picker';
import SQLite from 'react-native-sqlite-2';
const db = SQLite.openDatabase("Scanned.db", '1.0', '', 1);
import AutoLink from 'react-native-autolink';


export default class QRScanGalleryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "", type: 'Text', icon: 'format-color-text', obj: {} };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Scan From Gallery',
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

  _pickimg = async () => {
    await ImagePicker.launchImageLibrary({}, (res) => {
      if (res.uri) {
        var path = res.path;
        if (!path) {
          path = res.uri;
        }
        QRreader(path).then((x) => {
          //  Alert.alert(data);
          if (x === undefined || x.length === 0) {
            this.setState({
              type: "Not Found",
              icon: "alert-circle-outline",
              text: "No QR Code was found!"
            });
            return;
          }
          var text = x;
          var type = "Text";
          var icon = "format-color-text";
          var sendtext = text;
          var sendobj = {};
          if (text.includes("BEGIN:VCARD") && text.includes("END:VCARD")) {
            type = "Contact";
            icon = "account-box-outline";
            try {
              var cont = this.parseContact(text);
              sendtext = "";
              for (var prop in cont) {
                if (prop != "BEGIN" && prop != "END" && prop != "N" && prop != "VERSION" && cont[prop] != "") {
                  if (prop == "FN")
                    sendtext += "Name: " + cont[prop] + "\n";
                  else if (prop == "ORG")
                    sendtext += "Organisation: " + cont[prop] + "\n";
                  else if (prop == "ADR")
                    sendtext += "Address: " + cont[prop] + "\n";
                  else if (prop == "TEL WORK VOICE")
                    sendtext += "Tel (Work): " + cont[prop] + "\n";
                  else if (prop == "TEL HOME VOICE")
                    sendtext += "Tel (Home): " + cont[prop] + "\n";
                  else if (prop == "TEL CELL")
                    sendtext += "Tel (Cell): " + cont[prop] + "\n";
                  else if (prop == "TEL FAX")
                    sendtext += "Tel (Fax): " + cont[prop] + "\n";
                  else if (prop == "EMAIL WORK INTERNET")
                    sendtext += "Email (Work): " + cont[prop] + "\n";
                  else if (prop == "EMAIL HOME INTERNET")
                    sendtext += "Email (Home): " + cont[prop] + "\n";
                  else if (prop == "URL")
                    sendtext += "Website: " + cont[prop] + "\n";
                  else
                    sendtext += prop + ": " + cont[prop] + "\n";
                }
              }
            } catch (e) {
              sendtext = e;
            }
          }
          else if (text.includes("BEGIN:VEVENT") && text.includes("END:VEVENT")) {
            type = "Event";
            icon = "calendar";
            sendtext = "";
            var obj = this.parseEvent(text);
            for (var prop in obj) {
              if (prop != "BEGIN" && prop != "END") {
                if (prop == "SUMMARY") {
                  sendtext += "Event: " + obj[prop] + '\n';
                }
                else if (prop == "DTSTART") {
                  sendtext += "Begin: " + obj[prop][6] + obj[prop][7] + "." + obj[prop][4] + obj[prop][5] + "." + obj[prop][0] + obj[prop][1] + obj[prop][2] + obj[prop][3] + '\n';
                }
                else if (prop == "DTEND") {
                  sendtext += "End: " + obj[prop][6] + obj[prop][7] + "." + obj[prop][4] + obj[prop][5] + "." + obj[prop][0] + obj[prop][1] + obj[prop][2] + obj[prop][3] + '\n';
                }
                else
                  sendtext += prop + ": " + obj[prop] + "\n";
              }
            }
            sendobj = obj;
          }
          else if (text.includes("MATMSG:")) {
            type = "Email";
            icon = "email";
            sendtext = "";
            var obj = this.parseEmail(text);
            for (var prop in obj) {
              if (obj[prop] != "")
                sendtext += prop + ": " + obj[prop] + '\n';
            }
            sendobj = obj;
          }
          else if (text.includes("WIFI:") && text.includes(";S")) {
            type = "Wifi";
            icon = "wifi";
            sendtext = "";
            var obj = this.parseWifi(text);
            for (var prop in obj) {
              if (obj[prop] != "")
                sendtext += prop + ": " + obj[prop] + '\n';
            }
          }
          else if (text.includes("://") || text.includes("www.")) {
            type = "Link";
            icon = "earth";
          }
          else if (text.includes("SMSTO:")) {
            type = "SMS";
            icon = "message";
            var obj = this.parseSMS(text);
            sendtext = "";
            for (var prop in obj) {
              if (obj[prop] != "")
                sendtext += prop + ": " + obj[prop] + '\n';
            }
            sendobj = obj;
          }
          else if (text.includes("tel:")) {
            type = "Number";
            icon = "phone";
            var num = this.parseNumber(text)
            sendtext = "Number: " + num;
            sendobj = { Number: num };
          }
          this.props.navigation.setParams({
            type: type
          });
          this.setState({
            text: sendtext,
            type: type,
            icon: icon,
            obj: sendobj
          });
          db.transaction(tx => {
            tx.executeSql('INSERT INTO QRS(type, value) VALUES(?, ?)', [type, sendtext], (tx, res) => { }, () => { });
          });
        });
      }
      else {
        this.props.navigation.setParams({
          type: "Text"
        });
        this.setState({
          type: "Error",
          icon: "alert-circle-outline",
          text: "No image was selected!"
        });
      }
    });
  }

  componentDidMount() {
    this._pickimg();
    /*
    else if(!this.isCancelled){
      var text = jsQR(res);
      Alert.alert(text.data);
      */
  }


  parseContact = (text) => {
    var newtext = "";
    newtext = text.replace(/\n/g, ",");
    newtext = newtext.replace(/;/g, " ");
    newtext = newtext.replace(/\s+/g, ' ');
    var objstr = "";
    var temp = newtext.split(",");
    for (var i in temp) {
      temp[i] = temp[i].replace(/:/, '":"');
    }
    var newtext = temp.join("\",\"");
    objstr = ("\"" + newtext + "end").replace(",\"end", "");
    try {
      var obj = JSON.parse("{" + objstr + "}");
    } catch (e) {
      throw "Error in QR Code\n" + text;
    }
    return obj;
  }

  parseSMS = (text) => {
    var i = 0;
    while (text[i] != ':') {
      i++;
    }
    i++;
    var num = "";
    while (text[i] != ':') {
      num += text[i];
      i++;
    }
    i++;
    var mess = "";
    while (i < text.length) {
      mess += text[i];
      i++;
    }
    var obj = { "Number": num, "Message": mess };
    return obj;
  }

  parseNumber = (text) => {
    var i = 0;
    while (text[i] != ":")
      i++;
    i++;
    var num = "";
    while (i < text.length) {
      num += text[i];
      i++;
    }
    return num;
  }

  parseEvent = (text) => {
    var lines = text.split("\n");
    var str = "";
    for (var i in lines) {
      if (i != lines.length - 1)
        str += "\"" + lines[i].replace(":", "\":\"") + "\",";
      else
        str += "\"" + lines[i].replace(":", "\":\"") + "\"";
    }
    var obj = JSON.parse("{" + str + "}");
    return obj;
  }

  parseEmail = (text) => {
    var i = 10;
    var mail = "";
    var sub = "";
    var body = "";
    while (text[i] != ";") {
      mail += text[i];
      i++;
    }
    i++;
    while (text[i] != ":")
      i++;
    i++;
    while (text[i] != ";" && text[i + 1] != "B") {
      sub += text[i];
      i++;
    }
    i++;
    while (text[i] != ":")
      i++;
    i++;
    while (text[i] != ";" && text[i + 1] != ";") {
      body += text[i];
      i++;
    }
    var obj = { "Email": mail, "Subject": sub, "Body": body };
    return obj;
  }

  parseWifi = (text) => {
    var passtype = "";
    var ssid = "";
    var pass = "";
    var i = 7;
    while (text[i] != ";") {
      passtype += text[i];
      i++;
    }
    i++;
    while (text[i] != ":")
      i++;
    i++;
    while (text[i] != ";") {
      ssid += text[i];
      i++;
    }
    i++;
    while (text[i] != ":")
      i++;
    i++;
    while (text[i] != ";" && text[i + 1] != ";") {
      pass += text[i];
      i++;
    }
    var obj = { "SSID": ssid, "Password": pass, "Encryption": passtype };
    return obj;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: "stretch" }}>
          <View style={{ flex: 0.3, backgroundColor: "rgba(180, 180, 250, 0.3)", alignItems: 'center' }}>
            <Text style={{ color: "red", fontSize: 39, paddingBottom: 2, paddingTop: 6, fontFamily: 'sans-serif-light' }}>{this.state.type}</Text>
            <TouchableOpacity onPress={async () => {
              var obj = this.state.obj;
              if (this.state.type == "Event") {
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
              else if (this.state.type == "Email")
                Linking.openURL("mailto:" + obj.Email + "?subject=" + encodeURIComponent(obj.Subject).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/!/g, "%21").replace(/'/g, "%27").replace(/\*/g, "%2A") + "&body=" + encodeURIComponent(obj.Body).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/!/g, "%21").replace(/'/g, "%27").replace(/\*/g, "%2A"));
              else if (this.state.type == "SMS")
                Linking.openURL("sms:" + obj.Number + "?body=" + encodeURIComponent(obj.Message).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/!/g, "%21").replace(/'/g, "%27").replace(/\*/g, "%2A"));
              else if (this.state.type == "Number")
                Linking.openURL("tel:" + obj.Number);
            }
            }>
              <Icon name={this.state.icon} style={{ paddingBottom: 4 }} size={42} color="#111111" />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 0.7, overflow: 'scroll', backgroundColor: 'rgba(250, 180, 180, 0.3)', paddingLeft: 14, paddingRight: 12, paddingTop: 6 }}>
            <AutoLink style={{ fontSize: 23, paddingBottom: 12, color: 'black' }} text={this.state.text} />
          </ScrollView>
        </View>
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
