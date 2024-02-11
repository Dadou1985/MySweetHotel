import React, { useState,useContext, useLayoutEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, ImageBackground, TouchableOpacity, Modal, Platform } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { auth, db, specialFirestoreOptions } from "../../firebase"
import { UserContext } from '../components/userContext'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import 'moment/locale/fr';
import { showMessage, hideMessage } from "react-native-flash-message";
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import ModalWeb from 'modal-enhanced-react-native-web';
import {Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars';
import { fr, pt, en, de, es, it } from '../locales/config'
import Picture from '../img/taxi.svg'
import GlobalTimeFeatureStyle from '../utils/globalTimeFeatureStyle'

const Taxi = ({ navigation }) => {
    const [date, setDate] = useState(new Date())
    const [time, setTime] = useState("")
    const [hour, setHour] = useState("")
    const [minute, setMinute] = useState("")
    const [passenger, setPassenger] = useState(undefined)
    const [type, setType] = useState("Berline")
    const [typeClone, setTypeClone] = useState("")
    const [adress, setAdress] = useState("")
    const [user, setUser] = useState(auth.currentUser)
    const {userDB, setUserDB} = useContext(UserContext)

    const [showDate, setShowDate] = useState(false)
    const [showTime, setShowTime] = useState(false)

    const { t } = useTranslation()

    const locales = () => {
        switch(i18next.language) {
            case 'fr':
                return fr
            case 'en':
                return en
            case 'es':
                return es
            case 'de':
                return de
            case 'it':
                return it
            case 'pt':
                return pt
            default:
                return fr
        }
    }
    
      LocaleConfig.locales[i18next.language] = locales()
      LocaleConfig.defaultLocale = userDB.language;

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Taxi",
            headerBackTitleVisible: false,
            headerTitleAlign: "right",
            headerTitle: () =>(
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <FontAwesome5 name="taxi" size={24} color="black" />
                    <Text style={{ color: "black", fontWeight : "bold", fontSize: 20, marginLeft: 5}}>{t('taxi_titre')}</Text>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity onPress={() => {
                navigation.navigate("My Sweet Hotel")}}>
                    <AntDesign name="left" size={24} color="black" style={{marginLeft: 5}} />
                </TouchableOpacity>
            )
        })
    }, [navigation])

      const onTimeChange = (event, selectedHour) => {
        const currentHour = selectedHour || hour;
        setShowHour(Platform.OS === 'ios');
        setHour(currentHour);
      };

    const handleShowDate = () => {
        setShowDate(true)
    }

    const handleShowTime = () => {
        setShowTime(true)
    }

    const handleSubmit = () => {
        setPassenger('')
        setType('Berline')
        setAdress('')
        
        return db.collection("hotels")
        .doc(userDB.hotelId)
        .collection('cab')
        .add({
            author: "effectué par le client",
            destination: adress,
            client: user.displayName,
            room: userDB.room,
            pax: passenger,
            model: type,
            modelClone: typeClone,
            markup: Date.now(),
            hour: time,
            date: moment(date.timestamp).format('L'),
            status: true
          }).then(function(docRef){
            console.log(docRef.id)
          }).catch(function(error) {
            console.error(error)
          })
    }

    const handleItemToJourney = () => {
        return db.collection("guestUsers")
        .doc(user.uid)
        .collection('journey')
        .doc(userDB.journeyId)
        .update({
            cab: specialFirestoreOptions.arrayUnion({
                hour: time,
                carType: type,
                destination: adress,
                pax: passenger,
                markup: Date.now()
            })
        })
    }
      
    moment.locale('fr')

    return (
        <KeyboardAvoidingView behavior="padding" style={GlobalTimeFeatureStyle.container}>
            <StatusBar style="light" />
            <View style={GlobalTimeFeatureStyle.containerText}>
            <ImageBackground source={ require('../../img/pic_taxi2.png') } style={GlobalTimeFeatureStyle.image}>
                </ImageBackground>
            </View>
            <View style={styles.inputContainer}>
                <View style={{flexDirection: "row", justifyContent: "space-around"}}>
                    <View style={{marginBottom: 20, flexDirection: "column", alignItems: "center"}}>
                        <Text>{t('jour')}</Text>
                        {date.timestamp ? <Button type="clear" title={moment(date.timestamp).format('L')}
                        onPress={handleShowDate} /> : <Button type="clear" title={moment(date).format('L')}
                        onPress={handleShowDate} />}
                    </View>
                    <View style={{marginBottom: 20, flexDirection: "column", alignItems: "center"}}>
                        <Text>{t('heure')}</Text>
                        <Button type="clear" title={time !== "" ? time : moment(new Date()).format('LT')} 
                            onPress={handleShowTime} />
                    </View>   
                </View> 
                <View style={{marginBottom: 20, flexDirection: "column", alignItems: "center"}}>
                        <Text>{t('taxi_type')}</Text>
                        <View style={{flexDirection: "row", width: 400, justifyContent: "center", marginTop: 15}}>
                            <Button containerStyle={styles.typeButton} title={t('berline')} type={type === "Berline" ? "solid" : "clear"} raised={true} onPress={() => {
                                setType("Berline")
                                setTypeClone(t('berline'))}} />
                            <Button containerStyle={styles.typeButton} title={t('van')} type={type === "Van" ? "solid" : "clear"} raised={true} onPress={() => {
                                setType("Van")
                                setTypeClone(t('van'))}} />
                        </View>
                </View>
                <Input placeholder={t('passager')} type="number" value={passenger} 
                onChangeText={(text) => setPassenger(text)} />
                <Input placeholder={t('taxi_adresse_destination')}  type="text" value={adress} 
                onChangeText={(text) => setAdress(text)} />
            </View>
            <Button onPress={() => {
                handleSubmit()
                handleItemToJourney()
                showMessage({
                    message: t('taxi_message_succes'),
                    type: "success",
                  })
                }} containerStyle={GlobalTimeFeatureStyle.button} title={t('taxi_bouton')} />

            <ModalWeb
                animationType="slide"
                transparent={true}
                isVisible={showTime} 
                style={GlobalTimeFeatureStyle.roomBoxView}
                onBackdropPress={() => setShowTime(false)}>
                    <View style={GlobalTimeFeatureStyle.modalRoom}>
                        <Text style={{
                        width: "100%", 
                        marginBottom: 10, 
                        fontSize: 20,
                        paddingTop: 10, 
                        paddingBottom: 10,
                        borderRadius: 5,
                        textAlign: "center", 
                        backgroundColor: "lightblue"
                        }}>{t("heure")}</Text>
                        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", width: "90%"}}>
                            <Input
                            placeholder="00" 
                            type="number" 
                            value={hour} 
                            maxLength="2"
                            onChangeText={(text) => setHour(text)}
                            containerStyle={{width: "15%"}}/> 
                            :
                            <Input 
                            placeholder="00" 
                            type="number" 
                            value={minute} 
                            maxLength="2"
                            onChangeText={(text) => setMinute(text)}
                            containerStyle={{width: "15%"}}/> 
                        </View>
                        <Button onPress={() => {
                            setTime(`${hour}:${minute}`)
                            setShowTime(false)}} containerStyle={{width: "90%", borderRadius: 20, marginBottom: 15, marginTop: 15}} title={t("validation")} />
                    </View>
                </ModalWeb>

                <ModalWeb
                    animationType="slide"
                    transparent={true}
                    isVisible={showDate} 
                    style={GlobalTimeFeatureStyle.roomBoxView}
                    onBackdropPress={() => setShowDate(false)}>
                        <View style={GlobalTimeFeatureStyle.modalRoom}>
                        <Text style={{
                            width: "100%", 
                            marginBottom: 10, 
                            fontSize: 20,
                            paddingTop: 10, 
                            paddingBottom: 10,
                            borderRadius: 5,
                            textAlign: "center", 
                            backgroundColor: "lightblue"
                            }}>{t("jour")}</Text>
                            <Calendar
                            minDate={moment(date).format()} 
                            renderArrow={(direction) => direction === 'left' ? <AntDesign name="left" size={24} /> : <AntDesign name="right" size={24} />}                            
                            pastScrollRange={0}
                            onDayPress={(day) => {
                                setDate(day)
                                setShowDate(false)
                            }} />
                        </View>
                    </ModalWeb>
            
        </KeyboardAvoidingView>
    )
}

export default Taxi

const styles = StyleSheet.create({
    text: {
        fontSize: 30,
        textAlign: "center",
        color:"white",
        marginBottom: 30, 

    },
    inputContainer: {
        width: "80%",
        marginTop: 50, 

    },
    typeButton: {
        width: 125,
        marginTop: 10,
        borderColor: "white",
        marginLeft: 5,
        marginRight: 5 
    }
})
