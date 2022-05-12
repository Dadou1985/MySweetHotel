import React, { useLayoutEffect, useState, useContext, useEffect, useRef } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, Animated, Modal, Platform, AppState } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Entypo, MaterialIcons, SimpleLineIcons, Ionicons, AntDesign, FontAwesome5, Octicons, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db, storage } from "../../firebase"
import { UserContext } from '../components/userContext'
import moment from 'moment'
import 'moment/locale/fr';
import { Button, Input } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { showMessage } from "react-native-flash-message";
import ClickNwaitDrawer from '../components/ClickNwaitDrawer';
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatNotification from '../components/chatNotification'
import ModalWeb from 'modal-enhanced-react-native-web';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import * as serviceWorkerRegistration from "../serviceWorkerRegistration";
import * as WebBrowser from 'expo-web-browser';
import Filter from 'react-css-filter'
import { fr, pt, en, de, es, it } from '../locales/config'
import { pushNotificationSubscription } from '../utils/pushNotificationSubscription';

const UserProfile = ({navigation}) => {
    const [img, setImg] = useState(null)
    const [url, setUrl] = useState("")
    const [user, setUser] = useState(auth.currentUser)
    const {userDB, setUserDB} = useContext(UserContext)
    const [updateRoom, setUpdateRoom] = useState(false)
    const [updateMail, setUpdateMail] = useState(false)
    const [updatePhoto, setUpdatePhoto] = useState(false)
    const [updateCheckout, setUpdateCheckout] = useState(false)
    const [email, setEmail] = useState('')
    const [date, setDate] = useState(new Date())
    const [room, setRoom] = useState(null)
    const [showDate, setShowDate] = useState(false)
    const [chatResponse, setChatResponse] = useState([])
    const [isForegrounding, setIsForegrounding] = useState(false)
    const [conciergePanel, setConciergePanel] = useState(false)
    const [showModalNotification, setShowModalNotification] = useState(false)
    const [showWebsite, setShowWebsite] = useState(false)
    const { t } = useTranslation()

  const isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
                    navigator.userAgent &&
                    navigator.userAgent.indexOf('CriOS') == -1 &&
                    navigator.userAgent.indexOf('FxiOS') == -1;

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
          title: "My Sweet Hotel",
          headerBackTitleVisible: false,
          headerTitleAlign: "right",
          headerTitle: () =>(
              <View style={{flexDirection: "row", alignItems: "center"}}>
                {userDB.logo ? <Image source={{uri: userDB.logo}} style={{width: 100, height: 70, resizeMode:"contain"}}></Image> : <Image source={require('../../img/msh-newLogo-transparent.png')} style={{width: 80, height: 60}} />}
              </View>
          ),
          headerLeft: null,
          headerRight: () => (
          <SimpleLineIcons 
          name="logout" 
          size={24} 
          color="black" 
          style={{marginRight: 20}}
          onPress={() => {
              Logout()
              setTimeout(() => {
                  showMessage({
                      message: t('deconnexion'),
                      type: "info",
                    })
              }, 1000)
          }} />)
      })
  }, [])

  useEffect(() => {
        
    let unsubscribe = auth.onAuthStateChanged(function(user) {
        if (!user) {
          return navigation.replace('Connexion')
        } 
      });
    return unsubscribe
}, [])


    useEffect(() => {
      (async () => {
        if (Platform.OS !== 'web') {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
      })();
    }, []);

    const save = async () => { 
      try {
        let userMemo = JSON.stringify(userDB)
          await AsyncStorage.setItem("userDB", userMemo)
      }catch (err) {
          alert(err)
      }
  }

  useEffect(() => {
    save()
  }, [])


  useEffect(() => {
    const toolOnAir = () => {
      return db.collection('hotels')
        .doc(userDB.hotelId)
        .collection("chat")
        .where("title", "==", user.displayName)
    }

    let unsubscribe = toolOnAir().onSnapshot(function(snapshot) {
                const snapInfo = []
              snapshot.forEach(function(doc) {          
                snapInfo.push({
                    id: doc.id,
                    ...doc.data()
                  })        
                });
                console.log(snapInfo)
                setChatResponse(snapInfo)
            });
            return unsubscribe
 },[])



const Logout = () => {
  auth.signOut()
  //serviceWorkerRegistration.unregister()
}
    
const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  console.log(result);

  if (!result.cancelled) {
    setImg(result.uri);
    setUpdatePhoto(true)    
  }

};

const onChange = (event, selectedDate) => {
  const currentDate = selectedDate || date;
    setShowDate(Platform.OS === 'ios');
    setDate(currentDate);
    if(userDB.checkoutDate !== moment(currentDate).format('L')) {
    setUpdateCheckout(true)
    }    
};

const handleLoadUserDB = async () => {
  const doc = await db.collection('guestUsers')
    .doc(user.uid)
    .get();
  if (doc.exists) {
    setUserDB(doc.data());
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}

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

const handleChangeRoom = async() => {
  await db.collection('guestUsers')
    .doc(user.uid)
    .update({
      room: room,
    })

  showMessage({
    message: t('message_actualisation_chbre'),
    type: "success"
  })

  return handleLoadUserDB()
  .then(() => {
    setRoom(null)
    setUpdateRoom(false)
  })
}

const handleChangeRoomChat = () => {
  return db.collection('hotels')
      .doc(userDB.hotelId)
      .collection('chat')
      .doc(userDB.username)
      .update({
        room: room 
    })  
}

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
      

const handleCheckoutDateChange = async() => {
  await db.collection('guestUsers')
  .doc(user.uid)
  .update({
    checkoutDate: moment(date.timestamp).format('L')
  })

  await showMessage({
    message: t('message_actualisation_checkout'),
    type: "success",
  })

  return handleLoadUserDB()     
}

const handleChangeCheckoutDateChat = () => {
  return db.collection('hotels')
      .doc(userDB.hotelId)
      .collection('chat')
      .doc(userDB.username)
      .update({
        checkoutDate: moment(date.timestamp).format('L') 
    })  
}

const fadeAnim = useRef(new Animated.Value(-500)).current;

const fadeIn = () => {
  Animated.timing(fadeAnim, {
    toValue: 0,
    duration: 500,
  }).start();
};

const fadeOut = () => {
  Animated.timing(fadeAnim, {
    toValue: -500,
    duration: 500,
  }).start();
};

const updateAdminSpeakStatus = () => {
if(chatResponse.length > 0) {
  return db.collection('hotels')
      .doc(userDB.hotelId)
      .collection('chat')
      .doc(user.displayName)
      .update({
          hotelResponding: false,
      }) 
  }     
}

const inChat = () => {
  if(chatResponse.length > 0) {
    return db.collection("hotels")
        .doc(userDB.hotelId)
        .collection('chat')
        .doc(user.displayName)
        .update({isChatting: true}) 
  } 
}

const handleNavigate = (feature) => {
  if(userDB.room) {
    return navigation.navigate(feature)
  }else{
    return showMessage({
      message: "Vous devez renseigner votre numéro de chambre pour accéder à cette fonctionnalité.",
      type: "danger"
    })
  }
}

const handlePlatformDate = () => {
  return (
      <ModalWeb 
      animationType="slide"
      isVisible={showDate} 
      style={styles.roomBoxView}
      transparent={true}
      onBackdropPress={() => setShowDate(false)}
      >
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
                  }}>{t('date_checkout')}</Text>
          <Calendar
              minDate={new Date()} 
              renderArrow={(direction) => direction === 'left' ? <AntDesign name="left" size={24} /> : <AntDesign name="right" size={24} />}                            
              pastScrollRange={0}
              onDayPress={(day) => {
                setDate(day)
                setUpdateCheckout(true)
              setShowDate(false)}} />
      </View>
  </ModalWeb>
  )  
}

const handleLinkWebsite = async() => {
  return WebBrowser.openBrowserAsync(userDB.website)
}

useEffect(() => {
  if(userDB.newConnection && userDB.website !== "none") {
    setShowWebsite(true)
  }
}, [])


const handleNewwConnection = () => {
  return db.collection("guestUsers")
         .doc(user.uid)
         .update({newConnection: false})
}

useEffect(() => {  
  const newJourneyId = `${userDB.hotelId}${Date.now()}`

  const journeySettings = async() => {
    await db.collection("guestUsers")
    .doc(user.uid)
    .collection('journey')
    .doc(newJourneyId)
    .set({
        markup: Date.now(),
        date: moment(new Date()).format('LL'),
        housekeeping: [],
        cab: [],
        roomChange: [],
        maintenance: [],
        clock: [],
        hotelId: userDB.hotelId
    })

    return db.collection('guestUsers')
        .doc(user.uid)
        .update({
          journeyId: newJourneyId
        })
  }
     
  if(userDB.journeyId === "") {
    journeySettings()
    .then(() => {
      return handleLoadUserDB()
    })
  }

}, [userDB.journeyId])

const handleCloseConciergePanel = () => setConciergePanel(false)

console.log("userDB", userDB)
   
if(isForegrounding) {
  return <View style={{width: '100%', height: '100%', flex: 1, flexDirection: "column", justifyContent: "center", alignItems: 'center'}}>
    <Image id="flag" 
    source={require('../../assets/playstore.png')} 
    />
  </View>
}else{
  return (
    <KeyboardAvoidingView style={styles.container}>
        <StatusBar style="light" />
        <View style={{flex: 2, width: "100%"}}>
          {user.photoURL ? <ImageBackground source={{uri: user.photoURL}} style={styles.image}>
          <TouchableOpacity style={{padding: 15}} onPress={pickImage}>
                <MaterialIcons name="add-a-photo" size={35} color="grey" />                    
              </TouchableOpacity>
          </ImageBackground> : 
          <ImageBackground source={require('../../img/avatar-client.png')} style={styles.image}>
            <TouchableOpacity style={{padding: 15}} onPress={pickImage}>
                <MaterialIcons name="add-a-photo" size={35} color="grey" />                    
              </TouchableOpacity>  
          </ImageBackground>}
        </View>
        <View style={{flexDirection: "column", width: "100%", padding: 10, alignItems: "center"}}>
          <Text style={{fontSize: 30, fontWeight: "bold"}}>{user.displayName}</Text>
          <View style={{flexDirection: "row", justifyContent: "center", width: "90%", marginBottom: 20, borderBottomColor: "lightgray", borderBottomWidth: 1, paddingBottom: 10}}>
            <Text style={{fontSize: 15, fontWeight: "bold", color: "gray"}}>{userDB.email}</Text>
            <TouchableOpacity activeOpacity={0.5} onPress={() => setUpdateMail(true)}>
              <Ionicons name="pencil-outline" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={{fontSize: 15, marginBottom: userDB.website !== "none" ? 0 : 30, fontWeight: "bolder"}}>{userDB.hotelName}</Text>
          {userDB.website !== "none" ? <TouchableOpacity onPress={handleLinkWebsite}>
            <Text style={{
                    width: "100%", 
                    fontSize: 12,
                    marginBottom: 20,
                    textAlign: "center",
                    fontWeight: "bold",
                    }}>
                      <Fontisto name="world" size={15} color="black" style={{marginRight: 5}} />
                      {t("website")}
            </Text>
          </TouchableOpacity> : <></>}
          <View style={{flexDirection: "row", justifyContent: userDB.room ? "space-around" : "center", mawWidth: "90%"}}>
          {userDB.room ? <Text style={{fontSize: 15, marginBottom: 10}}>{t('occupation_chbre')} {userDB.room}</Text> : <TouchableOpacity activeOpacity={0.5} onPress={() => setUpdateRoom(true)}><Text style={{fontSize: 12, marginBottom: 10, fontWeight: "bolder", width: "100%", textAlign: "center"}}>{t('enter_room_number')}</Text></TouchableOpacity>}
            {userDB.room ? <TouchableOpacity activeOpacity={0.5} onPress={() => setUpdateRoom(true)}>
              <Ionicons name="pencil-outline" size={20} color="black" />
            </TouchableOpacity> : null}
          </View>
          <View style={{flexDirection: "row", justifyContent: "space-around", mawWidth: "90%", marginBottom: "5%"}}>
            <Text style={{fontSize: 14, marginBottom: 20}}>{t('checkout_prevu')} {userDB.checkoutDate}</Text>
            <TouchableOpacity activeOpacity={0.5} onPress={() => {setShowDate(true)}}>
              <Ionicons name="pencil-outline" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <Filter effects={{"drop-shadow": "1px 2px 3px"}} style={{width: "100%"}}>
            <View style={{
              flexDirection: "row", 
              alignItems: "center",
              justifyContent: "space-around", 
              width: "100%", 
              borderColor: "transparent", 
              backgroundColor: "whitesmoke",
              borderWidth: "1px",
              borderRadius: 30,
              padding: "2%",
              marginBottom: "5%"}}>
              <TouchableOpacity style={{flexDirection: "row"}} activeOpacity={0.5} onPress={() => {
                if(userDB.notificationStatus === "default" && !isSafari) {
                  setShowModalNotification(true)
                }else{
                  navigation.navigate('Chat')
                  updateAdminSpeakStatus()
                  inChat()
                }
                }}>
                <Entypo name="chat" size={30} color="black" /> 
                {chatResponse.map(response => {
                  if(response.hotelResponding) {
                    return <ChatNotification />
                  } 
                })}                   
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5}  onPress={() => handleNavigate('Délogement')}>
                <MaterialIcons name="room-preferences" size={35} color={userDB.room ? "black" : "gray"} />                
            </TouchableOpacity>            
            <TouchableOpacity activeOpacity={0.5}  onPress={() => handleNavigate('Maintenance')}>
              <Octicons name="tools" size={25} color={userDB.room ? "black" : "gray"} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5}  onPress={() => handleNavigate('Réveil')}>
              <Ionicons name="alarm" size={35} color={userDB.room ? "black" : "gray"} />
            </TouchableOpacity>           
            <TouchableOpacity activeOpacity={0.5}  onPress={() => handleNavigate('Taxi')}>
              <FontAwesome5 name="taxi" size={35} color={userDB.room ? "black" : "gray"} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5}  onPress={() => {
              setConciergePanel(true)
              fadeIn()}}>
              <MaterialCommunityIcons name="broom" size={35} color={userDB.room ? "black" : "gray"} />
            </TouchableOpacity>
            </View>
          </Filter>

          {conciergePanel && <ClickNwaitDrawer fadeAnim={fadeAnim} fadeOut={fadeOut} closePanel={handleCloseConciergePanel} navigation={navigation} />}
        </View>

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
                  borderRadius: 5,
                  textAlign: "center", 
                  backgroundColor: "lightblue"
                  }}>{t('actualisation_email')}</Text>
            <View style={styles.inputContainer}>
              <Input placeholder={t('email')} type="email" value={email} style={{textAlign: "center"}}
              onChangeText={(text) => setEmail(text)} />
            </View>
            <Button title={t('actualiser')} containerStyle={{width: "90%", borderRadius: 20, marginBottom: 15, marginTop: 15}} onPress={handleChangeEmail} />
          </View>
        </ModalWeb>

        <ModalWeb 
          animationType="slide"
          style={styles.roomBoxView}                
          transparent={true} 
          isVisible={updateRoom} 
          onBackdropPress={() => {
            setUpdateRoom(false)
            setRoom(null)}}>
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
                  }}>{t('actualisation_chbre')}</Text>
            <View style={styles.inputContainer}>
              <Input placeholder={t('num_chbre')} type="number" value={room} style={{textAlign: "center"}} 
              onChangeText={(text) => setRoom(text)} />
            </View>
            <Button title={t('actualiser')} containerStyle={{width: "90%", borderRadius: 20, marginBottom: 15, marginTop: 15}} onPress={() => {
              handleChangeRoom()
              handleChangeRoomChat()
              }} />
          </View>
        </ModalWeb>

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

        <ModalWeb 
          animationType="slide" 
          style={styles.roomBoxView}
          transparent={true}  
          isVisible={updateCheckout} 
          onBackdropPress={() => setUpdateCheckout(false)}>
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
                  }}>{t('message_confirmation_actualisation_checkout')}</Text>
            <Button title={t('confirmer')} containerStyle={{width: "90%", borderRadius: 20, marginBottom: 15, marginTop: 15}} onPress={() => {
              handleCheckoutDateChange()
              handleChangeCheckoutDateChat()
              setUpdateCheckout(false)
            }} />
          </View>
        </ModalWeb>

        {showDate && handlePlatformDate()}

        <ModalWeb 
          animationType="slide"
          transparent={true}
          isVisible={showModalNotification} 
          style={styles.roomBoxView}
          onBackdropPress={() => {
            setShowModalNotification(false)
            pushNotificationSubscription(user.uid, navigation, handleLoadUserDB)}}>
              <View style={styles.modalRoom2}>
                  <Text style={{
                      width: "100%", 
                      fontSize: 20,
                      paddingBottom: 10,
                      textAlign: "center",
                      fontWeight: "bold",
                      paddingTop: 10,
                      }}><AntDesign name="infocirlce" size={15} color="black" style={{marginRight: 15}} />
                      {t('chat_push_notification')}</Text>
                      <Text style={{textAlign: "center", marginBottom: 10}}>{t('message_push_notification')}</Text>
              </View>
          </ModalWeb>

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
                        <ImageBackground source={ require('../../img/booking-shadow.png') } style={{
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
                              handleNewwConnection()}} />
                        </View>
              </View>
          </ModalWeb>

    </KeyboardAvoidingView>
  )
}
    
}

export default UserProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white", 
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  button: {
    width: "100%",
    marginTop: 10,
  },
  button2: {
    width: "100%",
    marginTop: 10,
    borderRadius: 30
  },
  inputContainer: {
    width: 300,
    textAlign: "center"
  },
  img: {
      width: 40,
      height: 40,
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
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
