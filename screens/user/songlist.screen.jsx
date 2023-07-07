import React, { useRef, useState, useEffect } from 'react';
import {View, ScrollView, Text, Button, TextInput, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { DataTable } from 'react-native-paper';
const {width, height} = Dimensions.get('window');

const SongList = () => {
    const [page, setPage] = React.useState(0);
    const [numberOfItemsPerPageList] = React.useState([2, 3, 4]);
    const [itemsPerPage, onItemsPerPageChange] = React.useState(
        numberOfItemsPerPageList[0]
    );
    // useEffect(() => {
    //     get();
    // }, []);
    const [items] = React.useState([
        {
            key: 1,
            name: 'Cupcake',
            calories: 356,
            fat: 16,
        },
        {
            key: 2,
            name: 'Eclair',
            calories: 262,
            fat: 16,
        },
        {
            key: 3,
            name: 'Frozen yogurt',
            calories: 159,
            fat: 6,
        },
        {
            key: 4,
            name: 'Gingerbread',
            calories: 305,
            fat: 3.7,
        },
    ]);
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, items.length);

    React.useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    return (
        <ScrollView>
            <View style={[Styles.container]}>
                <View style={[Styles.row]}>
                    <Text>First Name</Text>
                    <TextInput style={[Styles.textInput]} placeholder="Enter your first name" />
                </View>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title sortDirection="descending">Title</DataTable.Title>
                        <DataTable.Title numeric>Artist</DataTable.Title>
                        <DataTable.Title numeric>Request</DataTable.Title>
                    </DataTable.Header>

                    {items.slice(from, to).map((item) => (
                        <DataTable.Row key={item.key}>
                            <DataTable.Cell>{item.name}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.calories}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.fat}</DataTable.Cell>
                        </DataTable.Row>
                    ))}

                    <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.ceil(items.length / itemsPerPage)}
                        onPageChange={(page) => setPage(page)}
                        label={`${from + 1}-${to} of ${items.length}`}
                        numberOfItemsPerPageList={numberOfItemsPerPageList}
                        numberOfItemsPerPage={itemsPerPage}
                        onItemsPerPageChange={onItemsPerPageChange}
                        showFastPaginationControls
                        selectPageDropdownLabel={'Rows per page'}
                    />
                </DataTable>
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

export default SongList;