import React, { useState, useEffect, useLayoutEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
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


const Register = ({ navigation }) => {
    const { t } = useTranslation()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")
    const [userId, setUserId] = useState("")
    const [img, setImg] = useState(null)
    const [url, setUrl] = useState("")
    const [language, setLanguage] = useState(i18next.language)
    const [gender, setGender] = useState(t("male"))
    const [guestCategory, setGuestCategory] = useState(t("tourisme"))
  

    useLayoutEffect(() => {
      navigation.setOptions({
          title: "Inscription",
          headerBackTitleVisible: false,
          headerTitleAlign: "right",
          headerTitle: () =>(
              <View style={{flexDirection: "row", alignItems: "center"}}>
                  <Text style={{ color: "black", fontWeight : "bold", fontSize: 20}}>{t('inscription_titre')}</Text>
              </View>
          ),
          headerLeft: () => (
              <TouchableOpacity onPress={() => {
              navigation.navigate("Connexion")}}>
                  <AntDesign name="left" size={24} color="black" style={{marginLeft: 5}} />
              </TouchableOpacity>
          )
      })
  }, [navigation])

    const freeRegister = (userId) => {
        return db.collection('guestUsers')
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
          guestCategory: guestCategory
        })  
      }

      useEffect(() => {
        let unsubscribe = auth.onAuthStateChanged(function(user) {
            if (user) {
              return db.collection('guestUsers')
              .doc(userId)
              .get()
              .then((doc) => {
                  if (doc.exists) {
                  setUserDB(doc.data())
                  } else {
                      // doc.data() will be undefined in this case
                      console.log("No such document!");
                  }
              }).then(() => {
                return navigation.navigate('Information')
              })     
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
      }
    };

      const handleChangePhotoUrl = async(event) => {
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
                          freeRegister(authUser.user.uid)
                        })
                }
                  return setUrl(url, uploadTask())})
          }
        )
      } 

      const handleAuthRegister = () => {
        auth.createUserWithEmailAndPassword(email.trim(), password)
          .then((authUser) => {
              authUser.user.updateProfile({
                  displayName: name
              })
            freeRegister(authUser.user.uid)
          })
      }

      console.log("$$$$$$", img)

    return (
        <KeyboardAvoidingView style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.containerText}>
                <Image source={require('../../img/new-mini-logo-msh.png')} style={{width: 150, height: 100}} />
                <Text style={styles.text}>{t("creation_compte")}</Text>
            </View>    
            <View style={styles.inputContainer}>
            <View style={{marginBottom: 20, flexDirection: "column", alignItems: "center"}}>
                <View style={{flexDirection: "row", width: 400, justifyContent: "center", marginTop: 15}}>
                    <Button containerStyle={styles.typeButton} title={t("male")} type={gender === t("male") ? "solid" : "clear"} raised={true} onPress={() => setGender(t("male"))} />
                    <Button containerStyle={styles.typeButton} title={t("female")} type={gender === t("female") ? "solid" : "clear"} raised={true} onPress={() => setGender(t("female"))} />
                </View>
              </View>
                <Input placeholder={t("nom") + "*"} autofocus type="text" value={name} 
                onChangeText={(text) => setName(text)} />
                <Input placeholder={t("email") + "*"} type="email" value={email} 
                onChangeText={(text) => setEmail(text)} />
                <Input placeholder={t("mot_de_passe") + "*"} secureTextEntry type="password" value={password} 
                onChangeText={(text) => setPassword(text)} />
                <Input placeholder={t("confirmation_mdp") + "*"} secureTextEntry type="password" value={confirmPassword} 
                onChangeText={(text) => setConfirmPassword(text)}  />
                <View style={{marginBottom: 20, flexDirection: "column", alignItems: "center"}}>
                  <View style={{flexDirection: "row", width: 400, justifyContent: "center", marginBottom: 25}}>
                      <Button containerStyle={styles.typeButton} title={t("tourisme")} type={guestCategory === t("tourisme") ? "solid" : "clear"} raised={true} onPress={() => setGuestCategory(t("tourisme"))}
                  onSubmitEditing={freeRegister} />
                      <Button containerStyle={styles.typeButton} title={t("business")} type={guestCategory === t("business") ? "solid" : "clear"} raised={true} onPress={() => setGuestCategory(t("business"))}
                  onSubmitEditing={freeRegister} />
                  </View>
                </View>
            </View>
            <View style={{marginBottom: 45}}>
                <TouchableOpacity style={{flexDirection: "row", width: 300, alignItems: "center", justifyContent: "center"}} onPress={pickImage}>
                <MaterialIcons name="add-a-photo" size={24} color="grey" />                    
                <Text style={{fontSize: 20, color: "grey", marginLeft: 10}}>{t("ajout_photo_profil")}</Text>
                </TouchableOpacity>
            </View>
            <Button raised={true} onPress={() => navigation.navigate('Connexion')} containerStyle={styles.button} title={t("connection")} type="clear" />
            <Button raised={true} containerStyle={styles.button} title={t("creation_compte")} onPress={(event) => {
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
        </KeyboardAvoidingView>
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10
    },
    containerText: {
        marginBottom: 30,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 30,
        textAlign: "center"
    },
    inputContainer: {
        width: 300
    },
    button: {
        width: 200,
        marginTop: 10,
        borderRadius: 30

    },
    typeButton: {
      width: 125,
      marginTop: 10,
      borderColor: "white",
      marginLeft: 5,
      marginRight: 5 
  }
})
