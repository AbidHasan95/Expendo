import React, { useState,useEffect, useReducer } from 'react';
import { View, Text, StyleSheet, Modal, Button, FlatList } from 'react-native';
import ItemAddView from '../components/itemAddModal';
import TransactionItemCard from '../components/TransactionItemCard'
import {itemsReducer, getData} from '../utils/tasksUtil';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*
Y/YYYY -> Year
M -> Month in single-digit(Ex. 8)
MM -> Month in double-digit(Ex. 08)
MMM -> Month short name (Ex. Aug)
MMMM -> Month full name (Ex. August)
D -> Day in single-digit(Ex. 5)
DD -> Day in single double-digit(Ex. 05)
HH -> Hours in 24 hr format
hh -> Hours in 12 hr format
mm -> Minutes
ss -> Seconds
a -> am/pm
*/

const initialItems = [
    {
        title: "Biryani",
        label: "food",
        transactionType: "debit",
        amount: 190,
        key: 123
    },
    {
        title: "Groceries",
        label: "food",
        transactionType: "debit",
        amount: 100,
        key: 124
    },
    {
        title: "",
        label: "misc",
        transactionType: "debit",
        amount: 85,
        key: 125
    }
]
const HomeScreen = (props) => {
    const [isModalVisible, setModalVisible] = useState(false);
    
    const [transactionItems, dispatch] = useReducer(itemsReducer, [])
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    
    const [pickedDate, setPickedDate] = useState({
        dateString:'',
        dateAsKey: '',
    })

    
    
    const showDatePicker = () => {
        // setDatePickerVisibility(true);
        console.log("datepicker shown")
        props.navigation.setParams({"isDatePickerVisible": true})
    };
    
    const hideDatePicker = () => {
        // setDatePickerVisibility(false);
        console.log("datepicker hidden")
        props.navigation.setParams({"isDatePickerVisible": false})
    };

    const handleConfirm = (date) => {

        let currDate = moment(date).utcOffset('+5:30')
        let pickDateString = currDate.format('MMMM DD, Y')
        let pickedDateKey = currDate.format('YYMMDD')
        console.log("on line 75",date)
        hideDatePicker();
        setPickedDate({
            dateString: pickDateString,
            dateAsKey: pickedDateKey
        })

        // dispatch({type: 'get', dateAsKey: pickedDateKey}) // abid
        getData(pickedDateKey, dispatch)
        console.log("A date has been picked: ", initialDateString, initialDateKey);
    };

    // Loads everytime parameters defined inside [] changes
    useEffect(() => {
        console.log("-------------+++++useEffect 1 Triggered +++++----------------")
        if (props.route.params && props.route.params.modalVisible!=undefined && isModalVisible!=props.route.params.modalVisible){
            setModalVisible(props.route.params.modalVisible);
        }

        if (props.route.params && props.route.params.isDatePickerVisible!=undefined && isDatePickerVisible!=props.route.params.isDatePickerVisible){
            console.log("date has changed",isDatePickerVisible, props.route.params.isDatePickerVisible)
            setDatePickerVisibility(props.route.params.isDatePickerVisible);
        }
        else {
            console.log("Date not changed", isDatePickerVisible, props.route.params.isDatePickerVisible)
        }

    },[props.route.params]);

    // executes one-time on startup and never again
    useEffect(() => {
        console.log("-------------+++++useEffect 2 Triggered +++++----------------")
        let currDate = moment(Date.now()).utcOffset('+5:30')
        let initialDateString = currDate.format('MMMM DD, Y')
        let initialDateKey = currDate.format('YYMMDD')
        console.log("A date has been set on start: ", initialDateString, initialDateKey);
        setPickedDate({
            dateString: initialDateString,
            dateAsKey: initialDateKey
        })
        console.log("going to getData")

        getData(initialDateKey, dispatch) // abid
        // dispatch({type: 'get', dateAsKey: initialDateKey})
    },[]);

    return(
        <View style={styles.container}>
            {/* <Text>Hello Abid</Text>
            <Button onPress={() => console.log("++++++++++++++",props,"+++++++++++++++++")} title="Show props logs"/> */}
            {/* <Button onPress={getData(pickedDate.dateAsKey)} title="Async Data"/> */}
            <View style={styles.topSummaryBar}>
                <View style={styles.topSummaryBarLeft}>
                    <Text> {pickedDate.dateString} </Text>
                </View>
                <View style={styles.topSummaryBarRight}>
                    <Text style={styles.topBarSummaryAmount}>₹ 300</Text>
                    <Text style={styles.topBarSummaryAmount}>₹ 1,300</Text>
                </View>
            </View>
            <ItemAddView isModalVisible={isModalVisible} dateAsKey={pickedDate.dateAsKey} itemAddCallback={dispatch} {...props}/>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            <FlatList 
                data={transactionItems}
                renderItem={({item}) => <TransactionItemCard {...item}/>}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    modalView : {
      flex: 1,
      margin:50,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      justifyContent: 'center',
      alignItems: "center"
    },
    container : {
        flex: 1,
        paddingTop: 5,
    },
    topSummaryBar: {
        height: 50,
        marginHorizontal: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "black",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    topSummaryBarLeft: {
        textAlignVertical: "center",
        // borderWidth: 1,
        // alignItems: "center",
        paddingStart: 5,
        justifyContent: "center"
    },
    topSummaryBarRight: {
        display: "flex",
        alignItems: "center",

        // display: "flex",
        justifyContent: "center",
        // borderWidth: 1,
        paddingEnd: 10,
    },
    topBarSummaryAmount: {
        fontSize: 15,
        fontWeight: "600"
    }
  });

  

export default HomeScreen;