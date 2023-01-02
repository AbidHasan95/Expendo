import {Modal, StyleSheet, View, Switch,TouchableWithoutFeedback, Keyboard} from 'react-native';
import { Button,Portal, Provider,Text ,TextInput } from 'react-native-paper';
import React from 'react';
import {getDataCategories} from '../utils/tasksUtil';
import { useForm, Controller } from "react-hook-form"; //  https://react-hook-form.com/
import {useState} from 'react';
// import SelectDropdown from 'react-native-select-dropdown'; //  https://www.npmjs.com/package/react-native-select-dropdown 
import { MultipleSelectList } from 'react-native-dropdown-select-list'; // https://github.com/danish1658/react-native-dropdown-select-list ; https://www.npmjs.com/package/react-native-dropdown-select-list 
// import EmojiPicker from 'emoji-picker-react';  // https://www.npmjs.com/package/emoji-picker-react ; https://yarnpkg.com/package/emoji-picker-react
// Menu from react native paper - https://stackoverflow.com/questions/61604500/how-do-i-pass-a-selected-item-from-react-native-paper-menu-to-input-textinput-on

const ItemAddView = ({navigation, isModalVisible,transactionItems, dateAsKey,categoryList, dateTimeKeys,itemAddCallback, expenditureSummary,expenditureSummaryDispatch,theme}) => {
  // console.log("categoryList-->",categoryList);
  // var isDebit = true;
  // const [isDebit, setIsDebit] = useState(true);
  // const toggleSwitch = () => isDebit=!isDebit;
  // const toggleSwitch = () => setIsDebit(previousState => !previousState);
  // console.log("rerender - ItemAddView ",categoryList)
  const { control, handleSubmit, formState: { errors }, reset  } = useForm({
    defaultValues: {
      title: 'Misc',
      isCredit: false,
      category: [],
    }
  });
  const [selectedCategories, setSelectedCategories] = React.useState([]);
  const onSubmit = data => {
    console.log("data---->-",data,"selectedCategories",selectedCategories)
    console.log("categories List",categoryList) // [{"emojiLabel": "👕", "key": "1672049184", "value": "Clothing"}, {"emojiLabel": "🍿", "key": "1672049225", "value": "Entertainment"}, {"emojiLabel": "🛍️", "key": "1672049236", "value": "Grocery"}, {"emojiLabel": "🍛", "key": "1672049266", "value": "Food"}, {"emojiLabel": "🛒", "key": "1672049303", "value": "Home essentials"}, {"emojiLabel": "🚗", "key": "1672049335", "value": "Travel"}, {"emojiLabel": "🎁", "key": "1672052107", "value": "Gift"}]
    var labels = categoryList.filter((i)=> selectedCategories.includes(i.key)).map((t)=> t.emojiLabel)
    var categories = categoryList.filter((i)=> selectedCategories.includes(i.key)).map((t)=> t.value)
    console.log("emojis", labels)
    // data.category((val) => {
    //   console.log("val")
    // })

    let key = Date.now()
    // var m = {type: 'add', key: Date.now(), dateAsKey: dateAsKey, date: "12-10-2022",...data} 
    // console.log("onSubmit----->",data, "dateAsKeyyy->",dateAsKey,"the dict--->",m)
    // itemAddCallback({type: 'add', key: Date.now(), title: "test1", label: "food", transactionType: "credit", amount: 450, date: "12-10-2022"});
    var deltaItem = {
      key: key, // 1670065672356
      title: data.title, // Veg Pulao
      emojiLabels: labels, // emojis ["👕", "😍"]
      categories,
      amount: parseInt(data.amount),
      date: dateAsKey, // 221203 - 03 Dec 22
      addTime: key,
      isCredit: data.isCredit  // true - false
    }
    var updatedItems = {itemsArray: [deltaItem,...transactionItems]}
    const operation = "add"
    // itemAddCallback({type: 'add', key: Date.now(), dateAsKey: dateAsKey,...data}); old
    itemAddCallback({
      type: 'newAdd', 
      collectionName: "dailyRecords", 
      docName: dateAsKey,
      updatedItems: updatedItems, 
      dateTimeKeys,
      deltaItem,
      propName: "itemsArray",
      expenditureSummaryDispatch,
      expenditureSummary,
      operation
    }); // new
    
    reset()
    setSelectedCategories([])
    navigation.setParams({"modalVisible": false})
  }

  return (
      <Modal
        animationType='slide'
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
            navigation.setParams({"modalVisible": false})
        }}>
        <View style={[styles.modalView,{backgroundColor:theme.colors.secondaryContainer}]}>
            <Text>This is a modal</Text>
            <Controller
              control={control}
              rules={{
              required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{flexDirection: "row"}}>
                  {/* <Text style={{flex:1,textAlignVertical: "center"}}>Description</Text> */}
                  <View style={{flex: 2}}>
                    {/* <TextInput // textinput vanila react-native
                      style={styles.textinput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Transaction title"
                    /> */}
                    <TextInput
                      // style={styles.textinput}
                      mode='outlined'
                      onBlur={onBlur}
                      autoCorrect={false}
                      onChangeText={onChange}
                      value={value}
                      label="Transaction Description"
                    />
                  </View>
                </View>
              )}
              name="title"
            />
            {errors.title && <Text>This is required.</Text>}
            
            <Controller
              control={control}
              rules={{
                maxLength: 10,
                required: true,
                pattern: /[0-9]{1,}/
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{flexDirection: "row"}}>
                  {/* <Text style={{textAlignVertical: "center", flex: 1}}>Amount</Text> */}
                  <View style={{flex: 2}}>
                    {/* <TextInput  // textinput vanila react-native
                      style={styles.textinput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="0.0"
                      keyboardType='number-pad'
                    /> */}
                      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <TextInput
                          autoFocus={true}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          mode='outlined'
                          value={value}
                          autoCorrect={false}
                          placeholder="0"
                          label="Enter amount"
                          keyboardType='decimal-pad'
                        />
                      </TouchableWithoutFeedback>
                  </View>
                </View>
              )}
              name="amount"
            />
            {errors.amount && <Text style={{color:theme.colors.error}}>*Amount is Required.</Text>}
            {/* <Controller
              control={control}
              rules={{
              maxLength: 100,
              }}
              // render={({ field: { onChange, onBlur, value } }) => (
              render={({field: { onChange, onBlur, value }}) => (
                
                <View style={{flexDirection: "row"}}>
                  <Text style={{textAlignVertical: "center", flex: 1}}>Category</Text>
                  <View style={{flex:2, padding: 0}}>
                    <SelectDropdown
                        data={["Food", "Entertainment","Clothing","Snacks","Travel","Misc"]}
                        // onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        buttonTextStyle={{fontSize: 15, fontWeight: "300"}}
                        onSelect={(selectedItem, index) => {
                          // console.log(selectedItem, index);
                          onChange(selectedItem);
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                          // text represented after item is selected
                          // if data array is an array of objects then return selectedItem.property to render after item is selected
                          return selectedItem
                        }}
                        rowTextForSelection={(item, index) => {
                          // text represented for each item in dropdown
                          // if data array is an array of objects then return item.property to represent item in dropdown
                          return item
                        }}
                        buttonStyle={styles.dropdown4BtnStyle}
                    />
                  </View>
                </View>
              )}
              name="label"
            /> */}
            <Controller
              control={control}
              name="category"
              rules={{
              maxLength: 100,
              }}
              // render={({ field: { onChange, onBlur, value } }) => (
              // render={({field: { onChange, onBlur, value }}) => (
                
              //   <View style={{flexDirection: "row"}}>
              //     <Text style={{textAlignVertical: "center", flex: 1}}>Category</Text>
              //     <View style={{flex:2, padding: 0}}>
              //         <MultipleSelectList 
              //             setSelected={(val) => onChange(val)} 
              //             style={{borderRadius: 10}}
              //             label="Categories"
              //             value={value}
              //             placeholder='Select category'
              //             dropdownShown={false}
              //             // allowNewEntries = {true}
              //             save="value"
              //             data={[
              //               // [{"categoryText": "Clothing", "emojiLabel": "👕", "id": 1670905629}, {"categoryText": "Food", "emojiLabel": "🥗", "id": 1670905718}, {"categoryText": "Entertainment", "emojiLabel": "🍿", "id": 1670905757}, {"categoryText": "Travel", "emojiLabel": "🚴‍♂️", "id": 1670905999}, {"categoryText": "Grocery", "emojiLabel": "🛒", "id": 1670906132}, {"categoryText": "Snacks", "emojiLabel": "🍪", "id": 1670906173}]
              //               {key:1,value:"Food"}, {key:2,value:"Entertainment"}, {key:3,value:"Snacks"},{key:4,value:"Home Essentials"},{key:5,value:"Groceries"}, {key:6,value:"Travel"}, {key:7,value:"Other"}
              //             ]} 
              //         />
              //     </View>
              //   </View>
              // )}
              render={({field: { onChange, onBlur, value }}) => {
                // console.log("category value->",value, typeof(value))
                return (<View style={{flexDirection: "row", marginTop:5}}>
                  {/* <Text style={{textAlignVertical: "center", flex: 1}}>Category</Text> */}
                  <View style={{flex:2, padding: 0}}>
                      <MultipleSelectList 
                          // data={[
                          //   {"categoryText": "Clothing", "emojiLabel": "👕", "id": 1670905629}, {"categoryText": "Food", "emojiLabel": "🥗", "id": 1670905718}, {"categoryText": "Entertainment", "emojiLabel": "🍿", "id": 1670905757}, {"categoryText": "Travel", "emojiLabel": "🚴‍♂️", "id": 1670905999}, {"categoryText": "Grocery", "emojiLabel": "🛒", "id": 1670906132}, {"categoryText": "Snacks", "emojiLabel": "🍪", "id": 1670906173}
                          //   {value: "Clothing", key: 1670905629}, {value: "Food", key: 1670905718}, {value: "Entertainment", key: 1670905757}, {value: "Travel", key: 1670905999}, {value: "Grocery", key: 1670906132}, {value: "Snacks", key: 1670906173}
                          //   {key:1,value:"Food"}, {key:2,value:"Entertainment"}, {key:3,value:"Snacks"},{key:4,value:"Home Essentials"},{key:5,value:"Groceries"}, {key:6,value:"Travel"}, {key:7,value:"Other"}
                          // ]} 
                          data={categoryList}
                          // setSelected={(val) => {
                          //   // setSelected(val)
                          //   // let val2 = Array(val)
                            
                          //   console.log("setSelected", value)
                          //   onChange(value)

                          // }}
                          inputStyles={{color: theme.colors.onSurface}}
                          badgeStyles={{backgroundColor:theme.colors.primary}}
                          badgeTextStyles={{color:theme.colors.onPrimary}}
                          // checkBoxStyles={{backgroundColor:"green"}}
                          labelStyles={{color:theme.colors.onSurface}}
                          boxStyles={{borderColor: theme.colors.outline,backgroundColor:theme.colors.background}}
                          dropdownTextStyles={{color:theme.colors.onSurface}}
                          dropdownStyles={{backgroundColor:theme.colors.background}}
                          setSelected={setSelectedCategories}
                          // setSelected={setMyCategory}
                          style={{borderRadius: 10}}
                          label="Categories"
                          // value={value}
                          placeholder='Select category'
                          dropdownShown={false}
                          // allowNewEntries = {true}
                          save="key"
                      />
                  </View>
                </View>)
              }}
              
            />
            

            {/* <MultipleSelectList 
                setSelected={(val) => {
                  setSelected(val)
                  console.log("val-->",val,typeof(val))
                }} 
                dropdownShown={false}
                allowNewEntries = {true}
                search={true}
                data={[
                  {key:1,value:"Travel"}, {key:2,value:"Snacks"}, {key:3,value:"Entertainment"},{key:4,value:"Vegetables"}, {key:5,value:"Misc"}
                ]} 
                save="value"
            /> */}
            
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => {
                  // return 
                  console.log("isCredit",value)
                  return (<View style={{flexDirection: 'row'}}>
                    <Text style={{textAlignVertical: 'center'}}>Debit</Text>
                    <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={value ? "#f5dd4b" : "#f4f3f4"}
                      ios_backgroundColor="#3e3e3e"
                      // onValueChange={() => {onChange(!value)}}
                      onValueChange={onChange}
                      value={value}
                    />
                    <Text style={{textAlignVertical: 'center'}}>Credit</Text>
                  </View>)
                }}
                name="isCredit"
            />
            {/* <View style={{flexDirection: "row"}}>
              <View style={styles.customButton}>
              <Button mode='contained' onPress={handleSubmit(onSubmit)}>Submit</Button>
              </View>
              <View style={styles.customButton} theme={theme}>
                <Button mode="contained" theme={theme} onPress={() => { 
                    reset()
                    navigation.setParams({"modalVisible": false})
                }}>Close</Button>
              </View>
            </View> */}
            <View style={{flexDirection: "row",justifyContent:"space-around"}}>
              <Button mode='contained' style={{padding:4,borderRadius:25,minWidth:100}} onPress={handleSubmit(onSubmit)}>Submit</Button>
              <Button mode="contained" style={{padding:4,borderRadius:25,minWidth:100}} theme={theme} onPress={() => { 
                    reset()
                    navigation.setParams({"modalVisible": false})
                }}>Close</Button>
            </View>
        </View>
      </Modal>
      
  );
}

const styles = StyleSheet.create({
  modalView : {
    // flex: 1,
    marginVertical:50,
    marginHorizontal:20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    // justifyContent: 'center',
    // alignItems: "center",
    flexDirection: "column",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
    
  },
  textinput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    margin: 5,
    borderColor: '#444',
  },
  dropdown4BtnStyle: {
    width: '100%',
    // height: 50,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 0,
    margin: 5,
    marginEnd: 5,
    borderWidth: 1,
    borderColor: '#444',
  },
  customButton: {
    padding: 10,
    // margin:10,
    // borderWidth: 1,
  }
});

export default ItemAddView;