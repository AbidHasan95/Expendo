import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View, I18nManager } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

export default class AppleStyleSwipeableRow extends Component {
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
          this.props.transactionItemDeleteCallback(this.props.docName, this.props.itemKey)
          // this.props.dispatchCallback({type: 'remove', dateAsKey: this.props.dateAsKey, itemKey: this.props.itemKey})
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

const styles = StyleSheet.create({
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
});