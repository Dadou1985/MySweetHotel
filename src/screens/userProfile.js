import React, { useLayoutEffect, useState, useContext, useEffect, useRef } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, Animated, Modal, Platform, AppState } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Entypo, MaterialIcons, SimpleLineIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { auth, db, storage } from "../../firebase"
import { UserContext } from '../components/userContext'
import moment from 'moment'
import 'moment/locale/fr';
import { Button, Input, Overlay } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { showMessage } from "react-native-flash-message";
import ClickNwaitDrawer from '../components/ClickNwaitDrawer';
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatNotification from '../components/chatNotification'
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

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
    const [reloadPhotoURLIos, setReloadPhotoURLIos] = useState(false)
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const [isForegrounding, setIsForegrounding] = useState(false)

    const Logout = () => {
      auth.signOut()
  }

  const { t } = useTranslation()

  useLayoutEffect(() => {
      navigation.setOptions({
          title: "My Sweet Hotel",
          headerBackTitleVisible: false,
          headerTitleAlign: "right",
          headerTitle: () =>(
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <Image source={require('../../img/new-mini-logo-msh.png')} style={{width: 80, height: 60, marginTop: 15}} />
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
      })
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

      await showMessage({
        messsage: t('message_actualisation_email'),
        type: "success"
      })

      return handleLoadUserDB()
      .then(() => {
        setEmail("")
        setUpdateMail(false)
      })
  }

    const handleSubmit = async() => {
      await db.collection('guestUsers')
        .doc(user.uid)
        .update({
          room: room,
        })

      await showMessage({
        messsage: t('message_actualisation_chbre'),
        type: "success"
      })

      return handleLoadUserDB()
      .then(() => {
        setRoom(null)
        setUpdateRoom(false)
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
        checkoutDate: moment(date).format('L')
      })

      await showMessage({
        message: t('message_actualisation_checkout'),
        type: "success",
      })

      return handleLoadUserDB()     
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

    useEffect(() => {
      const toolOnAir = () => {
        return db.collection('hotel')
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

   const updateAdminSpeakStatus = () => {
    return db.collection('hotel')
          .doc(userDB.hotelId)
          .collection('chat')
          .doc(user.displayName)
          .update({
              hotelResponding: false,
          })      
  }

  const tomorrow = Date.now() + 86400000

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
                        minimumDate={new Date()}
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
                    minimumDate={tomorrow}
                    display="default"
                    onChange={onChange}
                />
            </View>
        )
    }
}

useEffect(() => {
  (() => registerForPushNotificationsAsync())()
}, [])

const registerForPushNotificationsAsync = async() => {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (token) {
      const res = await db.collection("guestUsers")
          .doc(user.uid)
          .update({token: token})
      return handleLoadUserDB()
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

useEffect(() => {
  if(Platform.OS === 'ios') {
    AppState.addEventListener('change', _handleAppStateChange);
  }

  return () => {
    AppState.removeEventListener('change', _handleAppStateChange);
  };
}, []);

const _handleAppStateChange = (nextAppState) => {
  if (
    appState.current.match(/inactive|background/) &&
    nextAppState === 'active'
  ) {
    setTimeout(() => {
      setIsForegrounding(false)
    }, 3000);
    navigation.replace('My Sweet Hotel')
  }else{
    setIsForegrounding(true)
  }

  appState.current = nextAppState;
  setAppStateVisible(appState.current);
  console.log('AppState', appState.current);
};

console.log("photoURL", reloadPhotoURLIos)
   
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
          <View style={{flexDirection: "row", justifyContent: "space-around", mawWidth: "90%", marginBottom: 20}}>
            <Text style={{fontSize: 15, fontWeight: "bold"}}>{userDB.email}</Text>
            <TouchableOpacity activeOpacity={0.5} onPress={() => setUpdateMail(true)}>
              <Ionicons name="pencil-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={{fontSize: 20, marginBottom: 20}}>{userDB.hotelName}</Text>
          <View style={{flexDirection: "row", justifyContent: "space-around", mawWidth: "90%"}}>
          <Text style={{fontSize: 15, marginBottom: 10}}>{t('occupation_chbre')} {userDB.room}</Text>
            <TouchableOpacity activeOpacity={0.5} onPress={() => setUpdateRoom(true)}>
              <Ionicons name="pencil-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: "row", justifyContent: "space-around", mawWidth: "90%"}}>
            <Text style={{fontSize: 14, marginBottom: 20}}>{t('checkout_prevu')} {userDB.checkoutDate}</Text>
            <TouchableOpacity activeOpacity={0.5} onPress={() => {setShowDate(true)}}>
              <Ionicons name="pencil-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: "row", justifyContent: "space-around", width: "100%", marginTop: 25, marginBottom: 40}}>
            <TouchableOpacity style={{flexDirection: "row"}} activeOpacity={0.5} onPress={() => {
              navigation.navigate('Chat')
              updateAdminSpeakStatus()}}>
              <Entypo name="chat" size={40} color="black" /> 
              {chatResponse.map(response => {
                if(response.hotelResponding) {
                  return <ChatNotification userToken={userDB.token} />
                } 
              })}                   
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5}  onPress={() => navigation.navigate('Délogement')}>
                <MaterialIcons name="room-preferences" size={45} color="black" />                
            </TouchableOpacity>            
            <TouchableOpacity activeOpacity={0.5}  onPress={() => navigation.navigate('Maintenance')}>
                <Image source={{uri: "https://static.thenounproject.com/png/41655-200.png"}} style={styles.img} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5}  onPress={() => navigation.navigate('Réveil')}>
                <Image source={{uri: "https://image.flaticon.com/icons/png/512/62/62834.png"}} style={styles.img} />
            </TouchableOpacity>           
            <TouchableOpacity activeOpacity={0.5}  onPress={() => navigation.navigate('Taxi')}>
                <Image source={{uri: "https://cdn2.iconfinder.com/data/icons/car-11/100/taxi3-512.png"}} style={styles.img} />
            </TouchableOpacity>
          </View>
          <Button raised={true} title={t('conciergerie')} containerStyle={{width: 2000, position: "absolute", bottom: 0}} onPress={fadeIn} /> 
          <ClickNwaitDrawer fadeAnim={fadeAnim} fadeOut={fadeOut} navigation={navigation} />
        </View>

        <Overlay isVisible={updateMail} onBackdropPress={() => setUpdateMail(false)}>
          <View style={{width: "100%", flexDirection: "column", alignItems: "center", padding: 10}}>
            <Text style={{fontSize: 20, fontWeight: "bold", marginBottom: 20}}>{t('actualisation_email')}</Text>
            <View style={styles.inputContainer}>
              <Text>{t('email')}</Text>
              <Input placeholder={t('email')} type="email" value={email} 
              onChangeText={(text) => setEmail(text)} />
            </View>
            <Button title={t('actualiser')} containerStyle={styles.button} onPress={handleChangeEmail} />
          </View>
        </Overlay>

        <Overlay isVisible={updateRoom} onBackdropPress={() => setUpdateRoom(false)}>
          <View style={{width: "100%", flexDirection: "column", alignItems: "center", padding: 10}}>
            <Text style={{fontSize: 20, fontWeight: "bold", marginBottom: 20}}>{t('actualisation_chbre')}</Text>
            <View style={styles.inputContainer}>
              <Text>{t('num_chbre')}</Text>
              <Input placeholder={t('num_chbre')} type="number" value={room} 
              onChangeText={(text) => setRoom(text)} />
            </View>
            <Button title={t('actualiser')} containerStyle={styles.button} onPress={handleSubmit} />
          </View>
        </Overlay>

        <Overlay isVisible={updatePhoto} onBackdropPress={() => setUpdatePhoto(false)}>
          <View style={{width: "80%"}}>
            <Text style={{textAlign: "center", fontWeight: "bold", fontSize: 18, marginBottom: 15}}>{t('message_confirmation_actualisation_photo')}</Text>
            <Button title={t('confirmer')} style={{marginTop: 1, marginBottom: 1}} onPress={(event) => {
              handleChangePhotoUrl(event)
              setUpdatePhoto(false)
              showMessage({
                message: t('message_actualisation_photo'),
                type: "success",
              })
            }} />
          </View>
        </Overlay>

        <Overlay isVisible={updateCheckout} onBackdropPress={() => setUpdateCheckout(false)}>
          <View style={{width: "80%"}}>
            <Text style={{textAlign: "center", fontWeight: "bold", fontSize: 18, marginBottom: 15}}>{t('message_confirmation_actualisation_checkout')}</Text>
            <Button title={t('confirmer')} style={{marginTop: 1, marginBottom: 1}} onPress={() => {
              handleCheckoutDateChange()
              setUpdateCheckout(false)
            }} />
          </View>
        </Overlay>

        {showDate && handlePlatformDate()}

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
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },
  button: {
    width: 200,
    marginTop: 10,
    borderRadius: 3
  },
  inputContainer: {
    width: 300
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
})
