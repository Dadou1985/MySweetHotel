import React, { useState, memo } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { db } from "../../../firebase"
import { Button } from 'react-native-elements';
import { showMessage } from "react-native-flash-message";
import { useTranslation } from 'react-i18next'
import ModalWeb from 'modal-enhanced-react-native-web';
import moment from 'moment'
import 'moment/locale/fr';

const ModalConfirmUpdateCheckout = ({user, userDB, date, handleLoadUserDB, updateCheckout, setUpdateCheckout}) => {
    const { t } = useTranslation()

    const handleCheckoutDateChange = async() => {
        await db.collection('guestUsers')
        .doc(userDB.userId)
        .update({
          checkoutDate: moment(date.timestamp).format('L')
        })
      
        showMessage({
            message: t('message_actualisation_checkout'),
            type: "success",
        })
      
        return handleLoadUserDB()     
      }
      
    const handleChangeCheckoutDateChat = () => {
      return db.collection('hotels')
          .doc(userDB.hotelId)
          .collection('chat')
          .doc(userDB.username)
          .update({
            checkoutDate: moment(date.timestamp).format('L') 
        })  
    }

  return (
    <ModalWeb 
        animationType="slide" 
        style={styles.roomBoxView}
        transparent={true}  
        isVisible={updateCheckout} 
        onBackdropPress={() => setUpdateCheckout(false)}>
        <View style={styles.modalRoom}>
        <Text style={{
                width: "100%", 
                marginBottom: 10, 
                fontSize: 15,
                paddingTop: 10, 
                paddingBottom: 10,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                textAlign: "center", 
                backgroundColor: "#B8860B"
                }}>{t('message_confirmation_actualisation_checkout')}</Text>
        <Button title={t('confirmer')} 
        containerStyle={{width: "90%", borderRadius: 20, marginBottom: 15, marginTop: 15}} 
        buttonStyle={{backgroundColor: "#B8860B"}} 
        titleStyle={{color: "black"}}
        onPress={() => {
            handleCheckoutDateChange()
            handleChangeCheckoutDateChat()
            return setUpdateCheckout(false)
        }} />
        </View>
    </ModalWeb>
  )
}

export default memo(ModalConfirmUpdateCheckout)

const styles = StyleSheet.create({
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