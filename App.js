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
// import 'react-native-gesture-handler';
import {
  GestureHandlerRootView,
  RectButton,
} from 'react-native-gesture-handler';

import { createNativeStackNavigator } from'@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import HomeAppbar from './src/components/HomeAppbar';
import { StyleSheet} from 'react-native';
import {db} from './config/firebase'

import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Button } from 'react-native';
import ExpenditureCategoryScreen from './src/screens/CategoryScreen';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['flexWrap']); // Ignore log notification by message
// console.disableYellowBox = true;
const Stack = createNativeStackNavigator();
// const MyStack = () => {
//   export default function MyStack() {
//   return (
//     <GestureHandlerRootView style={styles.root}>
//       <NavigationContainer>
//         <Stack.Navigator
//           initialRouteName='Home'
//           headerMode='screen'
//           screenOptions={{
//             // header: ({scene, navigation}) => (
//             //   <HomeAppbar scene={scene} navigation={navigation}/>
//             header: (props) => (
//               <HomeAppbar {...props}/>
//             )
//           }}
//         >
//           <Stack.Screen
//             name="Home"
//             component={HomeScreen}
//             initialParams={{
//               modalVisible: false
//             }}
//             options={{ 
//               headerTitle: "Test1Home", 
//             }}
//           />
//           {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
//         </Stack.Navigator>
//       </NavigationContainer>
//     </GestureHandlerRootView>
//   );
// }

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

function Home() {
  return (
    <Drawer.Navigator
      headerMode='screen'
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen} initialParams={{
        modalVisible: false,
        }}
        options={{
          header: (props) => (
            <HomeAppbar {...props}/>
          ),
          drawerStyle: {
            // backgroundColor: '#c6cbef',
            width: 200,
          },
          drawerPosition :'right',
          drawerType: 'front',
          swipeEnabled: false
        }}
      />
      <Drawer.Screen
        name="Add categories"
        component={ExpenditureCategoryScreen}
        options={{
          drawerStyle: {
            // backgroundColor: '#c6cbef',
            width: 200,
          },
          drawerPosition :'right',
          drawerType: 'front',
          swipeEnabled: false
        }}
      /> 
    </Drawer.Navigator>
  )
}

const Drawer = createDrawerNavigator();
export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Root'
        >
          <Stack.Screen
            name="Root"
            component={Home}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
  }
});

// export default MyStack;

