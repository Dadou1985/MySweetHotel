import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons'; 
import { auth, db, storage } from "../../firebase"
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants'
import { showMessage, hideMessage } from "react-native-flash-message";
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { AntDesign } from '@expo/vector-icons';
import { UserContext } from '../components/userContext'
import globalStyle from '../utils/globalStyle';

const Register = ({ navigation, route }) => {
    const { t } = useTranslation()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")
    const [userId, setUserId] = useState("")
    const [img, setImg] = useState(null)
    const [url, setUrl] = useState("")
    const [language, setLanguage] = useState(i18next.language)
    const [gender, setGender] = useState("male")
    const [guestCategory, setGuestCategory] = useState("tourisme")
    const [guestCategoryClone, setGuestCategoryClone] = useState(null)
    const [registrationStatus, setRegistrationStatus] = useState("pending")

    const {userDB, setUserDB} = useContext(UserContext)
    const { hotelLogo, currentHotelId } = route.params
  

    useLayoutEffect(() => {
      navigation.setOptions({
          title: "Inscription",
          headerBackTitleVisible: false,
          headerTitleAlign: "right",
          headerBackground: () => (
            <View style={globalStyle.headerShadow} />
          ),
          headerTitle: () =>(
              <View style={[{flexDirection: "row", alignItems: "center"}, globalStyle.shadow]}>
                  <Text style={{ color: "#B8860B", fontWeight : "bold", fontSize: 20}}>{t('inscription_titre')}</Text>
              </View>
          ),
          headerLeft: () => (
              <TouchableOpacity onPress={() => {
              navigation.navigate("Connexion")}}>
                  <AntDesign name="left" size={24} color="#B8860B" style={{marginLeft: 5}} />
              </TouchableOpacity>
          )
      })
  }, [navigation])

  const freeRegister = async (userId, photo) => {
    try {
      await db.collection('guestUsers')
      .doc(userId)
      .set({
        username: name,
        email: email.trim(),
        password: password,
        language: language,
        lastTimeConnected: Date.now(),
        userId: userId,
        localLanguage: i18next.language,
        checkoutDate: "",
        gender: gender,
        guestCategory: guestCategory,
        guestCategoryClone: guestCategoryClone !== null ? guestCategoryClone : t("tourisme"),
        notificationStatus: "default",
        photo: photo ? photo : null
      })  
      return setRegistrationStatus("accomplished")
    }catch (e) {
      throw new Error()
    }
  }

  useEffect(() => {
    let unsubscribe = auth.onAuthStateChanged(function(user) {
        if (user) {
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
            return navigation.navigate('Information', { hotelLogo: hotelLogo, currentHotelId: currentHotelId })
          })     
        } 
      });
    return unsubscribe
  }, [registrationStatus])

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
    
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.canceled) {
        setImg(result.uri);
        showMessage({
          message: t('photo_selectionnee_message'),
          type: "info",
        })
      }
    }catch (e) {
      throw new Error()
    }
  };

  const handleChangePhotoUrl = async(event) => {
    try {
      event.preventDefault()
      const response = await fetch(img)
      const blob = await response.blob()
      
      const uploadTask = storage.ref(`msh-photo-user/${name}`).put(blob)
      uploadTask.on(
        "state_changed",
        snapshot => {},
        error => {console.log(error)},
        () => {
          storage
            .ref("msh-photo-user")
            .child(name)
            .getDownloadURL()
            .then(url => {
              const uploadTask = () => {
                  auth.createUserWithEmailAndPassword(email.trim(), password)
                      .then((authUser) => {
                          authUser.user.updateProfile({
                              photoURL: url,
                              displayName: name
                          })
                        freeRegister(authUser.user.uid, url)
                      })
              }
                return setUrl(url, uploadTask())})
        }
      )
    }catch(err) {
      throw new Error()
    }
  } 

  const handleAuthRegister = () => {
    try {
      auth.createUserWithEmailAndPassword(email.trim(), password)
      .then((authUser) => {
          authUser.user.updateProfile({
              displayName: name
          })
        freeRegister(authUser.user.uid)
      })
    }catch(err) {
      throw new Error()
    }
  }

  console.log("$$$$$$", img)

  return (
      <KeyboardAvoidingView style={styles.container}>
          <StatusBar style="light" />
          <View style={styles.containerText}>
              {hotelLogo ? <Image source={{uri: hotelLogo}} style={{width: 150, height: 100, marginBottom: 20}} /> : <Image source={require('../../img/new-logo-msh.png')} style={{width: 150, height: 100, marginLeft: 20, resizeMode: "contain"}} />}
              <Text style={styles.text}>{t("creation_compte")}</Text>
          </View>    
          <View style={styles.inputContainer}>
          <View style={{marginBottom: 20, flexDirection: "column", alignItems: "center"}}>
              <View style={{flexDirection: "row", width: 400, justifyContent: "center", marginTop: 15}}>
                  <Button 
                  containerStyle={styles.typeButton} 
                  buttonStyle={{backgroundColor: gender === "male" && "black"}}
                  title={t("male")} type={gender === "male" ? "solid" : "clear"} 
                  titleStyle={{color: gender === "male" ? "#B8860B" : "black"}}
                  raised={true} 
                  onPress={() => setGender("male")} />
                  <Button 
                  containerStyle={styles.typeButton} 
                  buttonStyle={{backgroundColor: gender === "female" && "black"}}
                  title={t("female")} type={gender === "female" ? "solid" : "clear"} 
                  titleStyle={{color: gender === "female" ? "#B8860B" : "black"}}
                  raised={true} 
                  onPress={() => setGender("female")} />
              </View>
            </View>
              <Input style={{ outline: "none", borderBottomColor: "#B8860B", borderBottomWidth: 1 }} placeholder={t("nom")} autofocus type="text" value={name} 
              onChangeText={(text) => setName(text)} />
              <Input style={{ outline: "none", borderBottomColor: "#B8860B", borderBottomWidth: 1 }} placeholder={t("email")} type="email" value={email} 
              onChangeText={(text) => setEmail(text)} />
              <Input style={{ outline: "none", borderBottomColor: "#B8860B", borderBottomWidth: 1 }} placeholder={t("mot_de_passe")} secureTextEntry type="password" value={password} 
              onChangeText={(text) => setPassword(text)} />
              <Input style={{ outline: "none", borderBottomColor: "#B8860B", borderBottomWidth: 1 }} placeholder={t("confirmation_mdp")} secureTextEntry type="password" value={confirmPassword} 
              onChangeText={(text) => setConfirmPassword(text)}  />
              <View style={{marginBottom: "5vh", flexDirection: "column", alignItems: "center"}}>
                <View style={{flexDirection: "row", width: 400, justifyContent: "center", marginBottom: 10, marginTop: 10}}>
                    <Button 
                    containerStyle={styles.typeButton} 
                    buttonStyle={{backgroundColor: guestCategory === "tourisme" && "black"}}
                    title={t("tourisme")} 
                    titleStyle={{color: guestCategory === "tourisme" ? "#B8860B" : "black"}}
                    type={guestCategory === "tourisme" ? "solid" : "clear"} 
                    raised={true} 
                    onPress={() => {
                      setGuestCategory("tourisme")
                      setGuestCategoryClone(t("tourisme"))
                    }}
                onSubmitEditing={freeRegister} />
                    <Button 
                    containerStyle={styles.typeButton} 
                    buttonStyle={{backgroundColor: guestCategory === "business" && "black"}}
                    title={t("business")} 
                    titleStyle={{color: guestCategory === "business" ? "#B8860B" : "black"}}
                    type={guestCategory === "business" ? "solid" : "clear"} 
                    raised={true} 
                    onPress={() => {
                      setGuestCategory("business")
                      setGuestCategoryClone(t("business"))
                    }}
                onSubmitEditing={freeRegister} />
                </View>
              </View>
          </View>
          {img === null && <View style={{marginBottom: "8vh"}}>
              <TouchableOpacity style={{flexDirection: "row wrap", width: 300, alignItems: "center", justifyContent: "center"}} onPress={pickImage}>
              <MaterialIcons name="add-a-photo" size={24} color="black" />                    
              <Text style={{fontSize: 20, color: "black", marginTop: 5}}>{t("ajout_photo_profil")}</Text>
              </TouchableOpacity>
          </View>}
          <Button 
          containerStyle={styles.button2} 
          buttonStyle={{backgroundColor: "#B8860B"}} 
          titleStyle={{color: "black"}}
          title={t("creation_compte")} 
          onPress={(event) => {
            if(name !== "" && email !== "" && password !== "" && confirmPassword !== "" && password === confirmPassword) {
              if(img !== null) {
                handleChangePhotoUrl(event)
              }else{
                handleAuthRegister()
              }
            }else{
              if(password !== confirmPassword) {
                setTimeout(() => {
                  showMessage({
                      message: t('conf_mdp_error'),
                      type: "danger",
                    })
              }, 1000)
              }else{
                setTimeout(() => {
                  showMessage({
                      message: t('register_error'),
                      type: "danger",
                    })
              }, 1000)
              }
            }
              }} />
          <Button 
          onPress={() => navigation.navigate('Connexion')} 
          containerStyle={styles.button} 
          title={t("connection")} 
          titleStyle={{color: "#B8860B"}}
          type="clear" />
      </KeyboardAvoidingView>
  )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "white",
    },
    containerText: {
        marginBottom: 20,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 30,
        textAlign: "center",
        borderBottomColor: "#B8860B",
        borderBottomWidth: 1
    },
    inputContainer: {
        width: 300
    },
    button: {
        width: 200,
        marginBottom: 30,
        borderRadius: 30,
        borderColor: "#B8860B", borderWidth: 1
    },
    button2: {
        width: 200,
        borderRadius: 30,
        marginBottom: 10,
        borderColor: "#B8860B", borderWidth: 1,        
        filter: "drop-shadow(1px 1px 1px)"
    },
    typeButton: {
      width: 125,
      marginTop: 10,
      borderColor: "white",
      marginLeft: 5,
      marginRight: 5 
  }
})
