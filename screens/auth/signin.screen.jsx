import React, {useState, useEffect, useRef} from 'react';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';
import { StatusBar, ScrollView, Pressable, View, Text, TextInput, Dimensions, StyleSheet, Image } from 'react-native';
import IntlPhoneInput from 'react-native-intl-phone-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedModal from '../../components/animatedModal';
import Loading from '../../components/loading';
import axios from '../../config/server.config';
const {width, height} = Dimensions.get('window');

const SignIn = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [phone, setPhone] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [verifyCode, setVerifyCode] = React.useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const setFirstNameHandler = (event) => {
        setFirstName(event);
    }
    const setLastNameHandler = (event) => {
        setLastName(event);
    }
    const setPhoneNumberHandler = (event) => {
        let phoneN = event.dialCode+event.phoneNumber.replaceAll(" ", "");
        setPhoneNumber(phoneN.replaceAll("+", ""));
    }
    const setVerifyCodeHandler = (event) => {
        setVerifyCode(event);
    }
    const verifyHandler = async () => {
        setLoading(true);
        const phoneN = await AsyncStorage.getItem('phone-number');
        await axios
            .get('/verify/code?code=' + verifyCode + '&phone=' + phoneN)
            .then(function (res) {
                setLoading(false);
                if (res?.data=="success") {
                    navigation.replace('UserScreen')
                } else {
                    Toast.show({ type: 'error', position: 'top', text1: 'Invalid Code', text2: '', visibilityTime: 3000, autoHide: true, topOffset: 30, bottomOffset: 40 });
                    setModalVisible(false);
                }
            }).catch(error => {
                console.error(error);
            });
    }
    const signinHandler = async () => {
        setLoading(true);
        await axios
            .get('/signin/checkuser?first_name=' + firstName + '&last_name=' + lastName + '&phone=' + phoneNumber)
            .then(async function (res) {
                setLoading(false);
                if (res?.data === "wrong user") {
                    Toast.show({ type: 'error', position: 'top', text1: 'Confirm Email Verification', text2: 'Please verify your identity!', visibilityTime: 3000, autoHide: true, topOffset: 30, bottomOffset: 40 });
                } else {
                    setPhone(res?.data);
                    if (phoneNumber === (res?.data+"")) {
                        await AsyncStorage.setItem('phone-number', phoneNumber);
                        setModalVisible(true);
                    }
                }
            }).catch(error => {
                console.error(error);
            });
    }
    const closeModal = () => {
        setModalVisible(false);
    };
    
    return (
        <ScrollView>
            <View style={[Styles.container]}>
                <StatusBar />
                <Image source={require('../../assets/background.png')} style={[Styles.logo]} />
                <View style={[Styles.row]}>
                    <Text>First Name</Text>
                    <TextInput style={[Styles.textInput]} value={firstName} onChangeText={setFirstNameHandler} placeholder="Enter your first name" />
                </View>
                <View style={[Styles.row]}>
                    <Text>Last Name</Text>
                    <TextInput style={[Styles.textInput]} value={lastName} onChangeText={setLastNameHandler} placeholder="Enter your last name" />
                </View>
                <View style={[Styles.row]}>
                    <Text>Mobile Number</Text>
                    <IntlPhoneInput
                        value={phoneNumber}
                        defaultCountry="GB"
                        onChangeText={setPhoneNumberHandler}
                    />
                </View>
                <AnimatedModal
                    visible={modalVisible}
                    animationType="fade"
                    onClose={closeModal}
                >
                    <Text>Please enter the verify code</Text>
                    <View style={[Styles.row]}>
                        <TextInput style={[Styles.textInput]} value={verifyCode} onChangeText={setVerifyCodeHandler} />
                        <Pressable style={Styles.button} onPress={() => verifyHandler()}>
                            <Text style={{color: 'white', fontWeight: 500}}>Confirm</Text>
                        </Pressable>
                    </View>
                </AnimatedModal>
                <Pressable style={Styles.button} onPress={() => signinHandler()}>
                    <Text style={{color: 'white', fontWeight: 500}}>Sign In</Text>
                </Pressable>
                <Loading loading={loading} />
                <Toast />
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
        width: width * 0.6,
        height: height * 0.4,
        resizeMode: 'cover'
    },
    row: {
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