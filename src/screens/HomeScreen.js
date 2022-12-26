import React, { useState,useEffect, useReducer } from 'react';
import { View, Text, StyleSheet, Modal, Button, FlatList } from 'react-native';
import ItemAddView from '../components/itemAddModal';
import TransactionItemCard from '../components/TransactionItemCard'
import {itemsReducer, getFirestoreCollection, getFirestoreDoc, getExpenditureSummary} from '../utils/tasksUtil';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import {getexpenditureKeys} from '../utils/calculateExpenditure'
import HomeSummaryBar from '../components/HomeSummaryBar';

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
    const [categoryList, dispatch2] = useReducer(itemsReducer, []); // x.map((i) => ({key:i.id, value: i.categoryText})) 
    const [expenditureSummary, expenditureSummaryDispatch] = useReducer(itemsReducer,{
        dailyExpenditure: {credit: 0, debit: 0},
        weeklyExpenditure: {credit: 0, debit: 0},
        monthlyExpenditure: {credit: 0, debit: 0},
        yearlyExpenditure: {credit: 0, debit: 0},

    })
    const [pickedDate, setPickedDate] = useState({
        dateString:'',
        dateAsKey: '',
        dateTimeKeys: '',
    })

    const transactionItemDeleteCallback = (docName, itemKey) => {
        var deltaItem = transactionItems.filter((t) => t.key === itemKey)[0]
        const operation = "remove"
        var updatedItems = transactionItems.filter((item) => item.key!=itemKey)
        updatedItems = {itemsArray: updatedItems}
        // var dateTimeKeys = getexpenditureKeys(currDate,pickedDateKey)
        dispatch({
            type: 'newAdd', 
            collectionName: "dailyRecords", 
            docName: docName,
            updatedItems: updatedItems, 
            dateTimeKeys:pickedDate.dateTimeKeys,
            deltaItem,
            propName: "itemsArray",
            expenditureSummary,
            expenditureSummaryDispatch,
            operation
        });
    }

    const processCategoriesData = (data) =>  {
        data = data.map((i) => ({key:i.id, value: i.categoryText, emojiLabel:i.emojiLabel}))
        return data
    }
    const getWeekNum = (day2) => {
        const day1 = new Date(2000,0,2) // First Sunday of 2000
        var days = Math.floor((day2 - day1) / (24*60*60*1000));
        var weeknum1 = Math.ceil(days/7);
        return weeknum1
    }
    function getSelectedWeekDays(d) {
        d = new Date(d);
        var weekNum = getWeekNum(d)
        var day = d.getDay()
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
        var mon = new Date(d.setDate(diff)); 
        diff = d.getDate() + 6
        var sun = new Date(d.setDate(diff))
        var offset = 24*60*60*1000 
        var days = []
        for (let i=0;i<7;i++) {
            let temp = new Date(mon.getTime() + offset*i)
            var day1 = temp.getDate()
            var month = temp.getMonth()+1
            month = String(month).length==1?`0${month}`:String(month)
            var yr = String(temp.getFullYear()).slice(2)  
            day1 = String(day1).length==1?`0${String(day1)}`:String(day1)
            temp = `${yr}${month}${day1}`
            days.push(temp)
        }
        console.log("days--",days)
        return [days,weekNum]
    }
    const showDatePicker = () => {
        // setDatePickerVisibility(true);
        // console.log("datepicker shown")
        props.navigation.setParams({"isDatePickerVisible": true})
    };
    
    const hideDatePicker = () => {
        // setDatePickerVisibility(false);
        // console.log("datepicker hidden")
        props.navigation.setParams({"isDatePickerVisible": false})
    };

    const handleConfirm = (date) => {
        // console.log("on line 75------",date) // 2022-12-23T07:32:57.085Z
        // let currDate2 = moment(date).utcOffset('+5:30')
        let currDate = moment(date)
        let pickDateString = currDate.format('MMM DD, Y')
        let pickedDateKey = currDate.format('YYMMDD')
        var dateTimeKeys = getexpenditureKeys(currDate,pickedDateKey)
        hideDatePicker();
        setPickedDate({
            dateString: pickDateString,
            dateAsKey: pickedDateKey,
            dateTimeKeys
        })

        
        // dispatch({type: 'get', dateAsKey: pickedDateKey}) // abid
        // getSelectedWeekDays(date)
        // getData(pickedDateKey, dispatch) // using asyncstorage  
        getFirestoreDoc("dailyRecords",pickedDateKey,dispatch,"itemsArray") // using Firebase/firestore
        getExpenditureSummary(expenditureSummaryDispatch, dateTimeKeys)
        // console.log("A date has been picked: ", initialDateString, initialDateKey);
    };

    // function getMonday(d) {
    //     d = new Date(d);
    //     var day = d.getDay(),
    //     diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    //     d.setDate(diff); 
    //     return d
    // } 
    

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

        // getData("transactionCategories", dispatch2,processCategoriesData)
        getFirestoreCollection("transactionCategories",dispatch2,processCategoriesData)
        // console.log("transaction item----->>", transactionItems);

    },[props.route.params]);

    // executes one-time on startup and never again
    useEffect(() => {
        console.log("-------------+++++useEffect 2 Triggered +++++----------------")
        let currDate = moment(Date.now())
        console.log("curr Dateeeeee --------", currDate)
        let initialDateString = currDate.format('MMM DD, Y')
        let initialDateKey = currDate.format('YYMMDD')
        console.log("A date has been set on start: ", initialDateString, initialDateKey);
        var dateTimeKeys = getexpenditureKeys(currDate,initialDateKey)
        setPickedDate({
            dateString: initialDateString,
            dateAsKey: initialDateKey,
            dateTimeKeys
        })
        console.log("going to getData")
        getExpenditureSummary(expenditureSummaryDispatch, dateTimeKeys)
        // getData(initialDateKey, dispatch) // abid - using async storage
        getFirestoreDoc("dailyRecords",initialDateKey,dispatch,"itemsArray") // using Firebase/Firestore
    },[]);

    return(
        <View style={styles.container}>
            {/* <View style={styles.topSummaryBar}>
                <View style={styles.topSummaryBarLeft}>
                    <Text> {pickedDate.dateString} </Text>
                </View>
                <View style={styles.topSummaryBarRight}>
                    <Text style={styles.topBarSummaryAmount}>₹ 300</Text>
                    <Text style={styles.topBarSummaryAmount}>₹ 1,300</Text>
                </View>
            </View> */}
            <HomeSummaryBar pickedDate={pickedDate.dateString} expenditureSummary={expenditureSummary}/>
            <View style={styles.centeredView}>
                <ItemAddView 
                isModalVisible={isModalVisible} 
                transactionItems={transactionItems} 
                dateAsKey={pickedDate.dateAsKey} 
                categoryList={categoryList} 
                dateTimeKeys={pickedDate.dateTimeKeys} 
                itemAddCallback={dispatch} 
                expenditureSummary={expenditureSummary}
                expenditureSummaryDispatch={expenditureSummaryDispatch} 
                {...props}/>
            </View>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            <FlatList 
                data={transactionItems}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({item}) => <TransactionItemCard dateAsKey={pickedDate.dateAsKey} transactionItemDeleteCallback={transactionItemDeleteCallback} collectionName="dailyRecords" dateTimeKeys={pickedDate.dateTimeKeys} docName={pickedDate.dateAsKey} dispatchCallback={dispatch} {...item}/>}
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
    separator: {
        backgroundColor: 'rgb(200, 199, 204)',
        height: StyleSheet.hairlineWidth,
    },
    centeredView: {
        // flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 22
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