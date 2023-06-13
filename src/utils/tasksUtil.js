import AsyncStorage from '@react-native-async-storage/async-storage';  // https://react-native-async-storage.github.io/async-storage/docs/api
// TODO - Replace by react-native-mmkv-storage -> https://rnmmkv.vercel.app
import {db, auth} from '../../config/firebase';
import { logger,consoleTransport } from "react-native-logs"; //https://www.npmjs.com/package/react-native-logs


const defaultConfig = {
    levels: {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    },
    severity: "debug",
    transport: consoleTransport,
    transportOptions: {
      colors: {
        info: "blueBright",
        warn: "yellowBright",
        error: "redBright",
        debug: "cyanBright",
      },
    },
    async: true,
    dateFormat: "time",
    printLevel: true,
    printDate: true,
    enabled: true,
  };
var log = logger.createLogger(defaultConfig);
// name 	   ansi code 	   note
// default 	    null  	       default console color
// black 	     30 	
// red 	         31 	
// green 	     32 	
// yellow 	     33 	
// blue 	     34 	
// magenta 	     35 	
// cyan 	     36 	
// white 	     37 	
// grey 	     90 	
// redBright 	 91 	
// greenBright 	 92 	
// yellowBright  93 	
// blueBright 	 94 	
// magentaBright 95 	
// cyanBright 	 96 	
// whiteBright 	 97

const setData = async (updatedItems, dateAsKey) => {
    try {
        console.log("Key to add--->:",dateAsKey,"updatedItems:",updatedItems)
        await AsyncStorage.setItem(dateAsKey, JSON.stringify(updatedItems))
    }
    catch (error) {
        console.error("Error on setData",error)
    }
}

const addDataToRef = async (pathRef, itemObj) => {
    try {
        await pathRef.set(itemObj)
    }
    catch (error) {
        console.error("Error in addDataRef",error)
    }
}

const getFirestoreCollection = async (collectionName,dispatch,processData) => {
    log.debug("Came in getFirestoreCollection", collectionName)
    const snapshot = await db.collection(collectionName).get();
    var fetchedData = snapshot.docs.map(doc => {
            // console.log("docData", doc.data())
            return {...doc.data(),id:doc.id}
        });
    
    console.log("reading from firestore",fetchedData)
    if (processData!==undefined) {
        fetchedData = processData(fetchedData)
        console.log("processing data-----------", fetchedData)
    }
    // snapshot.forEach((doc) => {
    // console.log(doc.id, '=>', doc.data());
    // })
    dispatch({type: 'get', fetchedData: fetchedData})
}

const getFirestoreDoc = async (collectionName, docName,dispatch,propToFetch) => {
    console.log("go to be fetched ->",collectionName, docName,propToFetch)
    const docRef = await db.collection(collectionName).doc(docName).get();
    var fetchedData;
    if (!docRef.exists) {
        console.log('No such document!');
        fetchedData = []
    } else {
        console.log('Document data:', docRef.data());
        fetchedData = docRef.data()
        if (propToFetch) {
            fetchedData = fetchedData[propToFetch]?fetchedData[propToFetch]:[]
        }
    }

    console.log("fetched ->",collectionName, docName,fetchedData)
    dispatch({type: 'get', fetchedData: fetchedData})
}

const getFirestoreData = async(pathRef,dispatch,propToFetch) => {
    var fetchedData
    var data = await pathRef.get()
    if (!data.exists) {
        console.log('No such document!');
        fetchedData = []
    } else {
        console.log('Document data:', data.data());
        fetchedData = data.data()
        if (propToFetch) {
            fetchedData = fetchedData[propToFetch]?fetchedData[propToFetch]:[]
        }
    }
    dispatch({type: 'get', fetchedData: fetchedData})
}

const getExpenditureItem = async (collectionName, docName) => {
    const userId = auth.currentUser.uid
    const docRef = await db.collection(userId).doc(collectionName).collection(docName).doc("entry").get();
    var fetchedData = {
        credit: 0,
        debit: 0
    }
    if (docRef.exists) {
        fetchedData = docRef.data()
    }
    return fetchedData
}

const getExpenditureSummary = async (dispatch, dateTimeKeys) => {
    //To do => Get and set using subcollection instead of managing multiple collections for expenditure summary
    var res = {}
    res.dailyExpenditure = await getExpenditureItem("dailyExpenditure",dateTimeKeys.dateKey)
    res.weeklyExpenditure = await getExpenditureItem("weeklyExpenditure",dateTimeKeys.weeklyKey)
    res.monthlyExpenditure = await getExpenditureItem("monthlyExpenditure",dateTimeKeys.monthlyKey)
    res.yearlyExpenditure = await getExpenditureItem("yearlyExpenditure",dateTimeKeys.yearlyKey)
    dispatch({type: 'get', fetchedData: res})
}


const updateExpenditureItem = async (collectionName, docName,expenditureSummary,transType,amount) => {
    console.log("came in updateExpenditureItem--->",docName,expenditureSummary,amount, typeof(amount))
    const userId = auth.currentUser.uid
    const docRef = await db.collection(userId).doc(collectionName).collection(docName).doc('entry');
        
    console.log("data present===<<<", data)
    var data = expenditureSummary[collectionName]
    data[transType] += amount
    console.log("new data===<<<", data)
    await docRef.set(data)
    // return data
}

const updateExpenditureSummary = async (deltaItem, expenditureSummary,dateTimeKeys, dispatch,operation) => {
    const multiplier = operation==="remove"?-1:1;
    var transType = deltaItem.isCredit?"credit":"debit";
    
    var amount = deltaItem.amount * multiplier
    let expenditureSummary_copy = JSON.parse(JSON.stringify(expenditureSummary))
    updateExpenditureItem("dailyExpenditure",dateTimeKeys.dateKey,expenditureSummary_copy,transType,amount)
    updateExpenditureItem("weeklyExpenditure",dateTimeKeys.weeklyKey,expenditureSummary_copy,transType,amount)
    updateExpenditureItem("monthlyExpenditure",dateTimeKeys.monthlyKey,expenditureSummary_copy,transType,amount)
    updateExpenditureItem("yearlyExpenditure",dateTimeKeys.yearlyKey,expenditureSummary_copy,transType,amount)

    console.log("expenditureSummary before",expenditureSummary)
    expenditureSummary["dailyExpenditure"][transType] += amount
    expenditureSummary["weeklyExpenditure"][transType] += amount
    expenditureSummary["monthlyExpenditure"][transType] += amount
    expenditureSummary["yearlyExpenditure"][transType] += amount

    dispatch({type: 'get', fetchedData: expenditureSummary})
}

const getData = async (dateAsKey, dispatch, processData) => {
    try {
        AsyncStorage.getItem(dateAsKey)
            .then(value => {
                if (value != null) {
                    console.info("fetched data",value)
                    let fetchedData = JSON.parse(value)
                    if (processData!==undefined) {
                        fetchedData = processData(fetchedData)
                        console.log("processing data-----------", fetchedData)
                    }
                    dispatch({type: 'get', fetchedData: fetchedData})
                    // return value
                }
                else {
                    console.info("No items fetched for",dateAsKey)
                    dispatch({type: 'get', fetchedData: []})
                    // return -1
                }
            })
    } catch (error) {
        console.log(error);
    }
}

function itemsReducer (items,action) {
    // console.log("test itemsReducer",items,action)
    switch (action.type) {
        case 'newAdd': {
            console.log("new add is triggered")
            var itemObj;
            let updatedItems;
            if (action.newItem) {
                itemObj = action.newItem
                updatedItems = [
                    ...items,
                    itemObj
                ]
            }
            else {
                itemObj =  action.updatedItems
                updatedItems = action.updatedItems
            }
            // setDataFirestore(collectionName=action.collectionName, docName=action.docName, itemObj=itemObj)
            // addSubCollectionDataFirestore(docName=action.docName, subCollectionName=action.subCollectionName,subDocName=action.subDocumentName,itemObj=itemObj)             
            addDataToRef(action.pathRef,itemObj)
            
            if (action.propName) {
                console.log("with prop updatedItems", updatedItems)
                updatedItems= updatedItems[action.propName]
            }
            if (action.docName=="dailyRecords") {
                console.log("-------->>updating dailyRecords", Date.now())

                updateExpenditureSummary(action.deltaItem, action.expenditureSummary, action.dateTimeKeys, action.expenditureSummaryDispatch,action.operation)
            }
            return updatedItems
        } 

        case 'removeItems': { //Remove items corresponding to a outer key
            console.log("Came to remove items", action.keysToRemove, action.collectionName)
            let updatedItems = items.filter((t)=> !action.keysToRemove.includes(t[action.keyItentifier]))
            updatedItemsFirestore = {itemsArray: updatedItems}
            addDataToRef(action.pathRef,updatedItemsFirestore)
            return updatedItems
        }

        case 'get': {
            let data = action.fetchedData
            return data
        }
        default: {
            throw Error('Unknown action: ' + action.type)
        }
    }
}

module.exports = {
    itemsReducer,
    getData,
    setData,
    getFirestoreCollection,
    getFirestoreDoc,
    updateExpenditureSummary,
    getExpenditureSummary,
    log,
    getFirestoreData,
}