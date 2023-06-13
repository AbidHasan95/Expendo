import {useState, useEffect, useReducer, useRef} from 'react';
// import * as React from 'react';
import { View, FlatList, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { Chip, Text, Modal, Portal, Provider, TextInput, Button, useTheme } from 'react-native-paper';
import { useForm, Controller } from "react-hook-form"; //  https://react-hook-form.com/
import {itemsReducer, getFirestoreData, log} from '../utils/tasksUtil';
import { Appbar } from 'react-native-paper';
import { auth, db } from '../../config/firebase';
// https://www.stefanjudis.com/snippets/how-to-detect-emojis-in-javascript-strings/
// const emojiRegex = /\p{Emoji}/u;
// emojiRegex.test('⭐⭐'); // true
// Update/re-render a single item in flatlist instead of the whole 
// Emoji picker for react web - https://github.com/ealush/emoji-picker-react  https://www.npmjs.com/package/emoji-picker-react

const HomeAppbar = ({toggleModal,route,navigation, deleteCallback, testVar}) => {
  log.info("route=======",route)
  // useEffect(()=> {
  //   console.log("changedddddd")
  // },[route.params.selectionChanged])
  return(
    <Appbar.Header>
      <Appbar.Content title="Categories" />
      {/* <Appbar.Action icon="delete-outline" disabled={!testVar.current.length} onPress={() => { */}
      <Appbar.Action icon="delete-outline" onPress={() => {
        if (testVar.current.length) {
          deleteCallback(testVar.current)
          testVar.current = []
          navigation.setParams({"categoriesChangedTime": Date.now()})
        }
      }} />
      <Appbar.Action icon="plus-circle" onPress={() => {
        toggleModal()
      }} />
      <Appbar.Action icon="dots-vertical" onPress={() => {navigation.toggleDrawer()}}/>
    </Appbar.Header> );
}

const Item = ({ title, itemkey, testVar,selectedChips, setSelectedChips,navigation }) => {
  const [counter, updateCounter] = useState(0)
  // const forceUpdate = updateComponent
  
  // let isSelected2 = selectedChips.includes(itemkey)
  let isSelected2 = testVar.current.includes(itemkey)
  return (
    <View style={styles.item}>
      {/* <Text style={styles.title}>{title}</Text> */}
      <View style={styles.chip}>
          {/* <Chip icon="information" mode="flat" compact={true} onPress={() => console.log('Pressed')}>Example Chipssss</Chip> */}
          <Chip 
            // icon={() => null} 
            mode="flat" 
            compact={true} 
            selected={isSelected2} 
            showSelectedOverlay={true} 
            
            onPress={({navigation})=> {
              // dispatch({type: 'select', key: itemkey})
              // forceUpdate()
              
              if (testVar.current.includes(itemkey)) {
                testVar.current = testVar.current.filter((t) => t!=itemkey)
                // setSelectedChips(selectedChips.filter((t) => t!=itemkey))
              }
              else {
                testVar.current = [...testVar.current,itemkey]
                // setSelectedChips([...selectedChips,itemkey])
              }
              updateCounter(counter+1)
              // navigation.setParams({"selectionChanged": Date.now()})
              // this.props.selected = true
            }} 
            onLongPress={() => {
              // if (selectedChips.includes(itemkey))
              //   setSelectedChips(selectedChips.filter((t) => t!=itemkey))
              // else
              //   setSelectedChips([...selectedChips,itemkey])
              
              if (testVar.current.includes(itemkey)) {
                testVar.current = testVar.current.filter((t) => t!=itemkey)
                setSelectedChips(selectedChips.filter((t) => t!=itemkey))
              }
              else {
                testVar.current = [...testVar.current,itemkey]
                setSelectedChips([...selectedChips,itemkey])
              }
            }
            }
          >{title}</Chip>
      </View>
    </View>)
};

const ExpenditureCategoryScreen = ({navigation,route, state}) => {
  const theme = useTheme();
  const userId = auth.currentUser.uid
  const pathRef = db.collection(userId).doc("transactionCategories")
  // navigation.setOptions({ title: 'Updated!' })
  // log.info("-----------------------Rerender---------------------",Date.now(),route, navigation.getState(),state)
  const [categoryList, dispatch] = useReducer(itemsReducer, []);
  const [selectedChips,setSelectedChips] = useState([]);
  const testVar = useRef([]) 

  const deleteSelectedChips = (selectedCategories) => {
    console.log("The selected chips->", selectedCategories)
    let updatedItems = categoryList.filter((t)=> !selectedCategories.includes(t['id']))
    updatedItems = {itemsArray: updatedItems}
    console.log("After delete, updatedItems:",updatedItems, "categoryList:", categoryList)
    // dispatch({type: 'newAdd',updatedItems,pathRef, propName: "itemsArray", collectionName: "transactionCategories"})
    dispatch({type: 'removeItems',pathRef, collectionName: "transactionCategories",keysToRemove: selectedCategories, keyItentifier: 'id'})
  }
  function updateComponent() {
    const [counter, updateCounter] = useState(0)
    // updateCounter(counter+1)
    return () => updateCounter(counter => counter + 1)
  }
  
  const renderItem = ({ item, theme }) => {
    let categoryContent = item.categoryText + " " + item.emojiLabel
    // let isSelected = item.isSelected == true
    let item_id = item.id
    return (
      <Item title={categoryContent} itemkey={item_id} testVar={testVar} selectedChips={selectedChips} setSelectedChips={setSelectedChips} navigation={navigation} theme={theme}/>
    )
  };

  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const toggleModal = () => setVisible((val)=> !val)
  const { control, handleSubmit, formState: { errors }, reset  } = useForm({
    defaultValues: {
      categoryText: '',
      emojiLabel: '',
    }
  });
  const onSubmit = data => {
    hideModal()
    reset()
    let key = Math.round(Date.now()/1000)
    key = `${key}`
    console.log("data---->",data, "emojiList",categoryList,key)
    navigation.setParams({"categoriesChangedTime": Date.now()})
    // key1 = emojiList.length
    var newItem = {
      categoryText: data.categoryText, 
      emojiLabel: data.emojiLabel, 
      id: key
    }
    var updatedItems = {"itemsArray":[...categoryList,newItem]}
    // var updatedItems = [newItem, ...categoryList]
    // modifyEmojiList([...categoryList,{categoryText: data.categoryText, emojiLabel: data.emojiLabel, id: key}])
    // dispatch({type: 'newAdd', collectionName: "transactionCategories",docName: key,newItem: newItem})
    
    
    console.log("updated categories",updatedItems)
    dispatch({type: 'newAdd', docName: "transactionCategories",subCollectionName: key,"pathRef":pathRef,updatedItems: updatedItems,"propName":"itemsArray"})
    
  }

  useEffect(() => {
    navigation.setOptions({ 
      title: 'Categories', 
      header: () => (
        <HomeAppbar toggleModal={toggleModal} route={route} navigation={navigation} deleteCallback={deleteSelectedChips} testVar={testVar}/>
      ) 
    })
    // navigation.setOptions({ header: 'Updated!' })
    // getData("transactionCategories", dispatch)
    // getFirestoreCollection("transactionCategories",dispatch)
    
    getFirestoreData(pathRef,dispatch,"itemsArray")
    // navigation.setParams({"transactionCategories": categoryList}) // will re-render the home screen

  },[])

  return (
    <SafeAreaView style={[styles.container,{backgroundColor: theme.colors.background}]}>
        <Provider theme={theme}>
          {/* <Button onPress={() => navigation.goBack()} title="Go back home screen" /> */}
          {/* <View style={{flexDirection: "row",justifyContent:"space-around"}}>
            <Button mode="outlined" onPress={() => navigation.goBack()}>Home</Button>
            <Button mode="outlined" onPress={toggleModal}>Add category</Button>
          </View> */}
          <Portal theme={theme}>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={[styles.modalContainer,{backgroundColor:theme.colors.secondaryContainer}]}>
              
                {/* <Text style={{marginBottom: 20}}>Add a transaction category.</Text> */}
                <View style={{flexDirection: "column", justifyContent: "center"}}>
                  {/* https://github.com/callstack/react-native-paper/issues/2615 */}
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                      pattern: /\p{Emoji}/u,
                      // maxLength: 1,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => {
                      // console.log("Emojiii",value, value?.length)
                      return(
                        <View style={{marginBottom: 5}}>
                          <TextInput
                            label="Emoji label"
                            mode='outlined'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                          />
                        </View>
                      )
                    }}
                    name="emojiLabel"
                  />
                  {errors.emojiLabel && <Text style={{color: theme.colors.error}}>Please provide a valid label</Text>}
                  <Controller
                    control={control}
                    rules={{
                    required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={{marginBottom: 5}}>
                        <TextInput
                          style={{}}
                          label="Category"
                          mode='outlined'
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />
                      </View>
                    )}
                    name="categoryText"
                  />
                  {errors.categoryText && <Text style={{color: theme.colors.error}}>This is required</Text>}
                  <View style={{ borderWidth: 0,paddingHorizontal:10,flexDirection:"row" ,justifyContent: "center", marginTop:5}}>
                    <Button style={{padding: 2, borderRadius: 20}} mode="contained" onPress={handleSubmit(onSubmit)}>Submit</Button>
                  </View>
                </View>
              
            </Modal>
          </Portal>
          
          <FlatList
              data={categoryList}
              renderItem={({item}) => renderItem({item,navigation, theme})}
              scrollEnabled={true}
              keyExtractor={item => item.id}
              contentContainerStyle={{ flex: 1,flexDirection: 'row', flexWrap: "wrap",padding: 5}}
          />
          {/* <MyFlatList categoryList={categoryList}  renderItem={renderItem}/> */}
         {/* <View style={{flexDirection: "row", flexWrap:"wrap"}}>
             <View style={styles.chip}>
                 <Chip icon="information" mode="flat" compact={true} onPress={() => {}}>Example Chip</Chip>
             </View>
             <View style={styles.chip}>
                 <Chip icon="information" mode="flat" compact={true} onPress={() => {}}>Example Chips</Chip>
             </View>
         </View> */}
        </Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: StatusBar.currentHeight || 0,
    marginTop: 0,
  },
  item: {
    // backgroundColor: '#f9c2ff',
    // padding: 5,
    marginTop: 8,
    marginHorizontal: 4,
  },
  title: {
    fontSize: 32,
  },
  chip: {
    // width: 120,
    // marginLeft: 10,
    // marginTop: 5,
    // marginBottom: 5,
  },
  modalContainer: {
    // backgroundColor: 'white', 
    padding: 20,
    margin: 20,
    borderRadius: 20,
  }
});

export default ExpenditureCategoryScreen;