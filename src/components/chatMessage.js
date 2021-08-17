import React, {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar } from "react-native-elements"
import moment from 'moment'
import 'moment/locale/fr';
import { auth } from "../../firebase"

const ChatMessage = ({author, photo, text, translation, markup}) => {
    const [user, setUser] = useState(auth.currentUser)

    if(author === user.displayName){
        if(moment(markup).format('L') === moment(new Date()).format('L')) {
           return <View style={{
                padding: 15,
                color: "white",
                backgroundColor: "lightblue",
                alignSelf: 'flex-end',
                borderRadius: 20,
                marginRight: 15,
                marginBottom: 20,
                maxWidth: "80%",
                position: "relative"
            }}>
                <Avatar
                position="absolute"
                rounded
                bottom={-15}
                right={-5}
                size={30}
                source={{ uri: photo}} />
                <Text>{translation || text}</Text>
                <Text style={styles.time}>{moment(markup).startOf('hour').fromNow()}</Text>
            </View>
        }else{
            return <View style={{
                padding: 15,
                backgroundColor: "#ECECEC",
                color: "white",
                alignSelf: 'flex-end',
                borderRadius: 20,
                marginRight: 15,
                marginBottom: 20,
                maxWidth: "80%",
                position: "relative"
            }}>
                <Avatar
                position="absolute"
                rounded
                bottom={-15}
                right={-5}
                size={30}
                source={{ uri: photo}} />
                <Text>{translation || text}</Text>
                <Text style={styles.time}>{moment(markup).startOf('hour').fromNow()}</Text>

            </View>
        }
    }else{
        if(moment(markup).format('L') === moment(new Date()).format('L')) {
            return <View style={{
                padding: 15,
                color: "white",
                backgroundColor: "purple",
                alignSelf: 'flex-start',
                borderRadius: 20,
                marginLeft: 15,
                marginBottom: 20,
                maxWidth: "80%",
                position: "relative"
            }}>
                <Avatar
                position="absolute"
                rounded
                bottom={-15}
                left={-5}
                size={30}
                source={{ uri: "https://cdn.wallpapersafari.com/73/48/aVIBA4.jpg"}} />
                <Text>{translation ? translation : text}</Text>
                <Text style={styles.time}>{moment(markup).startOf('hour').fromNow()}</Text>

            </View>
        }else{
            return <View style={{
                padding: 15,
                backgroundColor: "gray",
                color: "white",
                alignSelf: 'flex-start',
                borderRadius: 20,
                marginLeft: 15,
                marginBottom: 20,
                maxWidth: "80%",
                position: "relative",
            }}>
                <Avatar
                position="absolute"
                rounded
                bottom={-15}
                left={-5}
                size={30}
                source={{ uri: "https://cdn.wallpapersafari.com/73/48/aVIBA4.jpg"}} />
                <Text>{translation ? translation : text}</Text>
                <Text style={styles.time}>{moment(markup).startOf('hour').fromNow()}</Text>

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
