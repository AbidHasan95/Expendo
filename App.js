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

import { createNativeStackNavigator } from'@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
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

