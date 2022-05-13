import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next'
import ModalWeb from 'modal-enhanced-react-native-web';
import { pushNotificationSubscription } from '../../utils/pushNotificationSubscription';

const ModalChatPushNotification = ({user, navigation, handleLoadUserDB, showModalNotification, setShowModalNotification}) => {
    const { t } = useTranslation()

  return (
    <ModalWeb 
    animationType="slide"
    transparent={true}
    isVisible={showModalNotification} 
    style={styles.roomBoxView}
    onBackdropPress={() => {
    setShowModalNotification(false)
    pushNotificationSubscription(user.uid, navigation, handleLoadUserDB)}}>
        <View style={styles.modalRoom2}>
            <Text style={{
                width: "100%", 
                fontSize: 20,
                paddingBottom: 10,
                textAlign: "center",
                fontWeight: "bold",
                paddingTop: 10,
                }}><AntDesign name="infocirlce" size={15} color="black" style={{marginRight: 15}} />
                {t('chat_push_notification')}</Text>
                <Text style={{textAlign: "center", marginBottom: 10}}>{t('message_push_notification')}</Text>
        </View>
    </ModalWeb>
  )
}

export default ModalChatPushNotification

const styles = StyleSheet.create({
  roomBoxView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: "90%",
  },
  modalRoom2: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
  })