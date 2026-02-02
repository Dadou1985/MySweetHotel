import React, { useState, memo } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { auth, db } from "../../../firebase"
import { Button, Input } from 'react-native-elements';
import { showMessage } from "react-native-flash-message";
import { useTranslation } from 'react-i18next'
import ModalWeb from 'modal-enhanced-react-native-web';

const ModalUpdateEmail = ({user, userDB, handleLoadUserDB, updateMail, setUpdateMail}) => {
    const [email, setEmail] = useState('')
    const { t } = useTranslation()

    const handleChangeEmail = async() => {
        await auth.signInWithEmailAndPassword(user.email, userDB.password)
            .then(function(userCredential) {
            userCredential.user.updateEmail(email)
        })
      
        await db.collection('guestUsers')
            .doc(user.uid)
            .update({
              email: email,
            })
      
          showMessage({
            message: t('message_actualisation_email'),
            type: "success"
          })
      
          return handleLoadUserDB()
          .then(() => {
            setEmail("")
            setUpdateMail(false)
          })
      }

  return (
    <ModalWeb 
        animationType="slide" 
        style={styles.roomBoxView}
        transparent={true} 
        isVisible={updateMail} 
        onBackdropPress={() => {
        setUpdateMail(false)
        setEmail(null)}}>
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
                }}>{t('actualisation_email')}</Text>
        <View style={styles.inputContainer}>
            <Input placeholder={t('email')} inputContainerStyle={{borderBottomWidth: 0}} type="email" value={email} style={{textAlign: "center", outline: "none", borderBottomColor: "#B8860B", borderBottomWidth: 1}}
            onChangeText={(text) => setEmail(text)} />
        </View>
        <Button 
        title={t('actualiser')} 
        containerStyle={{width: "90%", borderRadius: 20, marginBottom: 15, marginTop: 15}} 
        buttonStyle={{backgroundColor: "#B8860B"}} 
        titleStyle={{color: "black"}}
        onPress={handleChangeEmail} />
        </View>
    </ModalWeb>
  )
}

export default memo(ModalUpdateEmail)

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