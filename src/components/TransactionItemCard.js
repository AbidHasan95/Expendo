import React, { Component } from 'react';
import {Button, Modal, StyleSheet, Text, View, Animated, I18nManager} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
// import {removeData} from '../utils/tasksUtil';

// iter 1

// class AppleStyleSwipeableRow extends Component {
//   renderLeftActions = (progress, dragX) => {
//     const trans = dragX.interpolate({
//       inputRange: [0, 50, 100, 101],
//       outputRange: [-20, 0, 0, 1],
//     });
//     return (
//       <RectButton style={styles.leftAction} onPress={this.close}>
//         <Animated.Text
//           style={[
//             styles.actionText,
//             {
//               transform: [{ translateX: trans }],
//             },
//           ]}>
//           Archive
//         </Animated.Text>
//       </RectButton>
//     );
//   };
//   render() {
//     return (
//       <Swipeable renderLeftActions={this.renderLeftActions}>
//         <Text>"hello1"</Text>
//       </Swipeable>
//     );
//   }
// }

// iter 2

class AppleStyleSwipeableRow extends Component {
  renderLeftActions = (
    _progress,
    dragX
  ) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
      extrapolate: 'clamp',
    });
    return (
      <RectButton style={styles.leftAction} onPress={this.close}>
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}>
          Archive
        </Animated.Text>
      </RectButton>
    );
  };

  renderRightAction = (
    text,
    color,
    x,
    progress
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    const pressHandler = () => {
      this.close();
      // eslint-disable-next-line no-alert
      if (text=='Delete') {
        // console.log("Delete props==>",this.props)
        this.props.dispatchCallback({type: 'remove', dateAsKey: this.props.dateAsKey, itemKey: this.props.itemKey})
      }
      // window.alert(text);
    };

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}>
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };

  renderRightActions = (
    progress,
    _dragAnimatedValue
  ) => (
    <View
      style={{
        width: 192,
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      }}>
      {/* {this.renderRightAction('More', '#C8C7CD', 192, progress)} */}
      {this.renderRightAction('Edit', '#ffab00', 128, progress)}
      {this.renderRightAction('Delete', '#dd2c00', 64, progress)}
    </View>
  );


  updateRef = (ref) => {
    this.swipeableRow = ref;
  };
  close = () => {
    this.swipeableRow?.close();
  };
  render() {
    const { children } = this.props;
    // console.log("object props===>",this.props);
    
    // dispatch({type: 'get', fetchedData: fetchedData})
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        enableTrackpadTwoFingerGesture
        leftThreshold={30}
        rightThreshold={40}
        renderLeftActions={this.renderLeftActions}
        renderRightActions={this.renderRightActions}
        onSwipeableOpen={(direction) => {
          console.log(`Opening swipeable from the ${direction}`);
        }}
        onSwipeableClose={(direction) => {
          console.log(`Closing swipeable to the ${direction}`);
        }}>
        {children}
      </Swipeable>
    );
  }
}

const TransactionItemCard = (props) => {
    // console.log("props--->",props)
    return (

      <AppleStyleSwipeableRow dispatchCallback={props.dispatchCallback} dateAsKey={props.dateAsKey} itemKey={props.addTime}>
        <RectButton style={styles.rectButton} onPress={() => window.alert("test1")}>
        <Text style={styles.fromText}>{props.title}</Text>
        <Text numberOfLines={2} style={styles.messageText}>
        {/* {props.label} */}
        Food; Home Essentials; Snacks
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
    leftAction: {
      flex: 1,
      backgroundColor: '#497AFC',
      justifyContent: 'center',
    },
    actionText: {
      color: 'white',
      fontSize: 16,
      backgroundColor: 'transparent',
      padding: 10,
    },
    rightAction: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
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