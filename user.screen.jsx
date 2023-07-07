import React, { useRef, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { getHeaderTitle } from '@react-navigation/elements';

const Drawer = createDrawerNavigator();
import SongList from './screens/user/songlist.screen'
import MyRequestScreen from './screens/user/my.request';
import Navbar from './components/navbar';

const UserScreen = (props) => {
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
                
                    return <Navbar navigation={navigation} title={title} />
                }
            }}
        >
            <Drawer.Screen name="Request Songs" component={SongList} options={{ drawerLabel: 'Request Songs' }} />
            <Drawer.Screen name="My Requests" headerShown={false} component={MyRequestScreen} options={{ drawerLabel: 'My Requests' }} />
        </Drawer.Navigator>
    )
}

export default UserScreen;