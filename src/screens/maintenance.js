import React, { useState, useContext, useEffect, useLayoutEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, Platform } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons'; 
import { UserContext } from '../components/userContext'
import { auth, db, storage, specialFirestoreOptions } from "../../firebase"
import * as ImagePicker from 'expo-image-picker';
import { showMessage, hideMessage } from "react-native-flash-message";
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { AntDesign, Octicons } from '@expo/vector-icons';
import ModalWeb from 'modal-enhanced-react-native-web';

const Maintenance = ({ navigation }) => {
    const [type, setType] = useState("")
    const [typeClone, setTypeClone] = useState("")
    const [details, setDetails] = useState("")
    const [user, setUser] = useState(auth.currentUser)
    const {userDB, setUserDB} = useContext(UserContext)
    const [img, setImg] = useState(null)
    const [url, setUrl] = useState("")
    const [showModal, setShowModal] = useState(false)

    const { t } = useTranslation()

    useLayoutEffect(() => {
      navigation.setOptions({
          title: "Maintenance",
          headerBackTitleVisible: false,
          headerTitleAlign: "right",
          headerTitle: () =>(
              <View style={{flexDirection: "row", alignItems: "center"}}>
                  <Octicons name="tools" size={20} color="black" />
                  <Text style={{ color: "black", fontWeight : "bold", fontSize: 20, marginLeft: 5}}>{t('maintenance')}</Text>
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

        const uploadTask = storage.ref(`msh-photo-maintenance/${type}`).put(blob)
        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {console.log(error)},
          () => {
            storage
              .ref("msh-photo-maintenance")
              .child(type)
              .getDownloadURL()
              .then(url => {
                const uploadTask = () => {
                    setType('')
                    setDetails('')
                    
                    return db.collection("hotels")
                    .doc(userDB.hotelId)
                    .collection('maintenance')
                    .add({
                        author: "effectué par le client",
                        date: new Date(),
                        client: user.displayName,
                        room: userDB.room,
                        type: type,
                        details: details,
                        markup: Date.now(),
                        img: url,
                        status: true
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
        return db.collection("hotels")
                .doc(userDB.hotelId)
                .collection('maintenance')
                .add({
                    author: "effectué par le client",
                    date: new Date(),
                    client: user.displayName,
                    room: userDB.room,
                    type: type,
                    typeClone: typeClone,
                    details: details,
                    markup: Date.now(),
                    img: url,
                    status: true
                }).then(function(docRef){
                    console.log(docRef.id)
                }).catch(function(error) {
                    console.error(error)
                })
      } 

      const handleItemToJourney = () => {
        return db.collection("guestUsers")
        .doc(user.uid)
        .collection('journey')
        .doc(userDB.journeyId)
        .update({
            maintenace: specialFirestoreOptions.arrayUnion({
              reason: type,
              details: details,
              url: url,
              markup: Date.now()
            })
        })
    }


    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
             <StatusBar style="light" />
            <View style={styles.containerText}>
              <ImageBackground source={ require('../../img/pic_maintenance.png') } style={{
                flex: 1,
                resizeMode: "contain",
                justifyContent: "center",
                width: "100%"}}>
              </ImageBackground>
            </View>
            <View style={styles.inputContainer}>
                <TouchableOpacity style={{width: "100%"}} onPress={() => setShowModal(true)}>
                  <Input placeholder={type !== "" ? type : t('maintenance_type')} type="text" value={type} 
                  onChangeText={(text) => setType(text)} />
                </TouchableOpacity>
                <Input placeholder={t('details')}  type="text" value={details} 
                onChangeText={(text) => setDetails(text)} />
            </View>
            <View style={{marginBottom: 55, marginTop: 25}}>
                <TouchableOpacity style={{flexDirection: "row", width: 300, alignItems: "center", justifyContent: "center"}} onPress={pickImage}>
                <MaterialIcons name="add-a-photo" size={24} color="grey" />                    
                <Text style={{fontSize: 20, color: "grey", marginLeft: 10}}>{t('ajout_photo')}</Text>
                </TouchableOpacity>
            </View>
            <Button onPress={(event) => {
              if(img !== null) {
                handleChangePhotoUrl(event)
                handleItemToJourney()
                showMessage({
                  message: t('maintenance_message_succes'),
                  type: "success"
              })
              }else{
                handleSubmit(event)
                handleItemToJourney()
                showMessage({
                  message: t('ajout_photo'),
                  type: "success"
                })
              }
            }} containerStyle={styles.button} title={t('maintenance_bouton')} />

<ModalWeb 
          animationType="slide"
          transparent={true}
          isVisible={showModal} 
          style={styles.roomBoxView}>
              <View style={styles.modalRoom}>
                  <Text style={{
                      width: "100%", 
                      fontSize: 20,
                      paddingBottom: 10,
                      textAlign: "center",
                      fontWeight: "bold",
                      paddingTop: 10,
                      backgroundColor: "lightgrey",
                      borderTopLeftRadius: 15,
                      borderTopRightRadius: 15
                      }}>{t('choose_reason')}</Text>
                      <View style={{width: "100%", alignItems: "center"}}>
                        <TouchableOpacity style={{width: "100%"}} onPress={() => {
                          setType(t('msh_maintenance.m_type.t_paint'))
                          setTypeClone("paint")
                          setShowModal(false)
                        }}>
                          <Text style={{textAlign: "center", paddingBottom: 10, paddingTop: 10, width: "100%", borderTopColor: "lightgrey", borderTopWidth: 1}}>{t('msh_maintenance.m_type.t_paint')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width: "100%"}} onPress={() => {
                          setType(t('msh_maintenance.m_type.t_plumbery'))
                          setTypeClone("plumbery")
                          setShowModal(false)
                        }}>
                          <Text style={{textAlign: "center", paddingBottom: 10, paddingTop: 10, width: "100%", borderTopColor: "lightgrey", borderTopWidth: 1}}>{t('msh_maintenance.m_type.t_plumbery')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width: "100%"}} onPress={() => {
                          setType(t('msh_maintenance.m_type.t_electricity'))
                          setTypeClone("electricity")
                          setShowModal(false)
                        }}>
                          <Text style={{textAlign: "center", paddingBottom: 10, paddingTop: 10, width: "100%", borderTopColor: "lightgrey", borderTopWidth: 1}}>{t('msh_maintenance.m_type.t_electricity')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width: "100%"}} onPress={() => {
                          setType(t('msh_maintenance.m_type.t_cleaning'))
                          setTypeClone("cleaning")
                          setShowModal(false)
                        }}>
                          <Text style={{textAlign: "center", paddingBottom: 10, paddingTop: 10, width: "100%", borderTopColor: "lightgrey", borderTopWidth: 1}}>{t('msh_maintenance.m_type.t_cleaning')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width: "100%"}} onPress={() => {
                          setType(t('msh_maintenance.m_type.t_other'))
                          setTypeClone("others")
                          setShowModal(false)
                        }}>
                          <Text style={{textAlign: "center", paddingBottom: 10, paddingTop: 10, width: "100%", borderTopColor: "lightgrey", borderTopWidth: 1}}>{t('msh_maintenance.m_type.t_other')}</Text>
                        </TouchableOpacity>
                      </View>
              </View>
          </ModalWeb>

        </KeyboardAvoidingView>
    )
}

export default Maintenance

const styles = StyleSheet.create({
    container: {
        flex: 2,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white"
    },
    containerText: {
        flex: 2,
        width: "100%"
    },
    text: {
        fontSize: 30,
        textAlign: "center",
    },
    inputContainer: {
        width: "80%",
        marginTop: 70, 
    },
    button: {
        width: "80%",
        marginTop: 10, 
        marginBottom: 50,
        borderColor: "white",
        borderRadius: 30
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
    roomBoxView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: "90%"
    },
    modalRoom: {
      flexDirection: "column",
        backgroundColor: 'white',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        borderRadius: 15,
        paddingBottom: 15,
        width: 350
    }
})
