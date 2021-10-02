import React, { useState, useContext, useLayoutEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TouchableOpacity, ImageBackground, Modal, Platform } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { UserContext } from '../components/userContext'
import { auth, db } from "../../firebase"
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import 'moment/locale/fr';
import { showMessage, hideMessage } from "react-native-flash-message";
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import ModalWeb from 'modal-enhanced-react-native-web';
import {Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars';

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

    LocaleConfig.locales[i18next.language] = {
        monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
        monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
        dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
        dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'],
        today: 'Aujourd\'hui'
      };
      LocaleConfig.defaultLocale = 'fr';

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

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDate(Platform.OS === 'ios');
        setDate(currentDate);
      };

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
        setPhoneNumber("")
        
        return db.collection("hotel")
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

    const handlePlatformDate = () => {
        if(Platform.OS === 'ios') {
            return (
                <Modal 
                    animationType="slide"
                    visible={showDate} 
                    style={styles.datePickerModal}>
                    <View style={{
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: "white",
                        marginTop: 55,
                        width: "100%",
                        height: "80%"
                    }}>
                        <View style={{
                            flexDirection: "row", 
                            width: 420, 
                            alignItems: "center", 
                            justifyContent: "center", 
                            marginBottom: 10, 
                            paddingTop: 10, 
                            paddingBottom: 10, 
                            backgroundColor: "lightblue"}}>
                            <Text style={{fontSize: 25, marginRight: 20}}>{t('date_checkout')}</Text>
                            <TouchableOpacity>
                                <AntDesign name="closecircle" size={24} color="black" onPress={() => setShowDate(false)} />
                            </TouchableOpacity>
                        </View>
                        <DateTimePicker
                            testID="dateTimePicker"
                            locale={i18next.language}
                            value={date}
                            mode='date'
                            is24Hour={true}
                            minimumDate={date}
                            display="spinner"
                            onChange={onChange}
                            style={styles.datePicker}
                        />
                        <Button raised={true} onPress={() => {
                            setShowDate(false)
                        }} containerStyle={styles.datePickerButton} title={t('validation')} />
                    </View>
                </Modal>
            )
        }else{
                return (
                    <View>
                        <DateTimePicker
                            testID="dateTimePicker"
                            locale={i18next.language}
                            value={date}
                            mode='date'
                            is24Hour={true}
                            minimumDate={Date.now() + 86400000}
                            display="default"
                            onChange={onChange}
                        />
                    </View>
                )
        }
    }

    const handlePlatformTime = () => {
        if(Platform.OS === 'ios') {
            return (
                <Modal 
                    animationType="slide"
                    visible={showHour} 
                    style={styles.datePickerModal}>
                    <View style={{
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: "white",
                        marginTop: 55,
                        width: "100%",
                        height: "80%"
                    }}>
                        <View style={{
                            flexDirection: "row", 
                            width: 420, 
                            alignItems: "center", 
                            justifyContent: "center", 
                            marginBottom: 10, 
                            paddingTop: 10, 
                            paddingBottom: 10, 
                            backgroundColor: "lightblue"}}>
                            <Text style={{fontSize: 25, marginRight: 20}}>{t('reveil_heure')}</Text>
                            <TouchableOpacity>
                                <AntDesign name="closecircle" size={24} color="black" onPress={() => setShowHour(false)} />
                            </TouchableOpacity>
                        </View>
                        <DateTimePicker
                            testID="dateTimePicker"
                            locale={i18next.language}
                            value={hour}
                            mode='time'
                            is24Hour={true}
                            display="spinner"
                            onChange={onTimeChange}
                            style={styles.datePicker}
                        />
                        <Button raised={true} onPress={() => {
                            setShowHour(false)
                        }} containerStyle={styles.datePickerButton} title={t('validation')} />
                    </View>
                </Modal>
            )
        }else{
            return (
                <View>
                    <DateTimePicker
                    style={{width: "100%"}}
                    testID="dateTimePicker"
                    value={hour}
                    mode='time'
                    is24Hour={true}
                    display="default"
                    onChange={onTimeChange}
                    />
                </View>
            )
        }
    }
      
    moment.locale('fr')

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.containerText}>
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
                showMessage({
                    message: t('reveil_message_succes'),
                    type: "success",
                  })
                }} containerStyle={styles.button} title={t('reveil_bouton')} />
            
            {/*showDate && handlePlatformDate()*/}
            {showTime && handlePlatformTime()}

            <ModalWeb
                animationType="slide"
                transparent={true}
                isVisible={showTime} 
                style={styles.roomBoxView}
                onBackdropPress={() => setShowTime(false)}>
                    <View style={styles.modalRoom}>
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
                    style={styles.roomBoxView}
                    onBackdropPress={() => setshowPhoneNumber(false)}>
                        <View style={styles.modalRoom}>
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
                    style={styles.roomBoxView}
                    onBackdropPress={() => setShowDate(false)}>
                        <View style={styles.modalRoom}>
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
                            theme={{arrowColor: "blue"}}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
    },
    containerText: {
        flex: 2,
        width: "100%"
    },
    text: {
        fontSize: 30,
        color: "white", 
        marginLeft: 100
    },
    inputContainer: {
        width: "70%",
        marginTop: 10, 
        flexDirection: "row", 
        justifyContent: "center",
    },
    button: {
        width: "80%",
        marginTop: 50, 
        marginBottom: 50,
        borderColor: "white",
        borderRadius: 30,
    },
    datePickerButton: {
        width: 250,
        marginTop: 50, 
        marginBottom: 90,
        borderColor: "white",
        marginTop: 100
    },
    img: {
        width: 24,
        height: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginRight: 5
    },
    datePicker: {
        width: 350,
        height: 260,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: "white",
        marginTop: 200
    },
    datePickerModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 55,
        backgroundColor: "white"
      },
      roomBoxView: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
      },
      modalRoom: {
          margin: 20,
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
          elevation: 5,
          width: "90%"
      }
})