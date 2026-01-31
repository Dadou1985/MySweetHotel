import React, { useState, useEffect, useContext, useLayoutEffect, useCallback } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, ImageBackground, Platform } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { auth, db, specialFirestoreOptions } from "../../firebase"
import { UserContext } from '../components/userContext'
import moment from 'moment'
import 'moment/locale/fr';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import ModalWeb from 'modal-enhanced-react-native-web';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { fr, pt, en, de, es, it } from '../locales/config'

const Information = ({ navigation, route }) => {
    const { hotelLogo, currentHotelId } = route.params
    
    const [info, setInfo] = useState([])
    const [currentRoom, setCurrentRoom] = useState(null)
    const [date, setDate] = useState(new Date())
    const [showDate, setShowDate] = useState(true)
    const [formValue, setFormValue] = useState({username: "", email: "", region: "", departement: "", city: "", standing: "", phone: "", room: 0, code_postal: "", adress: "", website: "", mail: "", hotelId: "", hotelName: "", country: "", logo: ""})
    const [hotelName, setHotelName] = useState("Lancer la recherche")
    const [user, setUser] = useState(auth.currentUser)
    const [showModalRoom, setShowModalRoom] = useState(false)
    const [inputRoom, setInputRoom] = useState(false)
    const [url, setUrl] = useState("")
    const [hotelId, setHotelId] = useState(currentHotelId)
    const [recap, setRecap] = useState(false)

    const {userDB, setUserDB} = useContext(UserContext)
    const { t } = useTranslation()

    console.log("USER+++++++++++++++", user)

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
    LocaleConfig.defaultLocale = userDB && userDB.language && userDB.language;

    useEffect(() => {
        
        let unsubscribe = auth.onAuthStateChanged(function(user) {
            if (user) {
                setUser(user)
            } 
          });
        return unsubscribe
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "RoomChange",
            headerBackTitleVisible: false,
            headerTitleAlign: "right",
            headerTitle: () =>(
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    {hotelLogo ? <ImageBackground source={{uri: hotelLogo}} style={{width: 100, height: 50}}></ImageBackground> : <ImageBackground source={require('../../img/msh-newLogo-transparent.png')} style={{width: 80, height: 60}}></ImageBackground>}
                </View>
            ),
            headerLeft: null
        })
    }, [navigation])

    useEffect(() => {
        if(hotelId){
            return db.collection("hotels")
                .doc(hotelId)
                .onSnapshot((doc) => {
            const snapInfo = []
                snapInfo.push({
                    id: doc.id,
                    ...doc.data()
                })        
                console.log(snapInfo)
                setInfo(snapInfo)
            });
        }
    }, [hotelId])
        
    const handleLoadUserDB = async () => {
        const doc = await db.collection('guestUsers')
            .doc(user?.uid)
            .get();
        if (doc.exists) {
            setUserDB(doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        return navigation.replace('My Sweet Hotel');
    }

    

    const updateChatRoomname = () => {
        return db.collection('hotels')
          .doc(formValue.hotelId)
          .collection('chat')
          .doc(user.displayName)
          .update({
            checkoutDate: moment(date.timestamp).format('L') 
        })      
      }

      const isChatExist = async () => {
        const doc = await db.collection('hotels')
            .doc(formValue.hotelId)
            .collection('chat')
            .doc(user?.displayName)
            .get();
        if (doc.exists) {
            updateChatRoomname()
        }
    }

    const handleSubmit = async () => {
        try {
            await db.collection('guestUsers')
            .doc(user?.uid)
            .update({
                hotelId: formValue.hotelId,
                hotelName: hotelName,
                hotelRegion: formValue.region,
                hotelDept: formValue.departement,
                city: formValue.city,
                classement: formValue.standing,            
                room: currentRoom,
                checkoutDate: moment(date.timestamp).format('L'),
                towel: true,
                soap: true,
                toiletPaper: true,
                hairDryer: true,
                pillow: true,
                blanket: true,
                iron: true,
                babyBed: true, 
                website: formValue.website !== undefined ? formValue.website : "none",
                hotelPhone: formValue.phone,
                language: i18next.language,
                logo: formValue.logo,
                hotelVisitedArray: specialFirestoreOptions.arrayUnion(formValue.hotelId),
                })

            return handleLoadUserDB()
        } catch (error) {
            throw new Error()
        }
    }

    console.log("test++++++++++++++++", user?.displayName)

    return (
        <KeyboardAvoidingView style={styles.container}>
            <StatusBar style="light" />
                    <View style={styles.containerText}>
                        {recap && <>
                        <View style={styles.containerImg}>
                            {hotelLogo ? <ImageBackground source={{uri: hotelLogo}} style={{width: 250, height: 300, borderRadius: 5}}></ImageBackground> : 
                            <ImageBackground source={require('../../img/new-logo-msh.png')} style={{width: 400, height: 200, marginLeft: 100}}></ImageBackground>}
                            {currentRoom && <Text style={{fontSize: 18, marginBottom: 10, marginTop: 20}}>{t("occupation_chbre")} {currentRoom}</Text>}
                            <Text style={{fontSize: 18, marginBottom: 20}}>{t("checkout_prevu")} {moment(date.timestamp).format('L')}</Text>
                        </View>
                        <View style={styles.buttonView}>   
                            <Button
                             icon={<Feather name="check-circle" size={25} 
                             color="black" style={{marginRight: 5}} 
                             />}
                             buttonStyle={{backgroundColor: "#B8860B"}}
                             titleStyle={{color: "black"}}
                             onPress={() => {
                                handleSubmit()
                                isChatExist()
                            }} containerStyle={styles.button} title={t("accueil")} />
                            <Button type="clear" 
                                      titleStyle={{color: "#B8860B"}}
                                      onPress={() => {
                                setShowDate(true)
                                setRecap(false)
                                
                            }} containerStyle={styles.button} title={t("recommencer")} />
                        </View>
                        </>}
                    </View>

                <ModalWeb 
                    animationType="slide"
                    transparent={true}
                    isVisible={showDate} 
                    style={styles.datePickerModal}>
                    <View style={{
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: "white",
                        width: "100%",
                        height: "auto",
                        borderRadius: 5
                    }}>
                        <View style={{
                            flexDirection: "row", 
                            width: "100%", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            marginBottom: 10, 
                            paddingTop: 10, 
                            paddingBottom: 10, 
                            backgroundColor: "#B8860B",
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5}}>
                            <Text style={{fontSize: 20}}>{t('date_checkout')}</Text>
                        </View>
                        <Calendar
                            minDate={new Date()} 
                            pastScrollRange={0}
                            renderArrow={(direction) => {
                                if(direction === 'left') return <AntDesign name="left" size={24} color="#B8860B" style={{marginLeft: 5}} />
                                if(direction === 'right') return <AntDesign name="right" size={24} color="#B8860B" style={{marginLeft: 5}} />
                            }}
                            markedDates={{[date.dateString]: {selected: true, marked: true, selectedColor: "#B8860B"}}}
                            onDayPress={(day) => {
                                setDate(day)
                                info.map(hotel => {
                                    setFormValue({
                                        hotelId: hotelId,
                                        departement: hotel.departement,
                                        region: hotel.region,
                                        city: hotel.city,
                                        code_postal: hotel.code_postal,
                                        country: hotel.country,
                                        room: hotel.room,
                                        standing: hotel.classement,
                                        website: hotel.website,
                                        phone: hotel.phone,
                                        logo: hotel.logo,
                                    })
                                setHotelName(hotel.hotelName)
                                setUrl(hotel.website)})
                            setShowModalRoom(true)
                            setTimeout(() => {
                                setShowDate(false)
                            }, 100);
                        }} />
                    </View>
                </ModalWeb>

                <ModalWeb
                animationType="slide"
                transparent={true}
                isVisible={showModalRoom} 
                style={styles.roomBoxView}
                onBackdropPress={() => setShowModalRoom(false)} >
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
                        }}>{t("num_chbre")}</Text>
                        <Input 
                            placeholder={t("entre_num_chbre")} 
                            type="number" 
                            value={currentRoom !== "Numéro de chambre" ? currentRoom : ""} 
                            onChangeText={(text) => setCurrentRoom(text)}
                            inputContainerStyle={{borderBottomWidth: 0}} style={{textAlign: "center", outline: "none", borderBottomColor: "#B8860B", borderBottomWidth: 1, marginBottom: "3vh"}} />  
                        <Button 
                        raised={true} 
                        onPress={() => {
                            setShowModalRoom(false)
                            setShowDate(false)
                            setRecap(true)}} 
                            containerStyle={{width: "90%", borderRadius: 20, marginBottom: 15}} 
                            buttonStyle={{backgroundColor: "#B8860B", borderRadius: 20}} 
                            title={t("validation")}
                            titleStyle={{color: "black"}}
                            />
                        <Button 
                        raised={true} 
                        type="clear" 
                        onPress={() => {
                            setShowModalRoom(false)
                            setShowDate(false)
                            setRecap(true)}} 
                            containerStyle={{width: "90%", borderRadius: 20, marginBottom: 15, borderColor: "#B8860B", borderWidth: 1}} 
                            title={t('no_room')}
                            titleStyle={{color: "#B8860B"}}
                            />
                    </View>
                </ModalWeb>
           
        </KeyboardAvoidingView>
    )
}

export default Information

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white"
    },
    container2: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 25
    },
    containerText: {
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 30
    },
    containerImg: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
      },
    containerInput: {
        flex: 3,
      },
    text: {
        fontSize: 30,
        textAlign: "center"
    },
    button: {
        width: "80%",
        marginTop: 10,
        borderRadius: 30,
        borderColor: "#B8860B", borderWidth: 1
    },
    button2: {
        width: 350,
        marginTop: 10,
        borderRadius: 30,
        marginBottom: 30
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        height: "100%",
      },
    roomBoxView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: "90%",
        position: "fixed",
    },
    modalView: {
        marginTop: 55,
        backgroundColor: 'white',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderRadius: 5
    },
    modalRoom: {
        marginTop: "60%",
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
    },
    buttonView: {
        flexDirection: "column",
        alignItems: "center",
        width: 350,

    },
    img: {marginLeft: 25,
        width: 50,
        height: 50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
      },
    datePickerButton: {
        width: 250,
        marginTop: 50, 
        marginBottom: 90,
        borderColor: "white",
        marginTop: 100
    },
    barcodeContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center"
    },
})

