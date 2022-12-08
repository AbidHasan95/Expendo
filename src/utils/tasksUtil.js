import AsyncStorage from '@react-native-async-storage/async-storage';

const setData = async (updatedItems, dateAsKey) => {
    try {
        // console.log("Key to add--->:",dateAsKey,"updatedItems:",updatedItems)
        await AsyncStorage.setItem(dateAsKey, JSON.stringify(updatedItems))
    }
    catch (error) {
        console.error("Error on setData",error)
    }
}

const getData = async (dateAsKey, dispatch) => {
    try {
        AsyncStorage.getItem(dateAsKey)
            .then(value => {
                if (value != null) {
                    console.info("fetched data",value)
                    let fetchedData = JSON.parse(value)
                    dispatch({type: 'get', fetchedData: fetchedData})
                    // return value
                }
                else {
                    console.info("No items fetched")
                    dispatch({type: 'get', fetchedData: []})
                    // return -1
                }
            })
    } catch (error) {
        console.log(error);
    }
}

const getAllKeys = async () => {
    let keys = []
    try {
      keys = await AsyncStorage.getAllKeys()
    } catch(e) {
      // read key error
    }
  
    console.log("keys-->",keys)
    // example console.log result:
    // ['@MyApp_user', '@MyApp_key']
}

const multiRemove = async () => {
    let keys = ["221030", "221031", "221130", "221201", "221202", "221203"]
    try {
        AsyncStorage.multiRemove(keys, (err) => {
            console.log("Error")
        })
    } catch(e) {
        console.log("Error encountered while removing keys")
    }

}

const removeData = async (dateAsKey, itemkey) => {
    try {
        AsyncStorage.getItem(dateAsKey)
            .then(value => {
                if (value != null) {
                    // [{"key":1670065672356,"title":"Misc1","label":"Clothing","amount":"56","date":"12-10-2022","key2":1670065672356},{"key":1670067273599,"title":"Misc2","label":"Travel","amount":"54","date":"12-10-2022","key2":1670067273599}]
                    // console.info("fetched data for remove","key to remove",itemkey,"dict to remove from",typeof(value),value)
                    // value = JSON.parse(value)
                    var updatedValue = JSON.parse(value).filter((t) => t.key !== itemkey)
                    // console.log("Value after remove",updatedValue)
                    setData(updatedValue,dateAsKey)
                    // getAllKeys()
                    // multiRemove()
                    // let fetchedData = JSON.parse(value)
                    // dispatch({type: 'get', fetchedData: fetchedData})
                    // return value
                }
                else {
                    console.info("No items fetched")
                    // dispatch({type: 'get', fetchedData: []})
                    // return -1
                }
            })
    } catch (error) {
        console.log(error);
    }
}

function itemsReducer(items,action) {
    // console.log("test itemsReducer",items,action)
    switch (action.type) {
        case 'add': {
            console.log("add is triggered")
            let updatedItems = [
                ...items,
                {
                    key: action.key, // 1670065672356
                    title: action.title, // Veg Pulao
                    label: action.label, //Food, Misc
                    transactionType: action.transactionType, // Credit/Debit
                    amount: action.amount,
                    date: action.dateAsKey, // 221203 - 03 Dec 22
                    addTime: action.key,
                    isCredit: action.isCredit  // true - false
                }
            ]
            setData(updatedItems,action.dateAsKey)
            return updatedItems
        } 
        
        case 'remove': {
            // console.log("remove is triggered",items,'action',action)
            getAllKeys()
            removeData(action.dateAsKey, action.itemKey)
            // ["221030", "221031", "221130", "221201", "221202", "221203"]

            // return items
            return items.filter((t) => t.key !== action.itemKey)
        }

        case 'get': {
            // let res = getData(action.dateAsKey)
            // console.log("get returns", res, typeof(res))
            // if (res == -1) {
            //     return []
            // }
            // res = JSON.parse(res)
            // return res
            let data = action.fetchedData
            return data

        }

        default: {
            throw Error('Unknown action: ' + action.type)
        }

    }
}

// export default itemsReducer;

module.exports = {
    itemsReducer,
    getData,
    setData
}