import React from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import AppNavigator from './AppNav';

export default class App extends React.Component {
  render() {
    return (
      <AppNavigator/>
    );
  }
}
