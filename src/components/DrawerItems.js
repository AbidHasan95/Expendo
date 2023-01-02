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
import { PreferencesContext } from '../../App';

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
    const [drawerItemIndex, setDrawerItemIndex] = React.useState(0);
    const _setDrawerItem = (index) => setDrawerItemIndex(index);
    const preferences = React.useContext(PreferencesContext);
    return(
        <DrawerContentScrollView style={{backgroundColor: theme.colors.background}}>
            <Drawer.Section title="Example items" theme={theme}>
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
            <Drawer.Section title="Preferences">
                <TouchableRipple onPress={props.toggleTheme}>
                    <View style={[styles.preference]}>
                        <Text variant="labelLarge">Dark Theme</Text>
                        <View pointerEvents="none">
                        <Switch value={props.isDarkTheme} />
                        </View>
                    </View>
                </TouchableRipple>
            </Drawer.Section>
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