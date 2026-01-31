import React, { useState, memo } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import {  db } from "../../../firebase"
import { Button, Input } from 'react-native-elements';
import { showMessage } from "react-native-flash-message";
import { useTranslation } from 'react-i18next'
import ModalWeb from 'modal-enhanced-react-native-web';

const ModalUpdateRoom = ({user, userDB, handleLoadUserDB, updateRoom, setUpdateRoom}) => {
    const [room, setRoom] = useState(undefined)
    const { t } = useTranslation()


const handleChangeRoom = async() => {
    await db.collection('guestUsers')
      .doc(user.uid)
      .update({
        room: room,
      })
  
    showMessage({
      message: t('message_actualisation_chbre'),
      type: "success"
    })
  
    return handleLoadUserDB()
    .then(() => {
      setRoom(null)
      setUpdateRoom(false)
    })
}

const handleChangeRoomChat = () => {
return db.collection('hotels')
    .doc(userDB.hotelId)
    .collection('chat')
    .doc(userDB.username)
    .update({
        room: room 
    })  
}

  return (
    <ModalWeb 
        animationType="slide"
        style={styles.roomBoxView}                
        transparent={true} 
        isVisible={updateRoom} 
        onBackdropPress={() => {
        setUpdateRoom(false)
        setRoom(null)}}>
        <View style={styles.modalRoom}>
        <Text style={{
                width: "100%", 
                marginBottom: 10, 
                fontSize: 20,
                paddingTop: 10, 
                paddingBottom: 10,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                textAlign: "center", 
                backgroundColor: "#B8860B"
                }}>{t('actualisation_chbre')}</Text>
        <View style={styles.inputContainer}>
            <Input placeholder={t('num_chbre')} inputContainerStyle={{borderBottomWidth: 0}} type="number" value={room} style={{textAlign: "center", outline: "none", borderBottomColor: "#B8860B", borderBottomWidth: 1}} 
            onChangeText={(text) => setRoom(text)} />
        </View>
        <Button 
        title={t('actualiser')} 
        containerStyle={{width: "90%", borderRadius: 20, marginBottom: 15, marginTop: 15}} 
        buttonStyle={{backgroundColor: "#B8860B"}} 
        titleStyle={{color: "black"}}
        onPress={() => {
            handleChangeRoom()
            handleChangeRoomChat()
            }} />
        </View>
    </ModalWeb>
  )
}

export default memo(ModalUpdateRoom)

const styles = StyleSheet.create({
    inputContainer: {
      width: 300,
      textAlign: "center"
    },
    
  roomBoxView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: "90%",
  },
  modalRoom: {
      backgroundColor: 'white',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      width: "100%",
      borderRadius: 5
  }
  })