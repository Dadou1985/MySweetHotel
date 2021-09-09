import React, {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar } from "react-native-paper"
import moment from 'moment'
import 'moment/locale/fr';
import { auth } from "../../firebase"

const ChatMessage = ({author, photo, text, translation, markup}) => {
    const [user, setUser] = useState(auth.currentUser)

    if(author === user.displayName){
        if(moment(markup).format('L') === moment(new Date()).format('L')) {
           return <View style={{
                color: "white",
                alignSelf: 'flex-end',
                alignItems: "flex-end",
                borderRadius: 20,
                marginRight: 15,
                marginBottom: 5,
                maxWidth: "80%",
                position: "relative"
            }}>
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
                backgroundColor: "lightblue",
                borderRadius: 10,
                width: "100%"
                }}>
                    <Text style={{marginBottom: 5}}>{translation || text}</Text>
                    <Text style={styles.time}>{moment(markup).startOf('hour').fromNow()}</Text>
                </View>
            </View>
        }else{
            return <View style={{
                color: "white",
                alignSelf: 'flex-end',
                alignItems: "flex-end",
                marginRight: 15,
                marginBottom: 5,
                maxWidth: "80%",
                position: "relative"
            }}>
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
                    <Text style={styles.time}>{moment(markup).startOf('hour').fromNow()}</Text>
                </View>
            </View>
        }
    }else{
        if(moment(markup).format('L') === moment(new Date()).format('L')) {
            return <View style={{
                color: "white",
                alignSelf: 'flex-start',
                alignItems: "flex-start",
                marginLeft: 15,
                marginBottom: 5,
                maxWidth: "80%",
                position: "relative"
            }}>
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
                    backgroundColor: "purple",
                    borderRadius: 10,
                    width: "100%"
                }}>
                    <Text style={{marginBottom: 5}}>{translation ? translation : text}</Text>
                    <Text style={styles.time}>{moment(markup).startOf('hour').fromNow()}</Text>
                </View>
            </View>
        }else{
            return <View style={{
                color: "white",
                alignSelf: 'flex-start',
                alignItems: "flex-start",
                marginLeft: 15,
                marginBottom: 20,
                maxWidth: "80%",
                position: "relative",
            }}>
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
                    <Text style={{marginBottom: 5}}>{translation ? translation : text}</Text>
                    <Text style={styles.time}>{moment(markup).startOf('hour').fromNow()}</Text>
                </View>
            </View>
        }
    }
}

export default ChatMessage

const styles = StyleSheet.create({
    time: {
        color: "black",
        fontSize: 10,
        flexDirection: "row",
        justifyContent: "flex-end"
    }
})
