// import React, { Component } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import AppleStyleSwipeableRow from './AppleStyleSwipeableRow';


const TransactionItemCard = (props) => {
    // console.log("props--->",props)
    return (
      <AppleStyleSwipeableRow dispatchCallback={props.dispatchCallback} dateAsKey={props.dateAsKey} itemKey={props.addTime} dateTimeKeys={props.dateTimeKeys} docName={props.docName} transactionItemDeleteCallback={props.transactionItemDeleteCallback}>
        <RectButton style={styles.rectButton} onPress={() => window.alert("test1")}>
          <Text style={styles.fromText}>{props.title}</Text>
          <Text numberOfLines={2} style={styles.messageText}>
          {props.emojiLabels}
          {/* Food; Home Essentials; Snacks */}
          </Text>
          <Text style={styles.dateText}>{props.amount}</Text>
        </RectButton>
      </AppleStyleSwipeableRow>

        // <View style={styles.mycard}>
        //     {/* <Text>{props.title} -- {props.amount}</Text> */}
            // <View style={styles.leftcontent}>
            //     <Text>{props.title}</Text>
            //     <Text>{props.label}</Text>
            // </View>
            // <View style={styles.rightcontent}>
            //     <Text>{props.amount}</Text>
            // </View>
        // </View>
    );
}

const styles = StyleSheet.create({
    mycard: {
        // position: "absolute",
        width: "auto",
        height:"auto",
        borderWidth: 2,
        borderRadius: 5,
        shadowColor: "rgb(0,0,0)",
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        backgroundColor: "rgb(0,0,0,0.5)",
        padding: 5,
        marginTop: 5,
        marginHorizontal: 5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    leftcontent: {
        width: "auto",
        height: "auto",
        // backgroundColor: "rgb(0,0,0)",
        // borderWidth: 2,
        padding: 5,
        display: "flex",
        color: "rgba(251,206, 205,1)",
        
        flexDirection: "column",
        justifyContent:"center",
    },
    rightcontent: {
        width: "auto",
        height: "auto",
        // position:"relative",
        // borderWidth: 2,
        borderColor: "rgb(200,0,0)",
        // backgroundColor: "rgb(0,0,0)",
        padding: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent:"flex-end",
        alignItems: "flex-end",
        alignSelf: "auto",
        // flexShrink: 0,
    },
    rectButton: {
      flex: 1,
      height: 80,
      paddingVertical: 10,
      paddingHorizontal: 20,
      justifyContent: 'space-between',
      flexDirection: 'column',
      backgroundColor: 'white',
    },
    messageText: {
      color: '#999',
      backgroundColor: 'transparent',
    },
    dateText: {
      backgroundColor: 'transparent',
      position: 'absolute',
      right: 20,
      top: 10,
      color: '#999',
      fontWeight: 'bold',
    },
  });

export default TransactionItemCard;