import {Button, Modal, StyleSheet, Text, View, TextInput, Switch} from 'react-native';
import React from 'react';
import { useForm, Controller } from "react-hook-form"; //  https://react-hook-form.com/
import {useState} from 'react';
import SelectDropdown from 'react-native-select-dropdown'; //  https://www.npmjs.com/package/react-native-select-dropdown 
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list'; // https://github.com/danish1658/react-native-dropdown-select-list ; https://www.npmjs.com/package/react-native-dropdown-select-list 
import EmojiPicker from 'emoji-picker-react';  // https://www.npmjs.com/package/emoji-picker-react ; https://yarnpkg.com/package/emoji-picker-react

const ItemAddView = ({navigation, isModalVisible, dateAsKey, itemAddCallback}) => {
  // console.log("itemAddView",Date.now());
  // var isDebit = true;
  const [isDebit, setIsDebit] = useState(true);
  // const toggleSwitch = () => isDebit=!isDebit;
  const toggleSwitch = () => setIsDebit(previousState => !previousState);
  // const { register, handleSubmit } = useForm();
  const { control, handleSubmit, formState: { errors }, reset  } = useForm({
    defaultValues: {
      title: 'Misc',
      label: 'Misc',
      isCredit: false,
      category: [],
    }
  });
  // const [selected, setSelected] = React.useState([]);
  var mycategory;
  const onSubmit = data => {
    console.log("data---->-",data)
    // var m = {type: 'add', key: Date.now(), dateAsKey: dateAsKey, date: "12-10-2022",...data}
    // console.log("onSubmit----->",data, "dateAsKeyyy->",dateAsKey,"the dict--->",m)
    // itemAddCallback({type: 'add', key: Date.now(), title: "test1", label: "food", transactionType: "credit", amount: 450, date: "12-10-2022"});
    itemAddCallback({type: 'add', key: Date.now(), dateAsKey: dateAsKey,...data});
    reset()
    navigation.setParams({"modalVisible": false})
  }

  return (
      // <View style={styles.modalView}>
      //   <Text style={{ fontSize: 30 }}>This is a modal!</Text>
      //   <Button onPress={() => navigation.goBack()} title="Dismiss" />
      // </View>

      <Modal
        animationType='slide'
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
            navigation.setParams({"modalVisible": false})
        }}>
        <View style={styles.modalView}>
            <Text>This is a modal</Text>
            <Controller
              control={control}
              rules={{
              required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{flexDirection: "row"}}>
                  <Text style={{flex:1,textAlignVertical: "center"}}>Description</Text>
                  <View style={{flex: 2}}>
                    <TextInput
                      style={styles.textinput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Transaction title"
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
                  <Text style={{textAlignVertical: "center", flex: 1}}>Amount</Text>
                  <View style={{flex: 2}}>
                    <TextInput
                      style={styles.textinput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="0.0"
                    />
                  </View>
                </View>
              )}
              name="amount"
            />
            {errors.amount && <Text>Amount is invalid.</Text>}
            <Controller
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
            />
            <Controller
              control={control}
              rules={{
              maxLength: 100,
              }}
              // render={({ field: { onChange, onBlur, value } }) => (
              render={({field: { onChange, onBlur, value }}) => (
                
                <View style={{flexDirection: "row"}}>
                  <Text style={{textAlignVertical: "center", flex: 1}}>Category</Text>
                  <View style={{flex:2, padding: 0}}>
                      <MultipleSelectList 
                          setSelected={(val) => onChange(val)} 
                          style={{borderRadius: 10}}
                          label="Categories"
                          value={value}
                          placeholder='Select category'
                          dropdownShown={false}
                          // allowNewEntries = {true}
                          save="value"
                          data={[
                            {key:1,value:"Food"}, {key:2,value:"Entertainment"}, {key:3,value:"Snacks"},{key:4,value:"Home Essentials"},{key:5,value:"Groceries"}, {key:6,value:"Travel"}, {key:7,value:"Other"}
                          ]} 
                      />
                  </View>
                </View>
              )}
              name="category"
            />
            

            {/* <MultipleSelectList 
                setSelected={(val) => setSelected(val)} 
                dropdownShown={false}
                allowNewEntries = {true}
                search={true}
                data={[
                  {key:1,value:"Travel"}, {key:2,value:"Snacks"}, {key:3,value:"Entertainment"},{key:4,value:"Vegetables"}, {key:5,value:"Misc"}
                ]} 
                save="value"
            /> */}

            
              <EmojiPicker/>
            

            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => {
                  // return 
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
            <View style={{flexDirection: "row"}}>
              <View style={styles.customButton}>

              <Button title="Submit" onPress={handleSubmit(onSubmit)} />
              </View>
              <View style={styles.customButton}>
                <Button title='Close' onPress={() => { 
                    reset()
                    // console.log("closing::", mycategory)
                    // itemAddCallback({type: 'add', key: Date.now(), title: "test1", label: "food", transactionType: "credit", amount: 450, date: "12-10-2022"});
                    navigation.setParams({"modalVisible": false})
                }}/>
              </View>
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
    borderRadius: 10,
    // margin:10,
    // borderWidth: 1,
    flex: 1
  }
});


export default ItemAddView;