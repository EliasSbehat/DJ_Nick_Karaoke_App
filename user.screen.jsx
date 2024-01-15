import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { getHeaderTitle } from '@react-navigation/elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from './config/server.config';
import Loading from './components/loading';
const Drawer = createDrawerNavigator();
import SongList from './screens/user/songlist.screen'
import MyRequestScreen from './screens/user/my.request';
import SongManager from './screens/user/song.mng';
import Navbar from './components/navbar';
const {width, height} = Dimensions.get('window');

const UserScreen = (props) => {
    const [userPermit, setUserPermit] = useState('0');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getUser();
        console.log("get");
    }, []);
    const getUser = async () => {
        // setLoading(true);
        const phoneN = await AsyncStorage.getItem('phone-number');
        setInterval(async ()=>{
            console.log("Login tester");
            await axios
            .get('/signin/checkuserbyPhone?phone=' + phoneN)
            .then(async function (res) {
                console.log(res?.data);
                if (res?.data === "no-user") {
                    props.navigation.replace('SignIn')
                }
            }).catch(error => {
                console.error(error);
            });
        }, 30000)
        await axios
            .get('/getUserByPhone?phone=' + phoneN)
            .then(async function (res) {
                let permit = res?.data[0]?.role;
                console.log('set user name: '+ res?.data[0]?.first_name);
                await AsyncStorage.setItem('first_name', res?.data[0]?.first_name);
                await AsyncStorage.setItem('last_name', res?.data[0]?.last_name);
                setUserPermit(permit);
                // setLoading(false);
            }).catch(error => {
                console.error(error);
            });
    }
    return (
        <Drawer.Navigator initialRouteName="Request Songs" 
        drawerContent={props => {
            return (
                <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                <DrawerItem label="Logout" onPress={async () => {await AsyncStorage.setItem('phone-number', ""); props.navigation.replace("SignIn"); }} />
                </DrawerContentScrollView>
            )
        }}
        screenOptions={{
                header: ({ navigation, route, options }) => {
                    const title = getHeaderTitle(options, route.name);
                
                    return <View>
                            <Loading loading={loading} />
                            <Navbar navigation={navigation} title={title} />
                        </View>
                }
            }}
        >
            <Drawer.Screen labelStyle={{ fontSize: width/24 }} name="Request Songs" component={SongList} options={{ drawerLabel: 'Request Songs' }} />
            <Drawer.Screen labelStyle={{ fontSize: width/24 }} name="My Requests" headerShown={false} component={MyRequestScreen} options={{ drawerLabel: 'My Requests' }} />
            {
                userPermit===1 &&
                <Drawer.Screen labelStyle={{ fontSize: width/24 }} name="Song Manager" headerShown={false} component={SongManager} options={{ drawerLabel: 'Song Manager' }} />
            }
        </Drawer.Navigator>
    )
}

export default UserScreen;