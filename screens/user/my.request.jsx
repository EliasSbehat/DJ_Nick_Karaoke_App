import React, { useRef, useState, useEffect } from 'react';
import {View, ScrollView, Text, Button, TextInput, Pressable, StyleSheet, TouchableOpacity, Dimensions, Switch } from 'react-native';
import { DataTable, Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import axios from '../../config/server.config';
import Loading from '../../components/loading';
import AnimatedModal from '../../components/animatedModal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const {width, height} = Dimensions.get('window');

const MyRequestScreen = () => {
    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState([2, 3, 4]);
    const [loading, setLoading] = useState(false);
    const [songs, setSongs] = useState([]);
    const [allSongs, setASongs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [titleSort, setTitleSort] = useState("descending");
    const [artistSort, setArtistSort] = useState("descending");
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[0]
    );
    const [isEnabledToday, setIsEnabledToday] = useState(true);
    const toggleSwitch = () => {
        setIsEnabledToday(previousState => !previousState);
        getSongs(!isEnabledToday);
    }

    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [singer, setSinger] = useState("");
    const [dj, setDj] = useState("");
    const [requestSongId, setRequestSongId] = useState(0);

    useEffect(() => {
        getSongs(true);
    }, []);
    const getSongs = async (todayFlag) => {
        setLoading(true);
        const phoneN = await AsyncStorage.getItem('phone-number');

        await axios
            .get('/songmng/getByUser?today=' + todayFlag + '&phone=' + phoneN)
            .then(function (res) {
                setLoading(false);
                let songsData = res?.data;
                setASongs(songsData);
                setSongs(songsData);
            }).catch(error => {
                console.error(error);
            });
    }
    const titleSortHandler = () => {
        if (titleSort === "descending") {
            let sortedAry = songs.sort((a,b) => (a.title < b.title) ? 1 : ((b.title < a.title) ? -1 : 0));
            setSongs(sortedAry);
            setTitleSort("ascending");
        } else {
            let sortedAry = songs.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
            setSongs(sortedAry);
            setTitleSort("descending");
        }
    }
    const artistSortHandler = () => {
        if (artistSort === "descending") {
            let sortedAry = songs.sort((a,b) => (a.artist < b.artist) ? 1 : ((b.artist < a.artist) ? -1 : 0));
            setSongs(sortedAry);
            setArtistSort("ascending");
        } else {
            let sortedAry = songs.sort((a,b) => (a.artist > b.artist) ? 1 : ((b.artist > a.artist) ? -1 : 0));
            setSongs(sortedAry);
            setArtistSort("descending");
        }
    }
    const setTitleHandler = (event) => {
        setTitle(event);
    }
    const setArtistHandler = (event) => {
        setArtist(event);
    }
    const setSingerHandler = (event) => {
        setSinger(event);
    }
    const setDjHandler = (event) => {
        setDj(event);
    }
    
    const onChangeSearch = query => {
        setSearchQuery(query);
        const filteredData = allSongs.filter(item => {
            return item.title.toLowerCase().includes(query.toLowerCase()) || item.artist.toLowerCase().includes(query.toLowerCase());
        });
        setSongs(filteredData);
    }
    const requestHandler = (param) => {
        setRequestSongId(param.id);
        setTitle(param.title);
        setArtist(param.artist);
        setModalVisible(true);
    }
    const closeModal = () => {
        setModalVisible(false);
    };
    const submitHandler = async () => {
        setLoading(true);
        const phoneN = await AsyncStorage.getItem('phone-number');
        await axios
            .get('/songmng/request-song?title=' + title + '&artist=' + artist + '&singer=' + singer + '&dj=' + dj + '&phone=' + phoneN + '&songId=' + requestSongId)
            .then(function (res) {
                setLoading(false);
                if (res?.data==="success") {
                    Toast.show({ type: 'success', position: 'top', text1: 'Congratulations!', text2: 'Thank you for your song request.', visibilityTime: 3000, autoHide: true, topOffset: 30, bottomOffset: 40 });
                } else {
                    Toast.show({ type: 'error', position: 'top', text1: 'Sorry!', text2: 'We are not taking requests at the moment.', visibilityTime: 3000, autoHide: true, topOffset: 30, bottomOffset: 40 });
                }
                setModalVisible(false);
            }).catch(error => {
                console.error(error);
            });
    }

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, songs.length);

    React.useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);
    return (
        <ScrollView>
            <View style={[Styles.container]}>
                <View style={[Styles.row] }>
                    <Text>Past/Today</Text>
                    <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        thumbColor={isEnabledToday ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabledToday}
                    />
                </View>
                <Searchbar
                    style={{ marginTop: 10 }}
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                />
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title sortDirection={titleSort} onPress={titleSortHandler}>Title</DataTable.Title>
                        <DataTable.Title sortDirection={artistSort} onPress={artistSortHandler}>Artist</DataTable.Title>
                        {
                            !isEnabledToday &&
                                <DataTable.Title>Request</DataTable.Title>
                        }
                    </DataTable.Header>

                    {songs.slice(from, to).map((item) => (
                        <DataTable.Row key={item.id}>
                            <DataTable.Cell>{item.title}</DataTable.Cell>
                            <DataTable.Cell>{item.artist}</DataTable.Cell>
                            {
                                !isEnabledToday && 
                                    <DataTable.Cell>
                                        <Pressable style={Styles.button} onPress={() => requestHandler(item)}>
                                            <MaterialCommunityIcons name="send-circle-outline" size={24} color="white" />
                                        </Pressable>
                                    </DataTable.Cell>
                            }
                        </DataTable.Row>
                    ))}

                    <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.ceil(songs.length / itemsPerPage)}
                        onPageChange={(page) => setPage(page)}
                        label={`${from + 1}-${to} of ${songs.length}`}
                        numberOfItemsPerPageList={numberOfItemsPerPageList}
                        numberOfItemsPerPage={itemsPerPage}
                        onItemsPerPageChange={onItemsPerPageChange}
                        showFastPaginationControls
                        selectPageDropdownLabel={'Rows per page'}
                    />
                </DataTable>
                <AnimatedModal
                    visible={modalVisible}
                    animationType="fade"
                    onClose={closeModal}
                >
                    <Text>Request Song</Text>
                    <View style={[Styles.row]}>
                        <Text>Title</Text>
                        <TextInput style={[Styles.textInput]} value={title} onChangeText={setTitleHandler} />
                    </View>
                    <View style={[Styles.row]}>
                        <Text>Artist</Text>
                        <TextInput style={[Styles.textInput]} value={artist} onChangeText={setArtistHandler} />
                    </View>
                    <View style={[Styles.row]}>
                        <Text>Who is singing?</Text>
                        <TextInput style={[Styles.textInput]} value={singer} onChangeText={setSingerHandler} />
                    </View>
                    <View style={[Styles.row]}>
                        <Text>Message The DJ</Text>
                        <TextInput style={[Styles.textInput]} value={dj} onChangeText={setDjHandler} />
                    </View>
                    <Pressable style={Styles.button} onPress={() => submitHandler()}>
                        <Text style={{color: 'white', fontWeight: 500}}>Submit</Text>
                    </Pressable>
                </AnimatedModal>
                <Toast />
                <Loading loading={loading} />
            </View>
        </ScrollView>
    )
}
const Styles = new StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        paddingHorizontal: width * 0.05
    },
    row: {
        marginTop: 10,
        alignItems: 'flex-start',
        width:' 100%'
    },
    button: {
        width: '100%',
        paddingVertical: 5,
        paddingHorizontal: 5,
        alignItems: 'center',
        backgroundColor: '#3b71ca',
        borderRadius: 5,
        marginTop: 20,
        marginBottom: 20
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
});

export default MyRequestScreen;