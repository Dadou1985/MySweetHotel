import React, { useState, useContext, useLayoutEffect } from 'react';
import { KeyboardAvoidingView, Text, View, TouchableOpacity, ImageBackground, Modal, Platform } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { UserContext } from '../components/userContext'
import { auth, db, specialFirestoreOptions } from "../../firebase"
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import 'moment/locale/fr';
import { showMessage, hideMessage } from "react-native-flash-message";
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import ModalWeb from 'modal-enhanced-react-native-web';
import {Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars';
import { fr, pt, en, de, es, it } from '../locales/config'
import GlobalTimeFeatureStyle from '../utils/globalTimeFeatureStyle'

const Timer = ({navigation}) => {
    const [date, setDate] = useState(new Date())
    const [time, setTime] = useState("")
    const [hour, setHour] = useState("")
    const [minute, setMinute] = useState("")
    const [user, setUser] = useState(auth.currentUser)
    const {userDB, setUserDB} = useContext(UserContext)

    const [showDate, setShowDate] = useState(false)
    const [showTime, setShowTime] = useState(false)
    const [showPhoneNumber, setshowPhoneNumber] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")

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
            title: "Timer",
            headerBackTitleVisible: false,
            headerTitleAlign: "right",
            headerTitle: () =>(
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Ionicons name="alarm" size={24} color="black" />
                    <Text style={{ color: "black", fontWeight : "bold", fontSize: 20, marginLeft: 5}}>{t('reveil_titre')}</Text>
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

    const handleShowDate = () => {
        setShowDate(true)
    }

    const handleShowTime = () => {
        setShowTime(true)
    }

    const handleSubmit = () => {
        setPhoneNumber("")
        
        return db.collection("hotels")
        .doc(userDB.hotelId)
        .collection('clock')
        .add({
            author: "effectué par le client",
            client: user.displayName,
            room: userDB.room,
            markup: Date.now(),
            hour: time,
            date: moment(date.timestamp).format('L'),
            phoneNumber: phoneNumber,
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
            clock: specialFirestoreOptions.arrayUnion({
                hour: time,
                markup: Date.now()
            })
        })
    }
      
    moment.locale('fr')

    return (
        <KeyboardAvoidingView behavior="padding" style={GlobalTimeFeatureStyle.container}>
            <StatusBar style="light" />
            <View style={GlobalTimeFeatureStyle.containerText}>
            <ImageBackground source={ require('../../img/pic_timer.png') } style={{
                flex: 1,
                resizeMode: "contain",
                justifyContent: "center",
                width: "100%"}}>
                </ImageBackground>
            </View>
            <View style={{width: 300, marginTop: 90, marginBottom: 20}}>
                <View style={{flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}>
                    <View style={{marginBottom: 20, flexDirection: "column", alignItems: "center"}}>
                        <Text style={{fontSize: 15}}>{t('jour')}</Text>
                        {date.timestamp ? <Button type="clear" title={moment(date.timestamp).format('L')}
                            onPress={handleShowDate} /> : <Button type="clear" title={moment(date).format('L')}
                            onPress={handleShowDate} />}
                    </View>
                    <View style={{marginBottom: 20, flexDirection: "column", alignItems: "center"}}>
                        <Text style={{fontSize: 15}}>{t('heure')}</Text>
                        <Button type="clear" title={time !== "" ? time : moment(new Date()).format('LT')}
                            onPress={handleShowTime} />
                    </View>
                </View>
                <View style={{marginBottom: 20, flexDirection: "column", alignItems: "center"}}>
                    <Text style={{fontSize: 15}}>{t('timer_num_tel')}</Text>
                    <Button type="clear" title={phoneNumber !== "" ? phoneNumber : t("clic")}
                        onPress={() => setshowPhoneNumber(true)} />
                </View>
            </View> 
           
            <Button onPress={() => {
                handleSubmit()
                handleItemToJourney()
                showMessage({
                    message: t('reveil_message_succes'),
                    type: "success",
                  })
                }} containerStyle={GlobalTimeFeatureStyle.button} title={t('reveil_bouton')} />

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
                            onChangeText={(text) => setHour(text)} containerStyle={{width: "15%"}} /> 
                            :
                            <Input 
                            placeholder="00" 
                            type="number" 
                            value={minute} 
                            maxLength="2"
                            onChangeText={(text) => setMinute(text)} containerStyle={{width: "15%"}} />  
                        </View>
                        <Button onPress={() => {
                            setTime(`${hour}:${minute}`)
                            setShowTime(false)}} containerStyle={{width: "90%", borderRadius: 20, marginBottom: 15, marginTop: 15}} title={t("validation")} />
                    </View>
                </ModalWeb>

                <ModalWeb
                    animationType="slide"
                    transparent={true}
                    isVisible={showPhoneNumber} 
                    style={GlobalTimeFeatureStyle.roomBoxView}
                    onBackdropPress={() => setshowPhoneNumber(false)}>
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
                            }}>{t('timer_num_tel')}</Text>
                            <Input 
                            placeholder={t("phone")} 
                            type="number" 
                            value={phoneNumber} 
                            onChangeText={(text) => setPhoneNumber(text)} style={{textAlign: "center", marginBottom: 5}} />  
                        <Button onPress={() => setshowPhoneNumber(false)} containerStyle={{width: "90%", borderRadius: 20, marginBottom: 15, marginTop: 15}} title={t("validation")} />
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
                            minDate={new Date()} 
                            renderArrow={(direction) => direction === 'left' ? <AntDesign name="left" size={24} /> : <AntDesign name="right" size={24} />}                            
                            pastScrollRange={0}
                            onDayPress={(day) => {
                                setDate(day)
                                setShowDate(false)
                            }}
                                 />
                        </View>
                    </ModalWeb>
            
        </KeyboardAvoidingView>
    )
}

export default Timer