import React, { useRef, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
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


const UserScreen = (props) => {
    const [userPermit, setUserPermit] = useState('0');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getUser();
        console.log("get");
    }, []);
    const getUser = async () => {
        setLoading(true);
        const phoneN = await AsyncStorage.getItem('phone-number');
    
        await axios
            .get('/getUserByPhone?phone=' + phoneN)
            .then(function (res) {
                let permit = res?.data[0]?.role;
                setUserPermit(permit);
                setLoading(false);
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
                <DrawerItem label="Logout" onPress={() => props.navigation.replace("SignIn")} />
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
            <Drawer.Screen name="Request Songs" component={SongList} options={{ drawerLabel: 'Request Songs' }} />
            <Drawer.Screen name="My Requests" headerShown={false} component={MyRequestScreen} options={{ drawerLabel: 'My Requests' }} />
            {
                userPermit===1 &&
                <Drawer.Screen name="Song Manager" headerShown={false} component={SongManager} options={{ drawerLabel: 'Song Manager' }} />
            }
        </Drawer.Navigator>
    )
}

export default UserScreen;