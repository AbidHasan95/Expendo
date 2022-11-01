import AsyncStorage from '@react-native-async-storage/async-storage';

const setData = async (updatedItems, dateAsKey) => {
    try {
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

function itemsReducer(items,action) {
    console.log("test itemsReducer",items,action)
    switch (action.type) {
        case 'add': {
            console.log("add is triggered")
            let updatedItems = [
                ...items,
                {
                    key: action.key,
                    title: action.title, // Veg Pulao
                    label: action.label, //Food, Misc
                    transactionType: action.transactionType, // Credit/Debit
                    amount: action.amount,
                    date: action.date
                }
            ]
            setData(updatedItems,action.dateAsKey)
            return updatedItems
        } 
        
        case 'remove': {
            console.log("remove is triggered")
            return items.filter((t) => t.key !== action.key)
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