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
import { AntDesign } from '@expo/vector-icons';

const Timer = ({navigation}) => {
    const [date, setDate] = useState(new Date())
    const [hour, setHour] = useState(new Date())
    const [user, setUser] = useState(auth.currentUser)
    const {userDB, setUserDB} = useContext(UserContext)

    const [showDate, setShowDate] = useState(false)
    const [showHour, setShowHour] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState("")

    const { t } = useTranslation()

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Timer",
            headerBackTitleVisible: false,
            headerTitleAlign: "right",
            headerTitle: () =>(
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Image source={{uri: "https://image.flaticon.com/icons/png/512/62/62834.png"}} style={styles.img} />
                    <Text style={{ color: "black", fontWeight : "bold", fontSize: 20}}>{t('reveil_titre')}</Text>
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

    const handleShowHour = () => {
        setShowHour(true)
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
            hour: moment(hour).format('LT'),
            date: moment(date).format('L'),
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
                            <Text style={{fontSize: 25, marginRight: 20}}>{t('reveil_jour')}</Text>
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
                            minimumDate={new Date()}
                            display="spinner"
                            onChange={onDateChange}
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
                        minimumDate={new Date()}
                        display="default"
                        onChange={onDateChange}
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
            <View style={{width: 300, marginTop: 60}}>
                <View style={{marginBottom: 20, flexDirection: "column", alignItems: "center"}}>
                    <Text style={{fontSize: 15}}>{t('jour')}</Text>
                    <Button type="clear" title={moment(date).format('L')} 
                    onPress={handleShowDate} />
                </View>
                <View style={{marginBottom: 20, flexDirection: "column", alignItems: "center"}}>
                    <Text style={{fontSize: 15}}>{t('heure')}</Text>
                    <Button type="clear" title={moment(hour).format('LT')} 
                        onPress={handleShowHour} />
                </View>
            </View> 
            <View style={styles.inputContainer}>
                <Input style={{textAlign: "center"}} placeholder={t("timer_num_tel")} type="text" value={phoneNumber} 
                onChangeText={(text) => setPhoneNumber(text)} />
            </View>
            <Button raised={true} onPress={() => {
                handleSubmit()
                showMessage({
                    message: t('reveil_message_succes'),
                    type: "success",
                  })
                }} containerStyle={styles.button} title={t('reveil_bouton')} />
            
            {showDate && handlePlatformDate()}
            {showHour && handlePlatformTime()}
            
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
        width: 250,
        marginTop: 50, 
        marginBottom: 90,
        borderColor: "white" 
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
      }
})