import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, ImageBackground, Platform } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { auth, db } from "../../firebase"
import { paris_arrondissement, ile_de_france, auvergne_rhone_alpes, bourgogne_franche_comte, bretagne, centre_val_de_loire, corse, grand_est, hauts_de_france, normandie, nouvelle_aquitaine, occitanie, pays_de_la_loire,provence_alpes_cote_d_azur } from "../../hotels"
import DateTimePicker from '@react-native-community/datetimepicker';
import { UserContext } from '../components/userContext'
import moment from 'moment'
import 'moment/locale/fr';
import { showMessage, hideMessage } from "react-native-flash-message";
import * as Linking from 'expo-linking';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { BarCodeScanner } from 'expo-barcode-scanner';

const Information = ({ navigation }) => {
    
    const [info, setInfo] = useState([])
    const [currentRoom, setCurrentRoom] = useState("Numéro de chambre")
    const [date, setDate] = useState(new Date())
    const [showDate, setShowDate] = useState(false)
    const [formValue, setFormValue] = useState({username: "", email: "", region: "", departement: "", city: "", standing: "", phone: "", room: 0, code_postal: "", adress: "", website: "", mail: "", hotelId: "", hotelName: "", country: ""})
    const [filter, setFilter] = useState("")
    const [initialFilter, setInitialFilter] = useState("")
    const [hotelName, setHotelName] = useState("Lancer la recherche")
    const [hideAll, setHideAll] = useState(false)
    const [user, setUser] = useState(auth.currentUser)
    const {userDB, setUserDB} = useContext(UserContext)
    const [showModalHotel, setShowModalHotel] = useState(false)
    const [showModalRoom, setShowModalRoom] = useState(false)
    const [checkoutButton, setCheckoutButton] = useState(false)
    const [inputRoom, setInputRoom] = useState(false)
    const [url, setUrl] = useState("")
    const [hotelId, setHotelId] = useState(null)
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    const deptDetails = [paris_arrondissement, ile_de_france, auvergne_rhone_alpes, bourgogne_franche_comte, bretagne, centre_val_de_loire, corse, grand_est, hauts_de_france, normandie, nouvelle_aquitaine, occitanie, pays_de_la_loire,provence_alpes_cote_d_azur]

    const { t } = useTranslation()

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "RoomChange",
            headerBackTitleVisible: false,
            headerTitleAlign: "right",
            headerTitle: () =>(
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    {userDB.checkoutDate !== "" ? 
                     <Text style={{ color: "black", fontWeight : "bold", fontSize: 20, marginLeft: 5}}>{t("prochain_sejour")}</Text> : <Text style={{ color: "black", fontWeight : "bold", fontSize: 20, marginLeft: 5}}>{t("trouver_hotel")}</Text>}
                </View>
            ),
            headerLeft: null
        })
    }, [navigation])

    useEffect(() => {
        if(hotelId !== null){
            return db.collection("hotel")
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
        
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDate(Platform.OS === 'ios');
        setInputRoom(true)
        setDate(currentDate);
        setTimeout(() => {
            showMessage({
                message: t("message_checkout_valide"),
                type: "info",
            })
        }, 2000);
      };
    
    const handleLoadUserDB = () => {
        return db.collection('guestUsers')
        .doc(user.uid)
        .get()
        .then((doc) => {
            if (doc.exists) {
            setUserDB(doc.data())
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).then(() => {
            return navigation.replace('My Sweet Hotel')
        })
    }

    const handleUpdateLanguage = () => {
        return db.collection('guestUsers')
        .doc(user.uid)
        .update({
            language: i18next.language
        })
    }

    const handleSubmit = async () => {
        await db.collection('guestUsers')
        .doc(user.uid)
        .update({
            hotelId: formValue.hotelId,
            hotelName: hotelName,
            hotelRegion: formValue.region,
            hotelDept: formValue.departement,
            city: formValue.city,
            classement: formValue.standing,            
            room: currentRoom,
            checkoutDate: moment(date.getTime()).format('L'),
            towel: true,
            soap: true,
            toiletPaper: true,
            hairDryer: true,
            pillow: true,
            blanket: true,
            iron: true,
            babyBed: true, 
            website: formValue.website,
            phone: formValue.phone,
            language: i18next.language
            })
        return handleLoadUserDB()
    }

    const handleLinkWebsite = async() => {
        return Linking.openURL(userDB.website)
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
                            setInputRoom(true)
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

    useEffect(() => {
        (async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        })();
      }, []);
    
      const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setHotelId(data)
      };
    
      if (hasPermission === null) {
        return <Text style={{color: "white"}}>Requesting for camera permission</Text>;
      }
      if (hasPermission === false) {
        return <Text>No access to camera</Text>;
      }

    console.log(hotelId)

    return (
        <KeyboardAvoidingView style={styles.container}>
            <StatusBar style="light" />
            {userDB.checkoutDate !== "" ? <View style={styles.containerText}>
                        <View style={styles.containerImg}>
                        <ImageBackground source={ require('../../img/booking11.png') } style={{
                            flex: 1,
                            resizeMode: "contain",
                            justifyContent: "center",
                            width: 410}}>
                        </ImageBackground>
                            <View style={{
                                position: "absolute",
                                flexDirection: "column",
                                alignItems: "center",
                                width: "100%",
                                top: 500}}>
                                <Button containerStyle={styles.button} type="clear" title={t("oui")} onPress={handleLinkWebsite} />
                                <Button raised={true} containerStyle={styles.button} title={t("non")} onPress={async() => {
                                    await handleUpdateLanguage()
                                    handleLoadUserDB()
                                    return setTimeout(() => {
                                        showMessage({
                                            message: `${t("message_bienvenue")} ${user.displayName}`,
                                            type: "info",
                                          })
                                    }, 2000);
                                }} />
                            </View>
                        </View>
                    </View>
                :  
                    <View style={styles.containerText}>
                        <View style={styles.containerImg}>
                            <ImageBackground source={ require('../../img/qr_code.png') } style={{width: 700, height: 800}}>
                            </ImageBackground>
                        </View>
                        <View style={styles.buttonView}>
                            {!hotelId && <Button 
                                raised={true} 
                                icon={<Ionicons name="search-circle" size={25} color="black" style={{marginRight: 5}} />}
                                onPress={() => {
                                    setShowModalHotel(true)}} containerStyle={styles.button} title={t("recherche_hotel")} type="outline" />}
                            {hotelId && <Button 
                                raised={true} 
                                icon={<Feather name="check-circle" size={25} color="black" style={{marginRight: 5}} />}
                                onPress={() => setCheckoutButton(true)} containerStyle={styles.button} title={hotelName} type="solid" />}
                               
                                {checkoutButton &&
                                <Button 
                                    raised={true} 
                                    icon={<Ionicons name="calendar" size={24} color="black" style={{marginRight: 5}} />}
                                    onPress={() => {
                                        setShowDate(true)
                                        }} containerStyle={styles.button} title={inputRoom ? `${t("checkout_prevu")} ${moment(date).format('L')}` : t("date_checkout")} type="outline" />}

                            {inputRoom &&
                             <Button 
                             raised={true} 
                             icon={<Ionicons name="bed-sharp" size={25} color="black" style={{marginRight: 5}} />}
                             onPress={() => {
                                 setShowModalRoom(true)
                                 }} containerStyle={styles.button} title={currentRoom !== "Numéro de chambre" ? `${t("chbre_num")} ${currentRoom}` : t("num_chbre")} type="outline" />}
                            {currentRoom !== "Numéro de chambre" &&
                            <Button raised={true} onPress={() => {
                                handleSubmit()
                                setTimeout(() => {
                                    showMessage({
                                        message: `${t("message_bienvenue")} ${user.displayName}`,
                                        type: "info",
                                      })
                                }, 3000);
                            }} containerStyle={styles.button} title={t("accueil")} />}
                        </View>
                    </View>
                
            }

            <Modal 
            animationType="slide"
            transparent={true}
            visible={showModalHotel} 
            style={styles.centeredView}>
                <ScrollView contentContainerStyle={styles.modalView}>
                    <View style={{
                        flexDirection: "row", 
                        width: "100%", 
                        alignItems: "center", 
                        justifyContent: "center",
                        paddingTop: 10, 
                        paddingBottom: 10, 
                        backgroundColor: "lightblue"}}>
                        <Text style={{fontSize: 15, marginRight: 20}}>{t("recherche_hotel")}</Text>
                        <TouchableOpacity>
                            <AntDesign name="closecircle" size={24} color="black" onPress={() => setShowModalHotel(false)} />
                        </TouchableOpacity>
                    </View>
                    <View style={{width: "100%", height: "100%", flex: 1}}>
                        <BarCodeScanner
                            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                            style={[StyleSheet.absoluteFill, styles.barcodeContainer]}
                        >
                            <View style={{borderRadius: 5, borderColor: "white", width: 300, height: 300, borderStyle: "dashed", borderWidth: 10, opacity: 0.3}} />
                        </BarCodeScanner>
                        {hotelId && <Button raised={true} onPress={() => {
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
                                    phone: hotel.phone
                                })
                                setHotelName(hotel.hotelName)
                                setUrl(hotel.website)
                            })
                            return setShowModalHotel(false)
                        }} containerStyle={{width: "80%", position: "absolute", bottom: "10%", left: "10%", borderRadius: 20}} title={t("validation")} />}
                    </View>
                </ScrollView>
            </Modal>

            <Modal 
            animationType="slide"
            transparent={true}
            visible={showModalRoom} 
            style={styles.roomBoxView}>
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
                    }}>{t("num_chbre")}</Text>
                    <Input 
                        placeholder={t("entre_num_chbre")} 
                        type="number" 
                        value={currentRoom !== "Numéro de chambre" ? currentRoom : ""} 
                        onChangeText={(text) => setCurrentRoom(text)} style={{textAlign: "center", marginBottom: 5}} />  
                    <Button raised={true} onPress={() => setShowModalRoom(false)} containerStyle={{width: 300, borderRadius: 20, marginBottom: 15}} title={t("validation")} />
                </View>
            </Modal>

            {showDate && handlePlatformDate()}
           
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
        marginTop: 150
      },
    containerInput: {
        flex: 3,
      },
    text: {
        fontSize: 30,
        textAlign: "center"
    },
    button: {
        width: 350,
        marginTop: 10,
        borderRadius: 30,
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
        height: "100%"

    },
    modalRoom: {
        margin: 20,
        marginTop: 265,
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
        marginTop: 55,
        backgroundColor: "white"
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