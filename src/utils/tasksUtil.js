import AsyncStorage from '@react-native-async-storage/async-storage';

const setData = async (updatedItems, dateAsKey) => {
    try {
        console.log("Key to add--->:",dateAsKey,"updatedItems:",updatedItems)
        await AsyncStorage.setItem(dateAsKey, JSON.stringify(updatedItems))
    }
    catch (error) {
        console.error("Error on setData",error)
    }
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

const getDataCategories = async (dateAsKey, dispatch) => {
    try {
        AsyncStorage.getItem(dateAsKey)
            .then(value => {
                if (value != null) {
                    console.info("fetched data",value)
                }
                else {
                    console.info("No items fetched for",dateAsKey)

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
         case 'newAdd': {
            console.log("new add is triggered")
            let updatedItems = [
                ...items,
                action.newItem
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

        case 'removeItems': { //Remove items corresponding to a outer key
            // let keyItentifier = action.keyIdentifier
            console.log("Came to remove items", action.keysToRemove, action.dateAsKey)
            let updatedItems = items.filter((t)=> !action.keysToRemove.includes(t[action.keyItentifier]))
            setData(updatedItems,action.dateAsKey)
            return updatedItems
        }

        case 'select': {
            console.log("action",action)
            for (let i=0; i<items.length; i++) {
                if (items[i].id == action.key) {
                    items[i].isSelected = !items[i].isSelected 
                    console.log("found",action.key, items)
                    return items
                } 
            }
            return items
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