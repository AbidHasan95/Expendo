import * as React from 'react';
import {
    Badge,
    Drawer,
    MD3Colors,
    Switch,
    Text,
    TouchableRipple,
    useTheme
  } from 'react-native-paper';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { View,StyleSheet} from 'react-native';
// import { PreferencesContext } from '../../App';
// import { PreferencesContext } from '../../App';
import { auth } from '../../config/firebase';

const DrawerItemsData = [
    {
        label : 'Home',
        key:0
    },
    {
        label: 'Categories',
        key: 1
    }
]

// const DrawerItems = ({toggleTheme,isDarkTheme,navigation}) => {
const DrawerItems = (props) => {
    const navigation = useNavigation();
    const theme = useTheme();
    // console.log("DrawerItems props==============+++++++++++++++++++++++++",props)
    // console.log('firebase user details', auth.currentUser.uid ,auth.currentUser)
    var user = auth.currentUser
    var displayName = user!== null? user.displayName:""
    const [drawerItemIndex, setDrawerItemIndex] = React.useState(0);
    const _setDrawerItem = (index) => setDrawerItemIndex(index);
    // const preferences = React.useContext(PreferencesContext);
    return(
        <DrawerContentScrollView style={{backgroundColor: theme.colors.background}}>
            <Drawer.Item icon="account-outline" label={displayName}/>
            <Drawer.Section theme={theme}>
                {DrawerItemsData.map((props, index) => (
                <Drawer.Item
                    {...props}
                    key={props.key}
                    // theme={{colors: {secondaryContainer: MD3Colors.tertiary80, onSecondaryContainer: MD3Colors.tertiary20}}}
                    theme={theme}
                    active={drawerItemIndex === index}
                    onPress={() => {
                        _setDrawerItem(index)
                        navigation.navigate(props.label)
                    }}
                />
                ))}
            </Drawer.Section>
            <Drawer.Section title="Appearance">
                <TouchableRipple onPress={props.toggleTheme}>
                    <View style={[styles.preference]}>
                        <Text variant="labelLarge">Dark Mode</Text>
                        <View pointerEvents="none">
                        <Switch value={props.isDarkTheme} />
                        </View>
                    </View>
                </TouchableRipple>
            </Drawer.Section>
            <Drawer.Item 
                icon="logout" 
                label="Logout"
                onPress={() => {
                    auth.signOut()
                    navigation.navigate("Login")
                }} />
        </DrawerContentScrollView>
    );
  }

const styles = StyleSheet.create({
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        // paddingHorizontal: 16,
        height: 56,
        paddingHorizontal: 28,
    },
});

export default DrawerItems;