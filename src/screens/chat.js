import React, { useLayoutEffect, useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, View, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import { Avatar } from "react-native-elements"
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Entypo } from '@expo/vector-icons';
import { UserContext } from '../components/userContext'
import { auth, db } from "../../firebase"
import moment from 'moment'
import 'moment/locale/fr';
import ChatMessage from '../components/chatMessage'
import { getPendingResultAsync } from 'expo-image-picker';
import { YellowBox } from 'react-native';
import _ from 'lodash';
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { AntDesign } from '@expo/vector-icons';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

const Chat = ({ navigation }) => {
    const [input, setInput] = useState("")
    const [user, setUser] = useState(auth.currentUser)
    const {userDB, setUserDB} = useContext(UserContext)
    const [messages, setMessages] = useState([])
    const [chatRoom, setChatRoom] = useState(null)

    const { t } = useTranslation()

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Chat",
            headerBackTitleVisible: false,
            headerTitleAlign: "right",
            headerTitle: () =>(
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Entypo name="chat" size={24} color="black" />            
                    <Text style={{ color: "black", marginLeft: 10, fontWeight : "bold", fontSize: 20}}>Chat {t('reception')}</Text>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity onPress={() => {
                handleUpdateHotelResponse()
                navigation.navigate("My Sweet Hotel")}}>
                    <AntDesign name="left" size={24} color="black" style={{marginLeft: 5}} />
                </TouchableOpacity>
            )
        })
    }, [navigation])

    useEffect(() => {
        const getMessages = () => {
            return db.collection("hotel")
            .doc(userDB.hotelId)
            .collection('chat')
            .doc(user.displayName)
            .collection("chatRoom")
            .orderBy("markup", "desc")
        }

        let unsubscribe = getMessages().onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            console.log(snapInfo)
            setMessages(snapInfo)
        });
        return unsubscribe
    }, [])

    const handleUpdateHotelResponse = () => {
        return db.collection("hotel")
            .doc(userDB.hotelId)
            .collection('chat')
            .doc(user.displayName)
            .update({
                hotelResponding: false
        })
    }

    const getChatRoom = () => {
        return db.collection('hotel')
        .doc(userDB.hotelId)
        .collection('chat')
        .doc(user.displayName)
        .get()
        .then((doc) => {
            if (doc.exists) {
            setChatRoom(doc.data())
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
    }

    const createRoomnameSubmit = () => {
        return db.collection('hotel')
          .doc(userDB.hotelId)
          .collection('chat')
          .doc(user.displayName)
          .set({
            title: user.displayName,
            room: userDB.room,
            userId: user.uid,
            markup: Date.now(),
            status: true, 
            guestLanguage: userDB.language
        })      
      }

    const updateRoomnameSubmit = () => {
        return db.collection('hotel')
          .doc(userDB.hotelId)
          .collection('chat')
          .doc(user.displayName)
          .update({
            status: true,
            markup: Date.now()
        })      
      }

    const sendMessage = () => {
        Keyboard.dismiss()
        setInput("")

        return db.collection("hotel")
        .doc(userDB.hotelId)
        .collection('chat')
        .doc(user.displayName)
        .collection("chatRoom")
        .add({
            author: user.displayName,
            date: new Date(),
            room: userDB.room,
            email: user.email,
            photo: user.photoURL,
            text: input,
            markup: Date.now(),
            title: "guest"
        }).then(function(docRef){
            console.log(docRef.id)
          }).catch(function(error) {
            console.error(error)
          })
    }

    console.log(chatRoom)

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white"}}>
            <StatusBar style="light" />
            <KeyboardAvoidingView
             behavior={Platform.OS === "ios" ? "padding" : "height"}
             style={styles.container}
             keyboardVerticalOffset={90}>

                <TouchableWithoutFeedback onPress={Keyboard.dismiss} />

                 <>
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    {messages.map(message => {
                        let language = userDB.language
                        const renderSwitch = () => {
                            switch(language) {
                                case 'en':
                                    return <ChatMessage 
                                        author={message.author}
                                        photo={message.photo}
                                        translation={message.translated.en}
                                        markup={message.markup}
                                    />
                                case 'de':
                                    return <ChatMessage 
                                        author={message.author}
                                        photo={message.photo}
                                        translation={message.translated.de}
                                        markup={message.markup}
                                />
                                case 'it':
                                return <ChatMessage 
                                    author={message.author}
                                    photo={message.photo}
                                    translation={message.translated.it}
                                    markup={message.markup}
                                />
                                case 'pt':
                                return <ChatMessage 
                                    author={message.author}
                                    photo={message.photo}
                                    translation={message.translated.pt}
                                    markup={message.markup}
                                />
                                case 'es':
                                return <ChatMessage 
                                    author={message.author}
                                    photo={message.photo}
                                    translation={message.translated.es}
                                    markup={message.markup}
                                />
                                case 'fr':
                                return <ChatMessage 
                                    author={message.author}
                                    photo={message.photo}
                                    translation={message.translated.fr}
                                    markup={message.markup}
                                />
                                default:
                                return <ChatMessage 
                                    author={message.author}
                                    photo={message.photo}
                                    translation={message.translated.fr}
                                    markup={message.markup}
                                />
                            }
                        }

                        if(userDB.localLanguage === userDB.language) {
                            return <ChatMessage 
                                    author={message.author}
                                    photo={message.photo}
                                    text={message.text}
                                    markup={message.markup}
                                />
                        }

                        if(message.translated){
                            return renderSwitch()
                        }
                        
                    })}
                </ScrollView>
                <View style={styles.footer}>
                    <TextInput 
                        value={input}
                        onChangeText={(text) => setInput(text)}
                        onSubmitEditing={sendMessage}
                        placeholder={t('envoi_message')}
                        style={styles.input}
                    />
                    <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={async() => {
                        await getChatRoom()
                        if(chatRoom !== null) {
                            return updateRoomnameSubmit()
                            .then(sendMessage())
                        }else{
                            return createRoomnameSubmit()
                            .then(sendMessage())
                        }
                        }}>
                        <FontAwesome name="send" size={24} color="black" />
                    </TouchableOpacity>

                </View>
                </>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Chat

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    input: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        borderColor: "transparent",
        backgroundColor: "#ECECEC",
        borderWidth: 1,
        padding: 10,
        color: "grey",
        borderRadius: 30
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 15
    }
})

