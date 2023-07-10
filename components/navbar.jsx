import React, { useRef, useState, useEffect } from 'react';
import {View, Text, Button, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Entypo } from '@expo/vector-icons';
const {width, height} = Dimensions.get('window');

const Navbar = (props) => {
    return (
        <View style={[Styles.container]}>
            <Image source={require('../assets/logo.png')} style={[Styles.logo]} />
            <Text style={{ fontSize: width/24 }}>{props.title}</Text>
            <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
                <Entypo name="menu" size={24} color="black" />
            </TouchableOpacity>
        </View>
    )
}
const Styles=StyleSheet.create({
    container:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,

        elevation: 30,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,  

        paddingVertical: 5,
        backgroundColor: 'white'
    },
    logo: {
        width: '20%',
        height: 50,
        resizeMode: 'contain'
    }
});

export default Navbar;