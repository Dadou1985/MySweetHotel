import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { storage } from "../../../firebase"
import { Button } from 'react-native-elements';
import { showMessage } from "react-native-flash-message";
import { useTranslation } from 'react-i18next'
import ModalWeb from 'modal-enhanced-react-native-web';

const ModalConfirmationUpdatePhoto = ({user, updatePhoto, setUpdatePhoto, img}) => {
    const [url, setUrl] = useState("")
    const { t } = useTranslation()

    const handleChangePhotoUrl = async() => {
        const response = await fetch(img)
        const blob = await response.blob()
        
        const uploadTask = storage.ref(`msh-photo-user/${user.displayName}`).put(blob)
        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {console.log(error)},
          () => {
            storage
              .ref("msh-photo-user")
              .child(user.displayName)
              .getDownloadURL()
              .then(url => {
                const uploadTask = () => {
                  user.updateProfile({photoURL: url})
                  .then(() => navigation.replace('My Sweet Hotel'))
                }
                  return setUrl(url, uploadTask())})
          }
        )
      } 

  return (
    <ModalWeb 
        animationType="slide"
        style={styles.roomBoxView}                
        transparent={true} 
        isVisible={updatePhoto} 
        onBackdropPress={() => setUpdatePhoto(false)}>
        <View style={styles.modalRoom}>
        <Text style={{
                width: "100%", 
                marginBottom: 10, 
                fontSize: 15,
                paddingTop: 10, 
                paddingBottom: 10,
                borderRadius: 5,
                textAlign: "center", 
                backgroundColor: "lightblue"
                }}>{t('message_confirmation_actualisation_photo')}</Text>
        <Button title={t('confirmer')} containerStyle={{width: "90%", borderRadius: 20, marginBottom: 15, marginTop: 15}} onPress={(event) => {
            handleChangePhotoUrl(event)
            setUpdatePhoto(false)
            showMessage({
            message: t('message_actualisation_photo'),
            type: "success",
            })
        }} />
        </View>
    </ModalWeb>
  )
}

export default ModalConfirmationUpdatePhoto

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