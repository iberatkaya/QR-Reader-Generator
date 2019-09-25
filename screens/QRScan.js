import React from "react";
import { View, Text, TouchableOpacity, Dimensions, PermissionsAndroid, Image } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';

var { width, height } = Dimensions.get('screen');

export default class QRScanScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "", showHint: '', displaytext: '', sendobj: {}, overlaycolor: 'white', opacity: 0, type: '' };
  }

  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation
    return {
      title: 'Scan',
      headerStyle: { backgroundColor: 'skyblue', elevation: 2 },
      headerTintColor: '#fff',
      headerRight: (
        <TouchableOpacity
          onPress={async () => {
            //getRollPerm(); implement
            const res = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
            console.log(res)
            if (res == 'granted') {
              ImagePicker.launchImageLibrary({}, (resp) => {
                console.log(resp)
                if (!resp.didCancel)
                  navigate("QRScanGallery", { path: resp.path });
              });
            }
          }}
          style={{ paddingRight: 12 }}
        >
          <Icon name="image" size={32} color="#ffffff" />
        </TouchableOpacity>
      )
    }
  }

  _retrieveData = async () => {
    try {
      value = await AsyncStorage.getItem('ShowHint');
      console.log(value);
      if (value !== null) {
        return value;
      }
      else {
        return "Yes";
      }
    } catch (error) {
      console.log(error);
    }
  };


  componentDidMount() {
    this._retrieveData().then((value) => {
      this.setState({ showHint: value });
      //  console.log("mount " + value);
    });
  }

  parseContact = (text) => {
    var newtext = "";
    newtext = text.replace(/\n/g, ",");
    newtext = newtext.replace(/;/g, " ");
    newtext = newtext.replace(/\s+/g, ' ');
    var objstr = "";
    //console.log(newtext);
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
    //console.log("Mess: " + mess + "\nNum: " + num);
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
    //console.log("Mail: " + mail);
    while (text[i] != ":")
      i++;
    i++;
    while (text[i] != ";" && text[i + 1] != "B") {
      sub += text[i];
      i++;
    }
    i++;
    //console.log("Sub: " + sub);
    while (text[i] != ":")
      i++;
    i++;
    while (text[i] != ";" && text[i + 1] != ";") {
      body += text[i];
      i++;
    }
    //console.log("Body: " + body);
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
    //getPerm();
    return (
      <RNCamera style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        captureAudio={false}
        onBarCodeRead={(obj) => {
          //console.log(obj.data);
          var text = obj.data;
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
                    sendtext += "Address:" + cont[prop] + "\n";
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
            sendtext = "Number: " + this.parseNumber(text);
            sendobj = { Number: this.parseNumber(text) };
          }
          this.setState({
            text: text,
            displaytext: sendtext,
            icon: icon,
            sendobj: sendobj,
            type: type,
            opacity: 1,
            backgroundColor: 'rgba(255, 120, 120, 0.5)',
            overlaycolor: 'rgb(180, 255, 180)',
          }, () => {
            if (this.state.showHint == "No") {
              this.setState({ overlaycolor: 'white', opacity: 0 }, () => {
                this.props.navigation.navigate("QRScanResult", { textvalue: sendtext, type: type, icon: icon, obj: sendobj });
              });
            }
          });
        }}
      >

        <Image source={require("../assets/cameraoverlaythin.png")}
          style={{ position: 'absolute', resizeMode: 'contain', tintColor: this.state.overlaycolor }}
          width={width * 0.95}
          height={height * 0.95}
        />

        <TouchableOpacity
          onPress={() => {
            this.setState({ overlaycolor: 'white', text: "", opacity: 0 }, () => {
              var text = this.state.sendtext;
              this.props.navigation.navigate("QRScanResult", { textvalue: this.state.displaytext, type: this.state.type, icon: this.state.icon, obj: this.state.sendobj });
            });
          }} >
          <View style={{ backgroundColor: "rgba(250, 120, 120, 0.4)", opacity: this.state.opacity, marginTop: 100, padding: 12, borderRadius: 16, maxHeight: 250, maxWidth: 220, overflow: 'hidden' }} >
            <Text style={{ fontSize: 18, color: '#000000' }}>{this.state.displaytext}</Text>
          </View>
        </TouchableOpacity>
      </RNCamera>
    );
  };

}