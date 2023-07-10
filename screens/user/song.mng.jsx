import React, { useRef, useState, useEffect } from 'react';
import {View, ScrollView, Text, Button, TextInput, Pressable, StyleSheet, TouchableOpacity, Dimensions, Switch } from 'react-native';
import { DataTable, Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-toast-message';
import axios from '../../config/server.config';
import Loading from '../../components/loading';
import AnimatedModal from '../../components/animatedModal';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
const {width, height} = Dimensions.get('window');

const SongManager = () => {
    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState([5, 10, 15]);
    const [loading, setLoading] = useState(false);
    const [songs, setSongs] = useState([]);
    const [songsCount, setCountSongs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [titleSort, setTitleSort] = useState("ascending");
    const [artistSort, setArtistSort] = useState("ascending");
    const [sortFlag, setSortFlag] = useState("title");
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[0]
    );
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [songId, setSongId] = useState(0);
    const [isEnabledRequest, setIsEnabledRequest] = useState(true);

    useEffect(() => {
        getSongsCount();
        getReqGet();
    }, [searchQuery]);
    const toggleSwitch = async () => {
        let turnFlag = !isEnabledRequest;
        await axios
            .get('/getRequestSetting/set?turn='+turnFlag)
            .then(function (res) {
                getReqGet();
            }).catch(error => {
                console.error(error);
            });
        setIsEnabledRequest(previousState => !previousState);
    }
    const getReqGet = async () => {
        await axios
            .get('/getRequestSetting')
            .then(function (res) {
                let reqData = res.data;
                if (reqData.length>0) {
                    let turn = (reqData[0]?.turn_on*1===1) ? true:false;
                    setIsEnabledRequest(turn);
                }
            }).catch(error => {
                console.error(error);
            });
    }
    const getSongsCount = async () => {
        await axios
            .get('/songmng/getCount?searchQuery='+searchQuery)
            .then(function (res) {
                let songsData = res.data;
                setCountSongs(songsData);
            }).catch(error => {
                console.error(error);
            });
    }
    const getSongs = async (from, to) => {
        if (to > 0 && from < to) {
            setLoading(true);
            await axios
                .get('/songmng/get?from='+from+'&to='+to+'&titleSort='+titleSort+'&artistSort='+artistSort+'&sortFlag='+sortFlag+'&searchQuery='+searchQuery)
                .then(function (res) {
                    setLoading(false);
                    let songsData = res.data;
                    setSongs(songsData);
                }).catch(error => {
                    console.error(error);
                });
        }
    }
    const titleSortHandler = () => {
        setSortFlag('title');
        if (titleSort === "descending") {
            setTitleSort("ascending");
        } else {
            setTitleSort("descending");
        }
    }
    const artistSortHandler = () => {
        setSortFlag('artist');
        if (artistSort === "descending") {
            setArtistSort("ascending");
        } else {
            setArtistSort("descending");
        }
    }
    const setTitleHandler = (event) => {
        setTitle(event);
    }
    const setArtistHandler = (event) => {
        setArtist(event);
    }
    const onChangeSearch = query => {
        setSearchQuery(query);
    }
    const addHandler = () => {
        setModalVisible(true);
    }
    const editHandler = (param) => {
        setModalVisible(true);
        setTitle(param.title);
        setArtist(param.artist);
        setSongId(param.id);
    }
    const deleteHandler = async (id) => {
        await axios
            .get('/songmng/delete-song?id='+id)
            .then(function (res) {
                getSongsCount();
                getSongs(from, to);
            }).catch(error => {
                console.error(error);
            });
    }
    const closeModal = () => {
        setModalVisible(false);
        setTitle("");
        setArtist("");
        setSongId(0);
    };
    const submitHandler = async () => {
        setLoading(true);
        await axios
            .get('/songmng/add?title=' + title + '&artist=' + artist + '&id=' + songId)
            .then(function (res) {
                setLoading(false);
                if (res?.data==="success") {
                    Toast.show({ type: 'success', position: 'top', text1: 'Congratulations!', text2: 'Thank you for your song request.', visibilityTime: 3000, autoHide: true, topOffset: 30, bottomOffset: 40 });
                } else {
                    Toast.show({ type: 'error', position: 'top', text1: 'Sorry!', text2: 'We are not taking requests at the moment.', visibilityTime: 3000, autoHide: true, topOffset: 30, bottomOffset: 40 });
                }
                setModalVisible(false);
                setTitle("");
                setArtist("");
                setSongId(0);
                getSongsCount();
                getSongs(from, to);
            }).catch(error => {
                console.error(error);
            });
    }

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, songsCount);
    React.useEffect(() => {
        getSongs(from, to);
    }, [to, titleSort, artistSort, searchQuery]);
    React.useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);
    return (
        <ScrollView>
            <View style={[Styles.container]}>
                <View style={[Styles.toolContainer]}>
                    <Pressable style={Styles.toolButton}>
                        <Text style={{color: 'white', fontWeight: 500}} onPress={()=>addHandler()}>Add</Text>
                    </Pressable>
                    <View>
                        <Text>Request</Text>
                        <Switch
                            trackColor={{false: '#767577', true: '#81b0ff'}}
                            thumbColor={isEnabledRequest ? '#f5dd4b' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isEnabledRequest}
                        />
                    </View>
                </View>
                <Searchbar
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                />
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title sortDirection={titleSort} onPress={titleSortHandler}>Title</DataTable.Title>
                        <DataTable.Title sortDirection={artistSort} onPress={artistSortHandler}>Artist</DataTable.Title>
                        <DataTable.Title>Request</DataTable.Title>
                    </DataTable.Header>

                    {songsCount>0 && songs.map((item) => (
                        <DataTable.Row key={`mng`+item.id}>
                            <DataTable.Cell>{item.title}</DataTable.Cell>
                            <DataTable.Cell>{item.artist}</DataTable.Cell>
                            <DataTable.Cell>
                                <Pressable style={Styles.button} onPress={()=>deleteHandler(item.id)}>
                                    <MaterialIcons name="delete-forever" size={18} color="white" />
                                </Pressable>
                                -
                                <Pressable style={Styles.button} onPress={()=>editHandler(item)}>
                                    <FontAwesome5 name="edit" size={18} color="white" />
                                </Pressable>
                            </DataTable.Cell>
                        </DataTable.Row>
                    ))}

                    <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.ceil(songsCount / itemsPerPage)}
                        onPageChange={(page) => setPage(page)}
                        label={`${from + 1}-${to} of ${songsCount}`}
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
                    <Text>Add/Edit Song</Text>
                    <View style={[Styles.row]}>
                        <Text>Title</Text>
                        <TextInput style={[Styles.textInput]} value={title} onChangeText={setTitleHandler} />
                    </View>
                    <View style={[Styles.row]}>
                        <Text>Artist</Text>
                        <TextInput style={[Styles.textInput]} value={artist} onChangeText={setArtistHandler} />
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
    toolContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        elevation: 30,
        paddingVertical: 5,
    },
    btnGroupContainer: {
        flexDirection: 'row', 
        alignItems: 'center'
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
    toolButton: {
        width: '30%',
        paddingVertical: 5,
        paddingHorizontal: 5,
        alignItems: 'center',
        backgroundColor: '#3b71ca',
        borderRadius: 5,
        marginTop: 20,
        marginLeft: 5,
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

export default SongManager;