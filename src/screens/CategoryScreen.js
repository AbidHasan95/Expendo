import {useState, useEffect, useReducer} from 'react';
// import * as React from 'react';
import { View, FlatList, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { Chip, Text, Modal, Portal, Provider, TextInput, Button } from 'react-native-paper';
import { useForm, Controller } from "react-hook-form"; //  https://react-hook-form.com/
import {itemsReducer, getData} from '../utils/tasksUtil';
import { Appbar } from 'react-native-paper';
// https://www.stefanjudis.com/snippets/how-to-detect-emojis-in-javascript-strings/
// const emojiRegex = /\p{Emoji}/u;
// emojiRegex.test('⭐⭐'); // true
const textList = [
    {   id: 1,
        text: "food"
    },
    {
        id: 2,
        text: "Clothing"
    },
    {
        id: 3,
        text: "Travel"
    },
    {
        id: 4,
        text: "G"
    },
    {   id: 5,
      text: "food"
    },
    {
        id: 6,
        text: "Clothing"
    },
    {
        id: 7,
        text: "Travel"
    },
    {
        id: 8,
        text: "Grocery"
    },
    {   id: 9,
      text: "food"
    },
    {
        id: 10,
        text: "Clothing"
    },
    {
        id: 11,
        text: "Travel"
    },
    {
        id: 12,
        text: "G"
    },
    {   id: 13,
      text: "food"
    },
    {
        id: 14,
        text: "Clothing"
    },
    {
        id: 15,
        text: "Travel"
    },
    {
        id: 16,
        text: "Grocery"
    }
]
// const Item = ({ title, key, isSelected, dispatch }) => (
//   <View style={styles.item}>
//     {/* <Text style={styles.title}>{title}</Text> */}
//     <View style={styles.chip}>
//         {/* <Chip icon="information" mode="flat" compact={true} onPress={() => console.log('Pressed')}>Example Chipssss</Chip> */}
//         <Chip 
//           icon={() => null} 
//           mode="flat" 
//           compact={true} 
//           selected={isSelected} 
//           showSelectedOverlay={true} 
//           onLongPress={()=> {dispatch({type: 'select', key: key})}} 
//           onPress={() => console.log('Pressed')}
//         >{title}</Chip>
//     </View>
//   </View>
// );



const HomeAppbar = ({navigation}) => {
  return(
    <Appbar.Header>
      <Appbar.Content title="Add Category" />
      {/* <Appbar.BackAction onPress={() => {}} /> */}
      {/* <Appbar.Content title="Expendo1" /> */}
      <Appbar.Action icon="delete-outline" onPress={() => {
        console.log("delete button pressed", Date.now())
      }} />
      <Appbar.Action icon="plus-circle" onPress={() => {
      }} />
      <Appbar.Action icon="dots-vertical" onPress={() => {navigation.toggleDrawer()}}/>
    </Appbar.Header> );
}

const ExpenditureCategoryScreen = ({navigation}) => {
  // navigation.setOptions({ title: 'Updated!' })
  console.log("Rerender",Date.now())
  const [categoryList, dispatch] = useReducer(itemsReducer, []);
  const [selectedChips,setSelectedChips] = useState([]);
  const Item = ({ title, itemkey, isSelected, dispatch }) => {
    
    console.log("Item comp", title, itemkey, selectedChips)
    let isSelected2 = selectedChips.includes(itemkey)
    return (
      <View style={styles.item}>
        {/* <Text style={styles.title}>{title}</Text> */}
        <View style={styles.chip}>
            {/* <Chip icon="information" mode="flat" compact={true} onPress={() => console.log('Pressed')}>Example Chipssss</Chip> */}
            <Chip 
              icon={() => null} 
              mode="flat" 
              compact={true} 
              selected={isSelected2} 
              showSelectedOverlay={true} 
              onLongPress={()=> {dispatch({type: 'select', key: itemkey})}} 
              onPress={() => {
                if (!selectedChips.includes(itemkey))
                  setSelectedChips([...selectedChips,itemkey])
                else
                  setSelectedChips(selectedChips.filter((t) => t!=itemkey))
                }
              }
            >{title}</Chip>
        </View>
      </View>)
  };
  const renderItem = ({ item }) => {
    console.log("item-->",item.id)
    let categoryContent = item.categoryText + " " + item.emojiLabel
    let isSelected = item.isSelected == true
    let item_id = item.id
    console.log("in renderr", item_id)
    return (
      <Item title={categoryContent} itemkey={item_id} dispatch={dispatch} isSelected={isSelected}/>
    )
  };

  
  // console.log("Hello")
  const [visible, setVisible] = useState(false);
  const [someValue, setSomeValue] = useState('');
  const [someValue2, setSomeValue2] = useState('');
  const [emojiList, modifyEmojiList] = useState([]);
  
  

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
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
    console.log("data---->",data, "emojiList",categoryList,key)
    // key1 = emojiList.length
    var newItem = {
      categoryText: data.categoryText, 
      emojiLabel: data.emojiLabel, 
      id: key
    }
    // modifyEmojiList([...categoryList,{categoryText: data.categoryText, emojiLabel: data.emojiLabel, id: key}])
    dispatch({type: 'newAdd', dateAsKey: "transactionCategories",newItem: newItem})
  }

  useEffect(() => {
    navigation.setOptions({ 
      title: 'Categories', 
      header: () => (
        <HomeAppbar navigation={navigation} />
      ) 
    })
    // navigation.setOptions({ header: 'Updated!' })
    getData("transactionCategories", dispatch)

  },[])

  return (
    <SafeAreaView style={styles.container}>
        <Provider>
          {/* <Button onPress={() => navigation.goBack()} title="Go back home screen" /> */}
          <Button icon="camera" mode="contained" onPress={() => navigation.goBack()}>Go back to home screen</Button>
          <Button icon="camera" mode="outlined" onPress={showModal}>Add category</Button>
          <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
              <View>
                <Text style={{marginBottom: 20}}>Add a transaction category.</Text>
                <View style={{flexDirection: "column", justifyContent: "center"}}>
                  {/* https://github.com/callstack/react-native-paper/issues/2615 */}
                  {/* <TextInput
                    label="emoji"
                    mode='outlined'
                    value={someValue}
                    onChangeText={text => setSomeValue(text)}
                  />
                  <TextInput
                    label="category name"
                    mode='outlined'
                    value={someValue2}
                    onChangeText={text => setSomeValue2(text)}
                  /> */}
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                      pattern: /\p{Emoji}/u,
                      // maxLength: 1,
                    }}
                    // render={({ field: { onChange, onBlur, value } }) => (
                    //   <View style={{margin: 10}}>
                    //     <TextInput
                    //       label="Emoji label"
                    //       mode='outlined'
                    //       onBlur={onBlur}
                    //       onChangeText={onChange}
                    //       value={value}
                    //     />
                    //   </View>
                    // )}
                    render={({ field: { onChange, onBlur, value } }) => {
                      console.log("Emojiii",value, value?.length)
                      return(
                        <View style={{margin: 10}}>
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
                  {errors.emojiLabel && <Text style={{color: "red"}}>Please provide a valid label</Text>}
                  <Controller
                    control={control}
                    rules={{
                    required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={{margin: 10}}>
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
                  {errors.categoryText && <Text style={{color: "red"}}>This is required</Text>}
                  <View style={{ borderWidth: 0,paddingHorizontal:10,flexDirection:"row" ,justifyContent: "center"}}>
                    <Button style={{padding: 2, width: "100%"}} mode="outlined" onPress={handleSubmit(onSubmit)}>Submit</Button>
                  </View>
                </View>
              </View>
            </Modal>
          </Portal>
          {/* <Button style={{marginTop: 30}} onPress={showModal} title="Show"/> */}
          
          <FlatList
              data={categoryList}
              renderItem={renderItem}
              scrollEnabled={true}
              keyExtractor={item => item.id}
              contentContainerStyle={{ flex: 1,flexDirection: 'row', flexWrap: "wrap",padding: 5}}
          />
         {/* <View style={{flexDirection: "row", flexWrap:"wrap"}}>
             <View style={styles.chip}>
                 <Chip icon="information" mode="flat" compact={true} onPress={() => console.log('Pressed')}>Example Chip</Chip>
             </View>
             <View style={styles.chip}>
                 <Chip icon="information" mode="flat" compact={true} onPress={() => console.log('Pressed')}>Example Chips</Chip>
             </View>
             <View style={styles.chip}>
                 <Chip icon="information" mode="flat" compact={true} onPress={() => console.log('Pressed')}>Examp Chip</Chip>
             </View>
             <View style={styles.chip}>
                 <Chip icon="information" mode="flat" compact={true} onPress={() => console.log('Pressed')}>Example Chip</Chip>
             </View>
             <View style={styles.chip}>
                 <Chip icon="information" mode="flat" compact={true} onPress={() => console.log('Pressed')}>Example Chip</Chip>
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
    // flexDirection: "row", 
    // flexWrap:"wrap"
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
    backgroundColor: 'white', 
    padding: 20,
    margin: 20,
    // height: "40%",
    borderRadius: 20,
    // minHeight: "50%"
  }
});

export default ExpenditureCategoryScreen;