import React, {useState, memo} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar } from "react-native-paper"
import moment from 'moment'
import 'moment/locale/fr';
import { auth } from "../../firebase"
import globalStyle from '../utils/globalStyle';

const ChatMessage = ({author, photo, text, translation, markup}) => {
    const [user, setUser] = useState(auth.currentUser)

    if(author === user.displayName){
        if(moment(markup).format('L') === moment(new Date()).format('L')) {
           return <View style={[{
                color: "white",
                alignSelf: 'flex-end',
                alignItems: "flex-end",
                borderRadius: 20,
                marginRight: 15,
                marginBottom: 5,
                maxWidth: "80%",
                position: "relative",
                minWidth: 70
            }, globalStyle.chatMessageShadow]}>
                <Avatar.Image
                position="absolute"
                rounded
                size={30}
                source={{ uri: photo}}
                style={{
                    right: -5,
                    bottom: -15,
                    zIndex: 5,
                }} />
                <View style={{
                padding: 15,
                backgroundColor: "#B8860B",
                borderRadius: 10,
                width: "100%"
                }}>
                    <Text style={{marginBottom: 5}}>{translation || text}</Text>
                    <Text style={styles.time}>{moment(markup).format('LT')}</Text>
                </View>
            </View>
        }else{
            return <View style={[{
                color: "white",
                alignSelf: 'flex-end',
                alignItems: "flex-end",
                marginRight: 15,
                marginBottom: 5,
                maxWidth: "80%",
                position: "relative",
                minWidth: 70
            }, globalStyle.chatMessageShadow]}>
                <Avatar.Image
                position="absolute"
                rounded
                size={30}
                source={{ uri: photo}}
                style={{
                    right: -5,
                    bottom: -15,
                    zIndex: 5,
                }} />
                <View style={{
                padding: 15,
                backgroundColor: "#ECECEC",
                borderRadius: 10,
                width: "100%"
                }}>
                    <Text style={{marginBottom: 5}}>{translation || text}</Text>
                    <Text style={styles.time2}>{moment(markup).format('LT')}</Text>
                </View>
            </View>
        }
    }else{
        if(moment(markup).format('L') === moment(new Date()).format('L')) {
            return <View style={[{
                color: "white",
                alignSelf: 'flex-start',
                alignItems: "flex-start",
                marginLeft: 15,
                marginBottom: 5,
                maxWidth: "80%",
                position: "relative",
                minWidth: 70
            }, globalStyle.chatMessageShadow]}>
                <Avatar.Image
                position="absolute"
                rounded
                size={30}
                source={{ uri: "https://cdn.wallpapersafari.com/73/48/aVIBA4.jpg"}}
                style={{
                    left: -5,
                    bottom: -15,
                    zIndex: 5,
                }} />
                <View style={{
                    padding: 15,
                    backgroundColor: "rgb(123, 22, 22)",
                    borderRadius: 10,
                    width: "100%"
                }}>
                    <Text style={{marginBottom: 5, color: "white"}}>{translation ? translation : text}</Text>
                    <Text style={styles.time2}>{moment(markup).format('LT')}</Text>
                </View>
            </View>
        }else{
            return <View style={[{
                color: "white",
                alignSelf: 'flex-start',
                alignItems: "flex-start",
                marginLeft: 15,
                marginBottom: 20,
                maxWidth: "80%",
                position: "relative",
                minWidth: 70
            }, globalStyle.chatMessageShadow]}>
                <Avatar.Image
                position="absolute"
                rounded
                size={30}
                source={{ uri: "https://cdn.wallpapersafari.com/73/48/aVIBA4.jpg"}}
                style={{
                    left: -5,
                    bottom: -15,
                    zIndex: 5,
                }} />
                <View style={{
                padding: 15,
                backgroundColor: "gray",
                borderRadius: 10,
                width: "100%"
                }}>
                    <Text style={{marginBottom: 5, color: "white"}}>{translation ? translation : text}</Text>
                    <Text style={styles.time2}>{moment(markup).format('LT')}</Text>
                </View>
            </View>
        }
    }
}

export default memo(ChatMessage)

const styles = StyleSheet.create({
    time: {
        color: "lightgrey",
        fontSize: 10,
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    time2: {
        color: "gray",
        fontSize: 10,
        flexDirection: "row",
        justifyContent: "flex-end"
    }
})
