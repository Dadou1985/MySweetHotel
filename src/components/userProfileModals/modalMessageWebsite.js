import React, { useState, useContext, useEffect, memo } from 'react'
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import { db } from "../../../firebase"
import { Button } from 'react-native-elements';
import { useTranslation } from 'react-i18next'
import ModalWeb from 'modal-enhanced-react-native-web';
import * as WebBrowser from 'expo-web-browser';

const ModalMessageWebsite = ({user, userDB, showWebsite, setShowWebsite}) => {
    const { t } = useTranslation()

    const handleLinkWebsite = async() => {
        return WebBrowser.openBrowserAsync(userDB.website)
      }
    
    const handleNewConnection = () => {
        return db.collection("guestUsers")
            .doc(user.uid)
            .update({newConnection: false})
    }
      
    useEffect(() => {
        if(userDB.newConnection && userDB.website !== "none") {
            setShowWebsite(true)
        }
    }, [])

  return (
    <ModalWeb 
    animationType="slide"
    transparent={true}
    isVisible={showWebsite} 
    style={styles.roomBoxView}>
        <View style={styles.modalRoom2}>
        <Text style={{
            width: "100%", 
            fontSize: 20,
            paddingBottom: 10,
            textAlign: "center",
            fontWeight: "bold",
            paddingTop: 10,
            }}><Fontisto name="world" size={15} color="black" style={{marginRight: 15}} />
            {t('website')}</Text>
            <View style={{width: "90%", alignItems: "center"}}>
                <ImageBackground source={ require('../../../img/booking-shadow.png') } style={{
                    resizeMode: "contain",
                    width: 300,
                    height: 300}}>
                </ImageBackground>
                <Text style={{textAlign: "center", marginBottom: 10, width: "90%"}}>{t("website_message")}</Text>
                </View>
                <View style={{
                    flex: 1,
                    flexDirection: "column",
                    alignItems: "center",
                    width: "80%",
                    marginBottom: 20}}>
                    <Button containerStyle={styles.button2} type="clear" title={t("oui")} onPress={() => {
                    handleLinkWebsite()
                    setShowWebsite(false)
                    handleNewwConnection()
                    }} />
                    <Button containerStyle={styles.button2} title={t("non")} onPress={() => {
                    setShowWebsite(false)
                    handleNewConnection()}} />
                </View>
        </View>
    </ModalWeb>
  )
}

export default memo(ModalMessageWebsite)

const styles = StyleSheet.create({
  roomBoxView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: "90%",
  },
  button2: {
    width: "100%",
    marginTop: 10,
    borderRadius: 30
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