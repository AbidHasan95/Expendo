import {Button, Modal, StyleSheet, Text, View, TextInput} from 'react-native';
import { useForm, Controller } from "react-hook-form"; //  https://react-hook-form.com/
// import {useState} from 'react';
import SelectDropdown from 'react-native-select-dropdown'; //  https://www.npmjs.com/package/react-native-select-dropdown 

const ItemAddView = ({navigation, isModalVisible, dateAsKey, itemAddCallback}) => {
  console.log("itemAddView",Date.now());
  // const { register, handleSubmit } = useForm();
  const { control, handleSubmit, formState: { errors }, reset  } = useForm({
    defaultValues: {
      title: 'Misc',
      label: 'Misc'
    }
  });
  const onSubmit = data => {
    console.log(data)
    // itemAddCallback({type: 'add', key: Date.now(), title: "test1", label: "food", transactionType: "credit", amount: 450, date: "12-10-2022"});
    itemAddCallback({type: 'add', key: Date.now(), dateAsKey: dateAsKey, date: "12-10-2022",...data});
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


            <Text>Transaction Title</Text>
            <Controller
              control={control}
              rules={{
              required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.textinput}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Transaction title"
                />
              )}
              name="title"
            />
            {errors.title && <Text>This is required.</Text>}
            
            <Text>Amount</Text>
            <Controller
              control={control}
              rules={{
              maxLength: 10,
              pattern: /[0-9]{1,}/
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.textinput}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Amount"
                />
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

                <SelectDropdown
                    data={["Food", "Entertainment","Clothing","Snacks","Travel","Misc"]}
                    // onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    onSelect={(selectedItem, index) => {
                      console.log(selectedItem, index);
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
              )}
              name="label"
            />

            <Button title="Submit" onPress={handleSubmit(onSubmit)} />

            <Button title='Close this' onPress={() => { 
                itemAddCallback({type: 'add', key: Date.now(), title: "test1", label: "food", transactionType: "credit", amount: 450, date: "12-10-2022"});
                navigation.setParams({"modalVisible": false})
                // setModalVisible(false)
            }}/>
        </View>
      </Modal>
  );
}

const styles = StyleSheet.create({
  modalView : {
    flex: 1,
    marginVertical:50,
    marginHorizontal:40,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    justifyContent: 'center',
    alignItems: "center"
  },
  textinput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  dropdown4BtnStyle: {
    width: '50%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
});


export default ItemAddView;