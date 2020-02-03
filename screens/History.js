import React from "react";
import { FlatList, ScrollView, Text, View, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-2';
const db = SQLite.openDatabase("Scanned.db", '1.0', '', 1);
import { NavigationEvents } from 'react-navigation';
import AutoLink from 'react-native-autolink';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

var checkdb = true;

export default class HistoryScreen extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            hisdata: []
        };
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'History',
        headerStyle: { backgroundColor: 'skyblue', elevation: 2 },
        headerTintColor: '#fff',
    });

    componentDidMount(){
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM QRS', [], (tx, res) => {
                var len = res.rows.length;
                var arr = [];
                for (let i = 0; i < len; i++) {
                    arr.push(res.rows.item(i));
                }
                this.setState({ hisdata: arr.reverse() });
            });
        });
    }

    render() {
        return (
            <ScrollView>
                <View style={{ backgroundColor: 'lightblue', alignItems: 'center', paddingVertical: 8 }}>
                    <TouchableOpacity
                        onPress={() => {
                            db.transaction((tx) => {
                                tx.executeSql('DELETE FROM QRS', [], (tx, res) => {
                                    this.setState({ hisdata: [] });
                                    ToastAndroid.show("Cleared History", ToastAndroid.SHORT);
                                    //        console.log(res.rows._array);
                                });
                            });
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 21, fontFamily: Platform.OS === "android" ? 'sans-serif-light' : "Helvetica" }}>Clear History</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={this.state.hisdata}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        return (
                            <MyListItem item={item} />
                        );
                    }}
                />
            </ScrollView>
        );
    }
}

class MyListItem extends React.PureComponent {
    render() {
      return (
        <View style={{ marginVertical: 3, marginHorizontal: 2 }}>
            <View style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: 'rgba(180, 180, 250, 0.3)' }}>
                <Text style={{ color: "red", fontSize: 24, paddingBottom: 8, paddingTop: 6, fontFamily: Platform.OS === "android" ? 'sans-serif-light' : "Helvetica" }}>{this.props.item.type}</Text>
            </View>
            <View style={{ borderBottomLeftRadius: 12, borderBottomRightRadius: 12, paddingHorizontal: 8, paddingTop: 12, paddingBottom: 14, backgroundColor: 'rgba(250, 180, 180, 0.3)' }}>
                <AutoLink style={{ fontSize: 19, color: 'black' }} text={this.props.item.value} />
            </View>
        </View>
      )
    }
  }