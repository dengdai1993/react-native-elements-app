import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    FlatList,
    Animated,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput
} from 'react-native';
import {scaleSize, SCREEN_WIDTH, sp, SCREEN_HEIGHT} from "../utils/DimensionUtil";

import ListsScreen1 from './lists/screen1';
import ListsScreen2 from './lists/screen2';
import ListsScreen3 from './lists/screen3';
import ListsScreen4 from './lists/screen4';
import constants from "../config/constants";
import {Button, Divider, SearchBar, Text, Overlay, Tooltip, ButtonGroup} from "react-native-elements";
import Dialog from "../components/Dialog";

export default class Lists extends Component {

    state = {
        shops: [],
        onlyUnProcess: 0,
        search: '',
        hiddenModifyModal: true,
        typeIndex: 0,
    };

    componentDidMount() {
        this.getShopList();
    }

    getShopList = () => {
        let body = "token=" + constants.token + "&onlyUnProcess=" + this.state.onlyUnProcess + "&key=" + this.state.search;
        fetch(constants.host + constants.workspace + 'api/getShopList.php', {
            method: 'POST',
            mode: "cors",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body
        }).then((response) => response.json()).then(
            (responseJson) => {
                if (responseJson.code != 0) {
                    alert(responseJson.msg)
                    return
                }
                let typeNames = [];
                for (var i = 0; i < responseJson.data.shopTypes.length; i++) {
                    typeNames.push(responseJson.data.shopTypes[i].typeName);
                }
                let typeIds = [];
                for (var i = 0; i < responseJson.data.shopTypes.length; i++) {
                    typeIds.push(responseJson.data.shopTypes[i].typeId);
                }
                this.setState({
                    shops: responseJson.data.shops,
                    shopTypes: responseJson.data.shopTypes,
                    typeNames: typeNames,
                    typeIds: typeIds,
                })
            })
            .catch((error) => {
                alert(JSON.stringify(error));
            });
    };

    updateSearch = search => {
        let that = this;
        console.log(this.state.search)
        this.setState({search: search}, () => {
            console.log(this.state.search)
            if (that.state.search == '') {
                that.getShopList();
            }
        });
    };

    ItemSeparatorComponent = () => (
        <View style={styles.separatorComponent}>
            <Divider style={styles.separator}/>
        </View>
    );

    _keyExtractor = (item, index) => item.shopId;

    showDialog = (item) => {
        let that = this;
        item.tags = item.tags.replace(';', '\n')
        let typeIndex = 0;
        for (var i = 0; i < that.state.shopTypes.length; i++) {
            if (that.state.shopTypes[i].typeId == item.shopType) {
                typeIndex = i;
            }
        }
        that.setState({
            hiddenModifyModal: false,
            currentItem: item,
            typeIndex: typeIndex,
        });
        that.state.dialog.show();
    };

    dismissDialog = () => {
        let that = this;
        that.setState({
            hiddenModifyModal: true,
            currentItem: null
        });
        that.state.dialog.dismiss();
    };

    saveInfo = () => {
        let that = this;
        if (!this.state.currentItem) {
            alert("保存失败");
            return;
        }
        let item = this.state.currentItem;
        item.tags = item.tags.replace('\n', ';')
        let typeId = this.state.typeIds[this.state.typeIndex];
        let body = "shopId=" + item.shopId + "&tags=" + item.tags + "&comment=" + item.comment + "&shopType=" + typeId + "&token=" + constants.token;
        fetch(constants.host + constants.workspace + 'api/saveShopInfo.php', {
            method: 'POST',
            mode: "cors",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body
        }).then((response) => response.json()).then(
            (responseJson) => {
                that.setState({
                    hiddenModifyModal: true,
                    currentItem: null
                });
                that.state.dialog.dismiss();
                that.getShopList();
                alert(responseJson.msg);
            })
            .catch((error) => {
                alert("服务器开小差了");
            });
    };

    commentUpdate = comment => {
        if (this.state.currentItem) {
            this.state.currentItem.comment = comment;
            this.setState({currentItem: this.state.currentItem}, () => {
            });
        }
    };

    tagsUpdate = tags => {
        if (this.state.currentItem) {
            this.state.currentItem.tags = tags;
            this.setState({currentItem: this.state.currentItem}, () => {
            });
        }
    };

    render() {
        let that = this;
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row', backgroundColor: '#f5f5f5'}}>
                    <View style={{flex: 1, justifyContent: 'center', backgroundColor: "#f5f5f5"}}>
                        <SearchBar
                            placeholder="搜索店家名"
                            platform="ios"
                            cancelButtonTitle={""}
                            showCancel={false}
                            onChangeText={this.updateSearch}
                            onClear={this.getShopList}
                            value={that.state.search}
                        />
                    </View>
                    <View style={{justifyContent: 'center'}}>
                        <Button
                            style={{marginRight: 13.33}}
                            title="搜索"
                            loading={false}
                            loadingProps={{size: 'small', color: 'white'}}
                            buttonStyle={{
                                backgroundColor: 'rgba(111, 202, 186, 1)',
                                borderRadius: 5,
                            }}
                            titleStyle={{fontWeight: 'bold', fontSize: 18}}
                            onPress={() => this.getShopList()}
                            underlayColor="transparent"
                        />
                    </View>
                </View>
                <Button
                    title={`新增店铺`}
                    containerStyle={{marginVertical: 10, marginHorizontal: 10}}
                />
                <FlatList
                    style={{flex: 1}}
                    data={that.state.shops}
                    keyExtractor={that._keyExtractor}
                    renderItem={({item}) =>
                        <TouchableWithoutFeedback
                            onPress={() => that.showDialog(item)}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    flex: 1,
                                    marginVertical: 10,
                                    marginVertical: 5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <Text style={{
                                    flex: 1,
                                    color: 'green',
                                    fontFamily: 'regular',
                                    fontSize: scaleSize(30),
                                    marginHorizontal: 10
                                }}>{item.shopName}</Text>
                                <View style={{backgroundColor: '#2986b9', height: 20, width: 2}}/>
                                <Text style={{
                                    flex: 1, marginHorizontal: 10, fontFamily: 'regular',
                                    fontSize: scaleSize(20)
                                }}>{item.comment}</Text>
                                <View style={{backgroundColor: '#2986b9', height: 20, width: 2}}/>
                                <Text style={{
                                    flex: 1, marginHorizontal: 10, fontFamily: 'regular',
                                    fontSize: scaleSize(20)
                                }}>{item.tags.replace('\n', ';')}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    }
                    ItemSeparatorComponent={this.ItemSeparatorComponent}
                />

                <Dialog
                    ref={component => {
                        that.state.dialog = component;
                    }}
                    outSideDisappear={true} //是否点击半透明区域让对话框消失;
                    contentStyle={styles.dialog}
                    position="center" // 对话框内容区域布局对齐方式:"center","top","bottom", 默认值是:"center"
                    height={SCREEN_HEIGHT * 0.6}
                    isHidden={that.state.hiddenModifyModal} // 对话框默认是否隐藏,默认为false
                    isStatusBarHidden={true} //状态栏是否处于显示状态，默认为false;
                    margin={10}>
                    <Text style={styles.title}>店铺修改</Text>

                    <Text style={styles.content}>店铺名称：{
                        that.state.currentItem ? that.state.currentItem.shopName : ''
                    }</Text>
                    <Text style={styles.content}>店铺地址：{
                        that.state.currentItem ? that.state.currentItem.shopUrl : ''
                    }</Text>
                    <Text style={styles.content}>店铺类型</Text>
                    <ButtonGroup
                        buttons={that.state.typeNames}
                        selectedIndex={this.state.typeIndex}
                        onPress={typeIndex => {
                            this.setState({typeIndex});
                        }}
                        containerStyle={{marginBottom: 20}}
                    />
                    <Text style={styles.content}>店铺简介：</Text>
                    <TextInput
                        style={{
                            width: SCREEN_WIDTH - 40, height: 50, marginLeft: 10, borderWidth: 0.5,
                            borderColor: 'rgba(222, 223, 226, 1)', marginVertical: 10
                        }}
                        multiline={true}
                        value={that.state.currentItem ? that.state.currentItem.comment : ''}
                        onChangeText={that.commentUpdate}
                    ></TextInput>
                    <Text style={styles.content}>店铺标签：(一行一个，冒号后为点赞数，可不填) 老店:10</Text>
                    <TextInput
                        style={{
                            width: SCREEN_WIDTH - 40, height: 80, marginLeft: 10, borderWidth: 0.5,
                            borderColor: 'rgba(222, 223, 226, 1)', marginVertical: 10
                        }}
                        multiline={true}
                        value={that.state.currentItem ? that.state.currentItem.tags : ''}
                        onChangeText={that.tagsUpdate}
                    ></TextInput>
                    <View style={styles.dialogContent}>
                        <View style={{flex: 1}}>
                            <Button
                                title="取消"
                                style={{marginHorizontal: '10%'}}
                                buttonStyle={{flex: 1, backgroundColor: 'rgba(127, 220, 103, 1)'}}
                                containerStyle={{height: 40}}
                                titleStyle={{color: 'white', marginHorizontal: 20}}
                                onPress={that.dismissDialog}
                            />
                        </View>
                        <View style={{flex: 1}}>
                            <Button
                                title="保存"
                                style={{marginHorizontal: '10%'}}
                                buttonStyle={{flex: 1, backgroundColor: 'rgba(214, 61, 57, 1)'}}
                                containerStyle={{height: 40}}
                                titleStyle={{color: 'white', marginHorizontal: 20}}
                                onPress={that.saveInfo}
                            />
                        </View>
                    </View>

                </Dialog>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dialog: {
        justifyContent: "flex-start",
        backgroundColor: "#ffffff",
        borderRadius: 5,
    },

    title: {
        color: "#000000",
        alignSelf: "center",
        fontSize: 18,
        height: 25,
        marginTop: 10,
    },

    content: {
        color: "#000000",
        alignSelf: "flex-start",
        fontSize: 17,
        marginLeft: 10,
        textAlignVertical: "center"
    },

    cancel: {
        color: "#000000",
        alignSelf: "center",
        fontSize: 18,
        height: 25,
        marginTop: 10,
        marginRight: 50
    },

    ok: {
        color: "#000000",
        alignSelf: "center",
        fontSize: 18,
        height: 25,
        marginTop: 10,
        marginLeft: 50
    },

    dialogContent: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15
    }
});
