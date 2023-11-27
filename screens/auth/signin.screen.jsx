import React, {useState, useEffect, useRef} from 'react';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { StatusBar, ScrollView, Pressable, View, Text, TextInput, Dimensions, StyleSheet, Image } from 'react-native';
import IntlPhoneInput from 'react-native-intl-phone-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedModal from '../../components/animatedModal';
import Loading from '../../components/loading';
import axios from '../../config/server.config';
const {width, height} = Dimensions.get('window');

const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: 'green', height: 120 }}
        text1Style={{
          fontSize: width/23,
        }}
        text2Style={{
            fontSize: width/24,
        }}
      />
    ),
    /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
    error: (props) => (
      <ErrorToast
        {...props}
        text1Style={{
            fontSize: width/23,
          }}
          text2Style={{
              fontSize: width/24,
        }}
      />
    )
};
const SignIn = ({ navigation }) => {
    useEffect(() => {
        checkU();
    }, []);
    const checkU = async () => {
        const phoneN = await AsyncStorage.getItem('phone-number');
        if (phoneN) {
            await axios
            .get('/signin/checkuserbyPhone?phone=' + phoneN)
            .then(async function (res) {
                if (res?.data === "success") {
                    navigation.replace('UserScreen')
                }
            }).catch(error => {
                console.error(error);
            });
        }
    }
    const [firstName, setFirstName] = useState('');
    const [phone, setPhone] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [verifyCode, setVerifyCode] = React.useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [scrollEnabled, setScrollEnabled] = useState(true);

    const handleButtonPress = () => {
        setScrollEnabled(false);
        // perform button action
        setScrollEnabled(true);
    };
    
    const setFirstNameHandler = (event) => {
        setFirstName(event);
    }
    const setLastNameHandler = (event) => {
        setLastName(event);
    }
    const setPhoneNumberHandler = (event) => {

        let pn = event.phoneNumber+"";
        if (pn[0]=="0") {
            var char = pn[0];
            const replaced = pn.replace(char, "");
            pn = replaced;
        }
        let phoneN = event.dialCode+pn.replaceAll(" ", "");
        console.log(phoneN)
        setPhoneNumber(phoneN.replaceAll("+", ""));
    }
    const setVerifyCodeHandler = (event) => {
        setVerifyCode(event);
    }
    const verifyHandler = async () => {
        setScrollEnabled(false);
        setLoading(true);
        const phoneN = await AsyncStorage.getItem('phone-number-temp');
        await axios
            .get('/verify/code?code=' + verifyCode + '&phone=' + phoneN)
            .then(async function (res) {
                setLoading(false);
                if (res?.data=="success") {
                    await AsyncStorage.setItem('phone-number', phoneN);
                    navigation.replace('UserScreen')
                } else {
                    Toast.show({ type: 'error', position: 'top', text1: 'Invalid Code', text2: '', visibilityTime: 3000, autoHide: true, topOffset: 30, bottomOffset: 40 });
                    setModalVisible(false);
                }
            }).catch(error => {
                console.error(error);
            });
        setScrollEnabled(true);
    }
    const signinHandler = async () => {
        setScrollEnabled(false);
        setLoading(true);
        await axios
            .get('/signin/checkuser?first_name=' + firstName + '&last_name=' + lastName + '&phone=' + phoneNumber)
            .then(async function (res) {
                setLoading(false);
                if (res?.data === "wrong user") {
                    Toast.show({ type: 'error', position: 'top', text1: 'Confirm Email Verification', text2: 'Please verify your identity!', visibilityTime: 3000, autoHide: true, topOffset: 30, bottomOffset: 40 });
                } else if (res?.data === "invalid input") {
                    Toast.show({ type: 'error', position: 'top', text1: 'Not entered the all information', text2: 'Please check it again!', visibilityTime: 3000, autoHide: true, topOffset: 30, bottomOffset: 40 });
                } else {
                    setPhone(res?.data[0]);
                    if (phoneNumber === (res?.data[0]+"")) {
                        await AsyncStorage.setItem('phone-number-temp', phoneNumber);
                        await AsyncStorage.setItem('first_name', res?.data[1]?.first_name);
                        await AsyncStorage.setItem('last_name', res?.data[1]?.last_name);
                        setModalVisible(true);
                    }
                }
            }).catch(error => {
                Toast.show({ type: 'error', position: 'top', text1: 'Host not found', text2: 'Please check your internet connection', visibilityTime: 65000, autoHide: true, topOffset: 30, bottomOffset: 40 });
                console.error(error);
            });
        setScrollEnabled(true);
    }
    const closeModal = () => {
        setModalVisible(false);
    };
    
    return (
        <ScrollView scrollEnabled={scrollEnabled} keyboardShouldPersistTaps="handled">
            <View style={[Styles.container]}>
                <StatusBar />
                <Image source={require('../../assets/background.png')} style={[Styles.logo]} />
                <View style={[Styles.row]}>
                    <Text style={[Styles.textStyle]}>First Name</Text>
                    <TextInput style={[Styles.textInput]} value={firstName} onChangeText={setFirstNameHandler} placeholder="Enter your first name" />
                </View>
                <View style={[Styles.row]}>
                    <Text style={[Styles.textStyle]}>Last Name</Text>
                    <TextInput style={[Styles.textInput]} value={lastName} onChangeText={setLastNameHandler} placeholder="Enter your last name" />
                </View>
                <View style={[Styles.telRow]}>
                    <Text style={[Styles.textStyle]}>Mobile Number</Text>
                    <IntlPhoneInput
                        containerStyle={{ flex: 1 }}
                        dialCodeTextStyle={{ fontSize: width/24 }}
                        phoneInputStyle={{ fontSize:width/24 }}
                        value={phoneNumber}
                        defaultCountry="GB"
                        onChangeText={setPhoneNumberHandler}
                        mask="9999 999999"
                    />
                </View>
                <AnimatedModal
                    visible={modalVisible}
                    animationType="fade"
                    onClose={closeModal}
                    verify={true}
                >
                    <Text style={[Styles.textStyle]}>Please enter the verify code</Text>
                    <View style={[Styles.row]}>
                        <TextInput style={[Styles.textInput]} value={verifyCode} onChangeText={setVerifyCodeHandler} />
                        <Pressable style={Styles.button} onPress={() => verifyHandler()}>
                            <Text style={{color: 'white', fontWeight: 500, fontSize: width/24}}>Confirm</Text>
                        </Pressable>
                    </View>
                </AnimatedModal>
                <Pressable style={Styles.button} onPress={() => signinHandler()}>
                    <Text style={{color: 'white', fontWeight: 500, fontSize: width/24}}>Sign In</Text>
                </Pressable>
                <Loading loading={loading} />
                <Toast config={toastConfig} />
            </View>
        </ScrollView>
    );
}

const Styles = new StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        paddingHorizontal: width * 0.05
    },
    logo: {
        width: '50%',
        height: 200,
        resizeMode: 'contain'
        // width: width * 0.5,
        // height: height * 0.3,
        // // resizeMode: 'cover'
    },
    row: {
        marginTop: 10,
        alignItems: 'flex-start',
        width:' 100%'
    },
    telRow: {
        flex: 1,
        marginTop: 10,
        alignItems: 'flex-start',
        width:' 100%'
    },  
    textInput: {
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 0.5,
        paddingVertical: 5,
        paddingHorizontal: 15,
        marginTop: 5,
        borderRadius: 5,
        fontSize: width/24
    },
    textStyle: {
        fontSize: width/24
    },
    button: {
        width: '100%',
        paddingVertical: 15,
        alignItems: 'center',
        backgroundColor: '#3b71ca',
        borderRadius: 5,
        marginTop: 20,
        marginBottom: 20
    }
});

export default SignIn;