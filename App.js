// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });



import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, AppRegistry} from 'react-native';
// import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from'@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
// import React from 'react';
import {useState} from 'react';

import ItemAddView from './src/components/itemAddModal';
import HomeAppbar from './src/components/HomeAppbar';

// old method start
// const navigator = createNativeStackNavigator(
//   {
//     Home: HomeScreen
//   },
//   {
//     initialRouteName: 'Home',
//     defaultNavigationOptions: {
//       title: 'App',
//     },
//   }
// );

// export default createAppContainer(navigator);
// old method end



const Stack = createNativeStackNavigator();
const MyStack = () => {
  // const [modalVisible,setModalVisible] = useState(false);
  // console.log("in MyStack",modalVisible);
  // const changeModalVisibility = (data) => {
  //   console.log("in App.js => changeVisibility",data);
  //   setModalVisible(data);
  // }
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Home'
        headerMode='screen'
        screenOptions={{
          // header: ({scene, navigation}) => (
          //   <HomeAppbar scene={scene} navigation={navigation}/>
          header: (props) => (
            <HomeAppbar {...props}/>
          )
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{
            modalVisible: false
          }}
          options={{ 
            headerTitle: "Test1Home", 
            // callback: {changeModalVisibility},
            // modalVisiblee: {modalVisible}
          }}
        />

        <Stack.Screen
          name="MyModal"
          // modalVisible = {false}
          component={ItemAddView}
          options={{
            presentation: 'modal',
          }}
        />
        {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MyStack;

