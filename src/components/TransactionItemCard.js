// import React, { Component } from 'react';
import { Card, Text,Title, Paragraph } from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import AppleStyleSwipeableRow from './AppleStyleSwipeableRow';
import color from 'color'


const TransactionItemCard = (props) => {
    // console.log("props--->",props)
    const theme = props.theme
    return (
      <AppleStyleSwipeableRow dispatchCallback={props.dispatchCallback} dateAsKey={props.dateAsKey} itemKey={props.addTime} dateTimeKeys={props.dateTimeKeys} docName={props.docName} transactionItemDeleteCallback={props.transactionItemDeleteCallback}>
        <Card style={{marginHorizontal:0,marginVertical:0}} onPress={() => props.navigation.setParams({"modalVisible": true})}>
          <Card.Content style={{padding:0,borderColor:"black",borderWidth:0,margin:0}}>

          {/* <RectButton style={[styles.rectButton, {backgroundColor: "transparent", color:theme.colors.onSecondaryContainer}]}>  */}
            {/* <Text style={[styles.fromText,{color: theme.colors.onSecondaryContainer}]}>{props.title}</Text>
            <Text numberOfLines={1} style={styles.messageText}>
            {props.emojiLabels}
            </Text>
            <Text style={styles.dateText}>{props.amount}</Text> */}
            <View style={styles.mycard}>
                <View style={styles.leftcontent}>
                    <Text style={{fontSize:14}}>{props.title}</Text>
                    <Text>{props.emojiLabels}</Text>
                </View>
                <View style={styles.rightcontent}>
                    <Text style={{fontSize:16}}>{props.amount}</Text>
                </View>
           </View>
          {/* </RectButton>  */}
          </Card.Content>

        </Card>  
      </AppleStyleSwipeableRow>

        // <View style={styles.mycard}>
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
        // width: "auto",
        // height:"auto",
        // borderWidth: 2,
        // borderRadius: 5,
        // shadowColor: "rgb(0,0,0)",
        // shadowOffset: {
        //     width: 0,
        //     height: 10
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // backgroundColor: "rgb(0,0,0,0.5)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    leftcontent: {
        // width: "auto",
        // height: 50,
        height:50,
        // backgroundColor: "rgb(0,0,0)",
        // borderWidth: 1,
        flex:1,
        // flexDirection:"row",
        // justifyContent:"space-between",
        // padding: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent:"space-between",
    },
    rightcontent: {
        // width: "auto",
        // height: "auto",
        // position:"relative",
        // borderWidth: 2,
        borderColor: "rgb(200,0,0)",
        // borderWidth:1,
        // backgroundColor: "rgb(0,0,0)",
        padding: 5,
        display: "flex",
        // flexDirection: "column",
        // justifyContent:"flex-end",
        // alignItems: "flex-end",
        // alignSelf: "auto",
        // flexShrink: 0,
    },
    rectButton: {
      flex: 1,
      height: 50,
      // paddingVertical: 10,
      // paddingHorizontal: 20,
      justifyContent: 'space-between',
      flexDirection: 'column',
      backgroundColor: 'white',
    },
    messageText: {
      color: '#999',
      backgroundColor: 'transparent',
    },
    fromText: {
      color: '#555',
      backgroundColor: 'transparent',
      fontSize:13
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