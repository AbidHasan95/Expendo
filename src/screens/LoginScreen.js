import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import { TextInput, Text, Button, Modal, Provider, Portal, useTheme } from 'react-native-paper';
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth, onAuthStateChanged,updateProfile } from 'firebase/auth';

const LoginScreen = ({navigation}) => {
    const [isLoginModalVisible, setLoginModalVisibility] = useState(false)
    const [isSignupModalVisible, setSignupModalVisibility] = useState(false)
    const [userCredentials, setUserCredentials] = useState({
        email: '',
        password: '',
        confirmPassword:'',
        displayName: '',
        error: ''
    })
    const theme=useTheme();
    const resetUserCreds = () => {
        setUserCredentials({
            email:'',
            password:'',
            confirmPassword:'',
            error:''
        })
    }
    const showModalLogin = () => {
        setLoginModalVisibility(true)
    }
    const showModalSignup = () => {
        setSignupModalVisibility(true)
    }
    const hideModalLogin = () => {
        setLoginModalVisibility(false)
        resetUserCreds()
    }
    const hideModalSignup = () => {
        setSignupModalVisibility(false)
        resetUserCreds()
    }
    // const showModal = (screen) => {
    //     if (screen=='login') {
    //         setLoginModalVisibility(true)
    //     }
    //     else if (screen=='signup') {
    //         setSignupModalVisibility(true)
    //     }
    // };
    // const hideModal = (screen) => {
    //     if (screen=='login') {
    //         setLoginModalVisibility(false)
    //     }
    //     else if (screen=='signup') {
    //         setSignupModalVisibility(false)
    //     }
    // };

    
    async function signIn() {
        if (userCredentials.email === '' || userCredentials.password === '') {
        setUserCredentials({
            ...userCredentials,
            error: 'Email and password are mandatory.'
        })
        return;
        }

        try {
            await signInWithEmailAndPassword(auth, userCredentials.email, userCredentials.password);
            console.log("Successfully signed in...")
        } catch (error) {
        setUserCredentials({
            ...userCredentials,
            error: error.message,
        })
        }
    }
    async function signUp() {
        console.log("Tring to signup: ",userCredentials)
        if (userCredentials.email === '' || userCredentials.password === '' || userCredentials.confirmPassword ==='' || userCredentials.displayName === '') {
            setUserCredentials({
            ...userCredentials,
            error: 'Please enter all the required fields.'
            })
            return;
        }
        if (userCredentials.password !== userCredentials.confirmPassword) {
            setUserCredentials({
                ...userCredentials,
                error: "Passwords don't match"
            })
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
            .then(userCredential => {
                console.log("setting displayName", userCredentials.displayName)
                userCredential.user.updateProfile({
                    displayName: userCredentials.displayName
                })
            })
            .catch((error => {
                console.log("Error on signup", error)
            }));
            const user = auth.currentUser
            await updateProfile(user,{
                displayName: userCredentials.displayName
            })
            // navigation.navigate('Sign In');
            console.log("Successfully created a account")
        } catch (error) {
            console.log("Error in signup",error)
            setUserCredentials({
            ...userCredentials,
            error: error.message,
            })
        }
    }
    return (
        <Provider theme={theme}>
            <Portal theme={theme}>
                <Modal
                    visible={isLoginModalVisible}
                    onDismiss={hideModalLogin}
                    contentContainerStyle={[styles.modalContainer,{backgroundColor:theme.colors.secondaryContainer}]}>
                    <View>
                        <Text>Login to an existing account</Text>
                        {!!userCredentials.error && <View style={styles.error}><Text>{userCredentials.error}</Text></View>}
                        <TextInput 
                            label="Email"
                            autoComplete='email'
                            right={<TextInput.Icon icon="email"/>}
                            value={userCredentials.email}
                            onChangeText={(text) => setUserCredentials({ ...userCredentials, email: text })}>
                        </TextInput>
                        <TextInput 
                            label="Password"
                            // autoComplete='off'
                            right={<TextInput.Icon icon="lock"/>}
                            secureTextEntry={true} 
                            value={userCredentials.password}
                            style={{marginBottom:10}}
                            onChangeText={(text) => setUserCredentials({ ...userCredentials, password: text })}>
                        </TextInput>
                        {/* <View style={{flexDirection: "row", justifyContent: "space-around"}}> */}
                            <Button mode='contained' onPress={signIn}>Login</Button>
                            <Button mode='text' onPress={() => {
                                navigation.navigate("PasswordReset")
                            }}>Forgot password</Button>
                        {/* </View> */}
                    </View>
                </Modal>
                <Modal
                    visible={isSignupModalVisible}
                    onDismiss={hideModalSignup}
                    contentContainerStyle={[styles.modalContainer,{backgroundColor:theme.colors.secondaryContainer}]}
                >
                    <View>
                        <Text>Create a new account</Text>
                        {!!userCredentials.error && <View style={styles.error}><Text>{userCredentials.error}</Text></View>}
                        <TextInput 
                            label="Display Name"
                            value={userCredentials.displayName}
                            onChangeText={(text) => setUserCredentials({ ...userCredentials, displayName: text })}>
                        </TextInput>
                        <TextInput 
                            label="Email"
                            autoComplete='email'
                            value={userCredentials.email}
                            onChangeText={(text) => setUserCredentials({ ...userCredentials, email: text })}>
                        </TextInput>
                        <TextInput 
                            label="Password"
                            secureTextEntry={true} 
                            value={userCredentials.password}
                            onChangeText={(text) => setUserCredentials({ ...userCredentials, password: text })}>
                        </TextInput>
                        <TextInput 
                            label="Confirm Password"
                            secureTextEntry={true} 
                            value={userCredentials.confirmPassword}
                            onChangeText={(text) => setUserCredentials({ ...userCredentials, confirmPassword: text })}>
                        </TextInput>
                        <Button mode="contained" onPress={signUp}>Sign up</Button>
                    </View>
                </Modal>
            </Portal>
        <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center",height:"100%", borderWidth:1, marginVertical:"auto"}}>
            <Button mode="contained" style={{padding:10, borderRadius:30}} onPress={showModalLogin}>Login</Button>
            <Button mode="contained" style={{padding:10, borderRadius:30}} onPress={showModalSignup}>Signup</Button>
        </View>
        </Provider>
    );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: StatusBar.currentHeight || 0,
    marginTop: 0,
  },
  error: {
    marginTop: 10,
    padding: 10,
    color: '#fff',
    backgroundColor: '#D54826FF',
  },
  modalContainer: {
    // backgroundColor: 'white', 
    padding: 20,
    margin: 20,
    borderRadius: 20,
  }
});
export default LoginScreen;
