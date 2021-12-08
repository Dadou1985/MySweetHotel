import React, { useState,useContext, useLayoutEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, ImageBackground, TouchableOpacity, Modal, Platform } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { auth, db } from "../../firebase"
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

const Taxi = ({ navigation }) => {
    const [date, setDate] = useState(new Date())
    const [time, setTime] = useState("")
    const [hour, setHour] = useState("")
    const [minute, setMinute] = useState("")
    const [passenger, setPassenger] = useState(null)
    const [type, setType] = useState("Berline")
    const [adress, setAdress] = useState("")
    const [user, setUser] = useState(auth.currentUser)
    const {userDB, setUserDB} = useContext(UserContext)

    const [showDate, setShowDate] = useState(false)
    const [showTime, setShowTime] = useState(false)

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
                    visible={showTime} 
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
            <ImageBackground source={ require('../../img/pic_taxi2.png') } style={styles.image}>
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
                            <Button containerStyle={styles.typeButton} title={t('berline')} type={type === "Berline" ? "solid" : "clear"} raised={true} onPress={() => setType("Berline")} />
                            <Button containerStyle={styles.typeButton} title={t('van')} type={type === "Van" ? "solid" : "clear"} raised={true} onPress={() => setType("Van")} />
                        </View>
                </View>
                <Input placeholder={t('passager')} type="number" value={passenger} 
                onChangeText={(text) => setPassenger(text)} />
                <Input placeholder={t('taxi_adresse_destination')}  type="text" value={adress} 
                onChangeText={(text) => setAdress(text)} />
            </View>
            <Button onPress={() => {
                handleSubmit()
                showMessage({
                    message: t('taxi_message_succes'),
                    type: "success",
                  })
                }} containerStyle={styles.button} title={t('taxi_bouton')} />
            
            {/*showDate && handlePlatformDate()*/}
            {/*showTime && handlePlatformTime()*/}

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
                            }} />
                        </View>
                    </ModalWeb>
            
        </KeyboardAvoidingView>
    )
}

export default Taxi

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "column",
        backgroundColor: "white"
    },
    containerText: {
        flex: 2,
        width: "100%",
    },
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
    },
    button: {
        width: "80%",
        marginTop: 10,
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
        backgroundColor: "white",
      },
      image: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end"
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
