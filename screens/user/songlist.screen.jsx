import React, { useRef, useState, useEffect } from 'react';
import {View, ScrollView, Text, Button, TextInput, Pressable, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, FlatList } from 'react-native';
import { DataTable, Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import axios from '../../config/server.config';
import Loading from '../../components/loading';
import AnimatedModal from '../../components/animatedModal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const {width, height} = Dimensions.get('window');
const INITIAL_DATAS_COUNT = 10;
const FETCH_DATAS_COUNT = 10;

const SongList = () => {
    const [page, setPage] = useState(1);
    const [numberOfItemsPerPageList] = useState([15, 50, 100]);
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
    const [singer, setSinger] = useState("");
    const [dj, setDj] = useState("");
    const [requestSongId, setRequestSongId] = useState(0);

    useEffect(() => {
        getInitSongs(0, INITIAL_DATAS_COUNT, page);
    }, [searchQuery]);
    // React.useEffect(() => {
    //     getSongs(from, to);
    // }, [to, titleSort, artistSort, searchQuery]);
    // React.useEffect(() => {
    //     setPage(0);
    // }, [itemsPerPage]);
    const getInitSongs = async (length, count, page) => {
        if (!loading) setLoading(true);
        await axios
            .get('/songmng/get-loadmore?searchQuery='+searchQuery+'&page='+page+'&limit='+count+'&from='+length)
            .then(async function (res) {
                let songsData = res.data;
                await setSongs(songsData);
                await setPage((prevPage) => prevPage + 1);
                await setLoading(false);
                // setCountSongs(songsData);
            }).catch(error => {
                console.error(error);
            });
    }
    const getSongs = async (length, count, page) => {
        if (!loading) setLoading(true);
        await axios
            .get('/songmng/get-loadmore?searchQuery='+searchQuery+'&page='+page+'&limit='+count+'&from='+length)
            .then(async function (res) {
                let songsData = res.data;
                await setSongs((prevSongs) => [...prevSongs, ...songsData]);
                await setPage((prevPage) => prevPage + 1);
                await setLoading(false);
                // setCountSongs(songsData);
            }).catch(error => {
                console.error(error);
            });
    }
    // const getSongs = async (from, to) => {
    //     if (to > 0 && from < to) {
    //         setLoading(true);
    //         await axios
    //             .get('/songmng/get?from='+from+'&to='+to+'&titleSort='+titleSort+'&artistSort='+artistSort+'&sortFlag='+sortFlag+'&searchQuery='+searchQuery)
    //             .then(function (res) {
    //                 setLoading(false);
    //                 let songsData = res.data;
    //                 setSongs(songsData);
    //             }).catch(error => {
    //                 console.error(error);
    //             });
    //     }
    // }
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
    const setSingerHandler = (event) => {
        setSinger(event);
    }
    const setDjHandler = (event) => {
        setDj(event);
    }
    
    const onChangeSearch = query => {
        setSearchQuery(query);
    }
    const requestHandler = (param) => {
        console.log(param);
        setRequestSongId(param.id);
        setTitle(param.title);
        setArtist(param.artist);
        setModalVisible(true);
    }
    const closeModal = () => {
        setModalVisible(false);
    };
    const submitHandler = async () => {
        console.log("submit");
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
                setSinger('');
                setDj('');
                setModalVisible(false);
            }).catch(error => {
                console.error(error);
            });
    }

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, songsCount);
    
    return (
        // <ScrollView>
            <View style={[Styles.container]}>
                <Searchbar
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                />
                <SafeAreaView style={{ marginTop: 10 }}>
                    <FlatList
                        data={songs}
                        keyExtractor={(item, index) => index.toString()}
                        onEndReached={() => getSongs(songs.length, FETCH_DATAS_COUNT, page)}
                        onEndReachedThreshold={0.5}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                borderStyle: 'solid',
                                borderTopWidth: 0.5,
                                padding: 8,
                                width: width*0.9,
                                height: 80,
                                flex: 1,
                                flexDirection: 'row',
                                // justifyContent: 'center',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                }}
                            >
                                <View style={{ width: "69%" }}>
                                    <Text style={{fontWeight: 600, fontSize: width/23}}>{item.title}</Text>
                                    <Text style={[Styles.textStyle]}>{item.artist}</Text>
                                </View>
                                <Pressable style={Styles.reqButton} onPress={() => requestHandler(item)}>
                                    <Text style={{color: 'white', fontWeight: 500, fontSize: width/24}}>Request</Text>
                                </Pressable>
                            </View>
                            )
                        }
                    />
                </SafeAreaView>
                {/* <DataTable>
                    <DataTable.Header>
                        <DataTable.Title sortDirection={titleSort} onPress={titleSortHandler}><Text style={[Styles.textStyle]}>Title</Text></DataTable.Title>
                        <DataTable.Title sortDirection={artistSort} onPress={artistSortHandler}><Text style={[Styles.textStyle]}>Artist</Text></DataTable.Title>
                        <DataTable.Title><Text style={[Styles.textStyle]}>Request</Text></DataTable.Title>
                    </DataTable.Header>

                    {songsCount>0 && songs.map((item) => (
                        <DataTable.Row key={`list`+item.id}>
                            <DataTable.Cell style={Styles.cell} numberOfLines={2}><Text style={[Styles.textStyle]}>{item.title}</Text></DataTable.Cell>
                            <DataTable.Cell style={Styles.cell} numberOfLines={2}><Text style={[Styles.textStyle]}>{item.artist}</Text></DataTable.Cell>
                            <DataTable.Cell style={Styles.cell}>
                                <Pressable style={Styles.button} onPress={() => requestHandler(item)}>
                                    <Text style={{color: 'white', fontWeight: 500, fontSize: width/24}}>Request</Text>
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
                </DataTable> */}
                <AnimatedModal
                    visible={modalVisible}
                    animationType="fade"
                    onClose={closeModal}
                >
                    <Text style={[Styles.textStyle]}>Request Song</Text>
                    <View style={[Styles.row]}>
                        <Text style={[Styles.textStyle]}>Title</Text>
                        <TextInput style={[Styles.textInput]} value={title} editable={false} selectTextOnFocus={false} onChangeText={setTitleHandler} />
                    </View>
                    <View style={[Styles.row]}>
                        <Text style={[Styles.textStyle]}>Artist</Text>
                        <TextInput style={[Styles.textInput]} value={artist} editable={false} selectTextOnFocus={false} onChangeText={setArtistHandler} />
                    </View>
                    <View style={[Styles.row]}>
                        <Text style={[Styles.textStyle]}>Who is singing?</Text>
                        <TextInput style={[Styles.textInput]} value={singer} onChangeText={setSingerHandler} />
                    </View>
                    <View style={[Styles.row]}>
                        <Text style={[Styles.textStyle]}>Message The DJ</Text>
                        <TextInput style={[Styles.textInput]} value={dj} onChangeText={setDjHandler} />
                    </View>
                    <Pressable style={Styles.button} onPress={() => submitHandler()}>
                        <Text style={{color: 'white', fontWeight: 500, fontSize: width/24}}>Submit</Text>
                    </Pressable>
                    <Loading loading={loading} />
                </AnimatedModal>
                <Toast />
                <Loading loading={loading} />
            </View>
        // </ScrollView>
    )
}
const Styles = new StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        marginBottom: 50,
        paddingHorizontal: width * 0.05
    },
    row: {
        marginTop: 10,
        alignItems: 'flex-start',
        width:' 100%'
    },
    cell: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        height: 'auto',
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
    reqButton: {
        width: '30%',
        paddingVertical: 5,
        paddingHorizontal: 5,
        alignItems: 'center',
        backgroundColor: '#3b71ca',
        borderRadius: 5,
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
});

export default SongList;