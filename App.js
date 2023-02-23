import * as React from 'react';
import {
  GestureHandlerRootView,
  RectButton,
} from 'react-native-gesture-handler';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme,useTheme, Text, TextInput,Button } from 'react-native-paper';
import { createNativeStackNavigator } from'@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import HomeAppbar from './src/components/HomeAppbar';
import { StyleSheet, useColorScheme} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { View } from 'react-native';
import ExpenditureCategoryScreen from './src/screens/CategoryScreen';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['flexWrap']); // Ignore log notification by message
import DrawerItems from './src/components/DrawerItems';
import { auth } from './config/firebase';
import { onAuthStateChanged, sendPasswordResetEmail} from 'firebase/auth';

const Stack = createNativeStackNavigator();
export const PreferencesContext = React.createContext(null)

const violetDark = {"colors": {
  "primary": "rgb(255, 169, 251)",
  "onPrimary": "rgb(89, 0, 96)",
  "primaryContainer": "rgb(122, 20, 129)",
  "onPrimaryContainer": "rgb(255, 214, 249)",
  "secondary": "rgb(217, 191, 212)",
  "onSecondary": "rgb(60, 43, 59)",
  "secondaryContainer": "rgb(84, 65, 82)",
  "onSecondaryContainer": "rgb(246, 219, 240)",
  "tertiary": "rgb(246, 184, 170)",
  "onTertiary": "rgb(76, 38, 29)",
  "tertiaryContainer": "rgb(102, 59, 49)",
  "onTertiaryContainer": "rgb(255, 218, 210)",
  "error": "rgb(255, 180, 171)",
  "onError": "rgb(105, 0, 5)",
  "errorContainer": "rgb(147, 0, 10)",
  "onErrorContainer": "rgb(255, 180, 171)",
  "background": "rgb(30, 26, 29)",
  "onBackground": "rgb(233, 224, 228)",
  "surface": "rgb(30, 26, 29)",
  "onSurface": "rgb(233, 224, 228)",
  "surfaceVariant": "rgb(77, 68, 75)",
  "onSurfaceVariant": "rgb(209, 195, 204)",
  "outline": "rgb(153, 141, 150)",
  "outlineVariant": "rgb(77, 68, 75)",
  "shadow": "rgb(0, 0, 0)",
  "scrim": "rgb(0, 0, 0)",
  "inverseSurface": "rgb(233, 224, 228)",
  "inverseOnSurface": "rgb(52, 47, 50)",
  "inversePrimary": "rgb(150, 51, 155)",
  "elevation": {
    "level0": "transparent",
    "level1": "rgb(41, 33, 40)",
    "level2": "rgb(48, 37, 47)",
    "level3": "rgb(55, 42, 53)",
    "level4": "rgb(57, 43, 56)",
    "level5": "rgb(62, 46, 60)"
  },
  "surfaceDisabled": "rgba(233, 224, 228, 0.12)",
  "onSurfaceDisabled": "rgba(233, 224, 228, 0.38)",
  "backdrop": "rgba(54, 46, 53, 0.4)"
}};

const violetLight = {"colors": {
  "primary": "rgb(150, 51, 155)",
  "onPrimary": "rgb(255, 255, 255)",
  "primaryContainer": "rgb(255, 214, 249)",
  "onPrimaryContainer": "rgb(55, 0, 59)",
  "secondary": "rgb(109, 88, 106)",
  "onSecondary": "rgb(255, 255, 255)",
  "secondaryContainer": "rgb(246, 219, 240)",
  "onSecondaryContainer": "rgb(38, 22, 37)",
  "tertiary": "rgb(130, 82, 71)",
  "onTertiary": "rgb(255, 255, 255)",
  "tertiaryContainer": "rgb(255, 218, 210)",
  "onTertiaryContainer": "rgb(51, 17, 10)",
  "error": "rgb(186, 26, 26)",
  "onError": "rgb(255, 255, 255)",
  "errorContainer": "rgb(255, 218, 214)",
  "onErrorContainer": "rgb(65, 0, 2)",
  "background": "rgb(255, 251, 255)",
  "onBackground": "rgb(30, 26, 29)",
  "surface": "rgb(255, 251, 255)",
  "onSurface": "rgb(30, 26, 29)",
  "surfaceVariant": "rgb(237, 222, 232)",
  "onSurfaceVariant": "rgb(77, 68, 75)",
  "outline": "rgb(127, 116, 124)",
  "outlineVariant": "rgb(209, 195, 204)",
  "shadow": "rgb(0, 0, 0)",
  "scrim": "rgb(0, 0, 0)",
  "inverseSurface": "rgb(52, 47, 50)",
  "inverseOnSurface": "rgb(248, 238, 242)",
  "inversePrimary": "rgb(255, 169, 251)",
  "elevation": {
    "level0": "transparent",
    "level1": "rgb(250, 241, 250)",
    "level2": "rgb(247, 235, 247)",
    "level3": "rgb(244, 229, 244)",
    "level4": "rgb(242, 227, 243)",
    "level5": "rgb(240, 223, 241)"
  },
  "surfaceDisabled": "rgba(30, 26, 29, 0.12)",
  "onSurfaceDisabled": "rgba(30, 26, 29, 0.38)",
  "backdrop": "rgba(54, 46, 53, 0.4)"
}};

const DrawerContent = () => {
  return (
    <PreferencesContext.Consumer>
      {(preferences) => (
        <DrawerItems
          toggleTheme={preferences.toggleTheme}
          isDarkTheme={preferences.theme.dark}
        />
      )}
    </PreferencesContext.Consumer>
  );
};

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

const SplashScreen = ({navigation}) => {
  onAuthStateChanged(auth, (user)=> {
    if (user) {
        const uid = user.uid
        const email = user.email
        const displayName = user.displayName
        // currUser = auth.currentUser
        initialRouteScreen = 'Home'
        console.log("loggged in->>>",uid, email,displayName)
        navigation.navigate('Home')
        // console.log("loggged in2->>>",currUser.uid, currUser.email,currUser.displayName)
        // navigation.navigate("Home")
    }
    else {
        console.log("Logged out-------")
        navigation.navigate('Login')
    }
    
  })
  return (
    <View>
      <Text>Waiting...</Text>
    </View>
  )
}

const ResetPasswordScreen = ({navigation}) => {
  const [userDetails, setUserDetails] = React.useState({
    email:"",
    status:"",
    error:"",
    success: false
  })
  return(
    <View style={{flexDirection:"column", justifyContent:"center", alignItems:"center",height:"100%"}}>
      {!!userDetails.success && <View><Text>Reset Sucess for {userDetails.email}</Text></View>}
      <View style={{flexDirection:"row"}}>
        <TextInput
            label="Email"
            mode="outlined"
            value={userDetails.email}
            right={<TextInput.Icon icon="email"/>}
            onChangeText={(text)=> {
              setUserDetails({...userDetails,email: text})
              if (userDetails.success) {
                setUserDetails({...userDetails, success: false})
              }
            }}
            style={{width:"70%"}}
        />
        <View style={{marginHorizontal:5, justifyContent:"center"}}>
          <Button mode="contained" disabled={!!userDetails.success} onPress={()=> {
            console.log("sending password reset for",userDetails.email)
            sendPasswordResetEmail(auth,userDetails.email).then(() => {
              setUserDetails({...userDetails,success:true})
              console.log("!!! Password Reset email sent !!!")
            })
          }}>Reset</Button>
        </View>
      </View>
      <Button mode="contained" onPress={() => {
        navigation.navigate("Login")
      }}>Back</Button>
    </View>
  )
}

// function Home() {
  
//   return (
//       <Drawer.Navigator
//         // headerMode='screen'
//         drawerContent={() => <DrawerContent />}
//         >
//         <Drawer.Screen 
//           name="Login" 
//           component={LoginScreen} 
//           initialParams={{
//             modalVisible: false,
//           }}
//         />
//         <Drawer.Screen 
//           name="Home" 
//           component={HomeScreen} 
//           initialParams={{
//             modalVisible: false,
//           }}
//           options={{
//             header: (props) => (
//               <HomeAppbar {...props}/>
//             ),
//             drawerStyle: {
//               // backgroundColor: '#c6cbef',
//               width: 200,
//             },
//             drawerPosition :'right',
//             drawerType: 'front',
//             swipeEnabled: false
//           }}
//         />
//         <Drawer.Screen
//           name="Add categories"
//           component={ExpenditureCategoryScreen}
//           options={{
//             drawerStyle: {
//               // backgroundColor: '#c6cbef',
//               width: 200,
//             },
//             drawerPosition :'right',
//             drawerType: 'front',
//             swipeEnabled: false
//           }}
//         /> 
//       </Drawer.Navigator>
//   )
// }

const Drawer = createDrawerNavigator();
export default function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const lightTheme = {
    ...MD3LightTheme,
    ...violetLight
  }
  const darkTheme = {
    ...MD3DarkTheme,
    ...violetDark
  }
  
  const colorScheme = useColorScheme();
  console.log("scheme==============================",colorScheme)
  // const theme = colorScheme === "dark"? darkTheme:lightTheme
  const themeMode = isDarkMode ? 'dark' : 'light';
  // const theme = darkTheme
  const theme = isDarkMode? darkTheme: lightTheme
  const preferences = React.useMemo(
    () => ({
      toggleTheme: () => {
        setIsDarkMode((oldValue) => {
          console.log("old val",isDarkMode,!oldValue)
          return !oldValue
        })
        console.log("Dark mode value changed",isDarkMode)
      },
      theme,
    }),
    [theme]
  );
  return (
    <PaperProvider theme={theme}>
      <PreferencesContext.Provider value={preferences}>
        <React.Fragment>
          <NavigationContainer>
            <Drawer.Navigator
              // headerMode='screen'
              // initialRouteName='Login'
              initialRouteName='SplashScreen'
              drawerContent={() => <DrawerContent />}
              >
              <Drawer.Screen 
                name="Home" 
                component={HomeScreen} 
                initialParams={{
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
                name="Login" 
                component={LoginScreen} 
                initialParams={{
                  modalVisible: false,
                }}
                options={{
                  swipeEnabled: false,
                  headerShown: false
                }}
              />
              <Drawer.Screen
                name="PasswordReset"
                component={ResetPasswordScreen}
                options={{
                  headerShown:false
                }}
              />
              <Drawer.Screen
                name="SplashScreen"
                component={SplashScreen}
              />
              <Drawer.Screen
                name="Categories"
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
           <StatusBar style={theme.dark ? 'light' : 'dark'} />
          </NavigationContainer>
        </React.Fragment>
      </PreferencesContext.Provider>
    </PaperProvider>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
  }
});

// export default MyStack;

