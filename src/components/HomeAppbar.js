// import {useState} from 'react';
// import { Button, View } from "react-native";
import { Appbar } from 'react-native-paper';

// icon source - https://materialdesignicons.com/ ; https://icons.expo.fyi/

const HomeAppbar = (props) => {

  return(
    <Appbar.Header>
      {/* <Appbar.BackAction onPress={() => {}} /> */}
      <Appbar.Content title="Expendo1" />
      <Appbar.Action icon="calendar-outline" onPress={() => {
        console.log("calendar button pressed", Date.now())
        props.navigation.setParams({"isDatePickerVisible": true})
      }} />
      <Appbar.Action icon="plus-circle" onPress={() => {
        // let x = moment(Date.now()).utcOffset('+5:30').format('MMMM DD, Y hh:mm')
        // console.log("plus button pressed", x, typeof(x))
        props.navigation.setParams({"modalVisible": true})
      }} />
      <Appbar.Action icon="dots-vertical" onPress={() => props.navigation.toggleDrawer()}/>
    </Appbar.Header> );
  }

export default HomeAppbar;