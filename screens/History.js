import React from "react";
import { FlatList, Text, View, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-2';
const db = SQLite.openDatabase("Scanned.db", '1.0', '', 1);
import { NavigationEvents } from 'react-navigation';
import AutoLink from 'react-native-autolink';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

var checkdb = true;

export default class HistoryScreen extends React.Component {

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


    render() {
        return (
            <View>
                <NavigationEvents onDidFocus={() => {
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
                }} />
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
                        <Text style={{ color: 'white', fontSize: 21, fontFamily: 'sans-serif-light' }}>Clear History</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={this.state.hisdata}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ marginVertical: 3, marginHorizontal: 2 }}>
                                <View style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: 'rgba(180, 180, 250, 0.3)' }}>
                                    <Text style={{ color: "red", fontSize: 24, paddingBottom: 8, paddingTop: 6, fontFamily: 'sans-serif-light' }}>{item.type}</Text>
                                    <Icon style={{ position: 'absolute', right: 8 }} name="delete" size={26}
                                        onPress={() => {
                                            db.transaction((tx) => {
                                                //    console.log('DELETE FROM QRS WHERE id = ' + item.id);
                                                tx.executeSql('DELETE FROM QRS WHERE id = ' + item.id, [], (tx, res) => {
                                                    ToastAndroid.show("Deleted", ToastAndroid.SHORT);
                                                });
                                                tx.executeSql('SELECT * FROM QRS', [], (tx, res) => {
                                                    var len = res.rows.length;
                                                    var arr = [];
                                                    for (let i = 0; i < len; i++) {
                                                        arr.push(res.rows.item(i));
                                                    }
                                                    this.setState({ hisdata: arr.reverse() });
                                                    //        console.log(res.rows._array);
                                                });
                                            });
                                        }}
                                    />
                                </View>
                                <View style={{ borderBottomLeftRadius: 12, borderBottomRightRadius: 12, paddingHorizontal: 8, paddingTop: 12, paddingBottom: 14, backgroundColor: 'rgba(250, 180, 180, 0.3)' }}>
                                    <AutoLink style={{ fontSize: 19, color: 'black' }} text={item.value} />
                                </View>
                            </View>
                        );
                    }}
                />
            </View>
        );
    }
}
