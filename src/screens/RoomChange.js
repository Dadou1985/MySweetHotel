import React, { useState, useContext, useEffect, useLayoutEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons'; 
import { UserContext } from '../components/userContext'
import { auth, db, storage } from "../../firebase"
import * as ImagePicker from 'expo-image-picker';
import { showMessage, hideMessage } from "react-native-flash-message";
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { AntDesign } from '@expo/vector-icons';

const RoomChange = ({ navigation }) => {
    const [type, setType] = useState("")
    const [details, setDetails] = useState("")
    const [user, setUser] = useState(auth.currentUser)
    const {userDB, setUserDB} = useContext(UserContext)
    const [img, setImg] = useState(null)
    const [url, setUrl] = useState("")

    const { t } = useTranslation()

    useLayoutEffect(() => {
      navigation.setOptions({
          title: "RoomChange",
          headerBackTitleVisible: false,
          headerTitleAlign: "right",
          headerTitle: () =>(
              <View style={{flexDirection: "row", alignItems: "center"}}>
                  <MaterialIcons name="room-preferences" size={24} color="black" />                
                  <Text style={{ color: "black", fontWeight : "bold", fontSize: 20, marginLeft: 5}}>{t('delogement')}</Text>
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
          showMessage({
            message: t('photo_selectionnee_message'),
            type: "info",
          })
        }
      };
  

      const handleChangePhotoUrl = async(event) => {
        event.preventDefault()
        const response = await fetch(img)
        const blob = await response.blob()

        const uploadTask = storage.ref(`msh-photo-roomChange/${type}`).put(blob)
        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {console.log(error)},
          () => {
            storage
              .ref("msh-photo-roomChange")
              .child(type)
              .getDownloadURL()
              .then(url => {
                const uploadTask = () => {
                    setType('')
                    setDetails('')

                   return db.collection("hotel")
                    .doc(userDB.hotelId)
                    .collection('roomChange')
                    .add({
                        author: "effectué par le client",
                        date: new Date(),
                        client: user.displayName,
                        fromRoom: userDB.room,
                        toRoom: "",
                        state: "",
                        reason: type,
                        details: details,
                        markup: Date.now(),
                        img: url,
                        status: true,
                        userId: userDB.userId
                    }).then(function(docRef){
                        console.log(docRef.id)
                    }).catch(function(error) {
                        console.error(error)
                    })
                }
                  return setUrl(url, uploadTask())})
          }
        )
      } 

    const handleSubmit = (event) => {
      event.preventDefault()
      setType('')
      setDetails('')
      return db.collection("hotel")
              .doc(userDB.hotelId)
              .collection('roomChange')
              .add({
                  author: "effectué par le client",
                  date: new Date(),
                  client: user.displayName,
                  fromRoom: userDB.room,
                  toRoom: "",
                  state: "",
                  reason: type,
                  details: details,
                  markup: Date.now(),
                  img: url,
                  status: true,
                  userId: userDB.userId
              }).then(function(docRef){
                  console.log(docRef.id)
              }).catch(function(error) {
                  console.error(error)
              })
    } 

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
             <StatusBar style="light" />
            <View style={styles.containerText}>
            <ImageBackground source={ require('../../img/pic_roomChange.png') } style={{
                flex: 1,
                width: "100%"}}>
                </ImageBackground>
            </View>
            <View style={styles.inputContainer}>
                <Input placeholder={t('motif_delogement')} type="text" value={type} 
                onChangeText={(text) => setType(text)} />
                <Input placeholder={t('details')}  type="text" value={details} 
                onChangeText={(text) => setDetails(text)} />
            </View>
            <View style={{marginBottom: 55}}>
                <TouchableOpacity style={{flexDirection: "row", width: 300, alignItems: "center", justifyContent: "center"}} onPress={pickImage}>
                <MaterialIcons name="add-a-photo" size={24} color="grey" />                    
                <Text style={{fontSize: 20, color: "grey", marginLeft: 10}}>{t('ajout_photo')}</Text>
                </TouchableOpacity>
            </View>
            <Button raised={true} onPress={(event) => {
              if(img !== null) {
                  handleChangePhotoUrl(event)
                  showMessage({
                    message: t('delogement_message_succes'),
                    type: "success"
                })
              }else{
                handleSubmit(event)
                showMessage({
                  message: t('delogement_message_succes'),
                  type: "success"
                })
              }
            }} containerStyle={styles.button} title={t('delogement_bouton')} />
        </KeyboardAvoidingView>
    )
}

export default RoomChange

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
    },
    containerText: {
      flex: 2,
      width: "100%",
    },
    text: {
        fontSize: 30,
        textAlign: "center",
        color: "white"
    },
    inputContainer: {
        width: "80%",
        marginTop: 100, 

    },
    button: {
        width: 200,
        marginTop: 10, 
        marginBottom: 90,
        borderColor: "white" 
    },
    img: {
        width: 70,
        height: 70,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }
})

