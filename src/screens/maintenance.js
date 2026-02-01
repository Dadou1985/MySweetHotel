import React, { useState, useContext, useEffect, useLayoutEffect, useCallback } from 'react';
import { KeyboardAvoidingView, Text, View, TouchableOpacity, Image, ImageBackground, Platform } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons'; 
import { UserContext } from '../components/userContext'
import { auth, db, storage, specialFirestoreOptions } from "../../firebase"
import * as ImagePicker from 'expo-image-picker';
import { showMessage, hideMessage } from "react-native-flash-message";
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { AntDesign, Octicons, FontAwesome5, Entypo } from '@expo/vector-icons';
import ModalWeb from 'modal-enhanced-react-native-web';
import GlobalCameraFeatureStyle from '../utils/globalCameraFeatureStyle'

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
                  <Entypo name="tools" size={35} color="#B8860B" />
                  <Text style={{ color: "#B8860B", fontWeight : "bold", fontSize: 20, marginLeft: 5}}>{t('maintenance')}</Text>
              </View>
          ),
          headerLeft: () => (
              <TouchableOpacity onPress={() => {
              navigation.navigate("My Sweet Hotel")}}>
                  <AntDesign name="left" size={24} color="#B8860B" style={{marginLeft: 5}} />
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
  

      const handleChangePhotoUrl = useCallback (async(event) => {
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
                const uploadTask = async () => {
                    setType('')
                    setTypeClone('')
                    setDetails('')
                    
                    try {
                    const docRef = await db.collection("hotels")
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
                      });
                    console.log(docRef.id);
                  } catch (error) {
                    console.error(error);
                  }
                }
                  return setUrl(url, uploadTask())})
          }
        )
      }, [img])

      const handleSubmit = async (event) => {
        event.preventDefault()
        setType('')
        setTypeClone('')
        setDetails('')
        try {
          const docRef = await db.collection("hotels")
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
            });
          console.log(docRef.id);
        } catch (error) {
          console.error(error);
        }
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
              markup: Date.now()
            })
        })
    }


    return (
        <KeyboardAvoidingView behavior="padding" style={GlobalCameraFeatureStyle.container}>
             <StatusBar style="light" />
            <View style={GlobalCameraFeatureStyle.containerText}>
              <ImageBackground source={ require('../../img/pic_maintenance.png') } style={{
                flex: 1,
                resizeMode: "contain",
                justifyContent: "center",
                width: "100%"}}>
              </ImageBackground>
            </View>
            <View style={GlobalCameraFeatureStyle.inputContainer}>
                <TouchableOpacity style={{width: "100%"}} onPress={() => setShowModal(true)}>
                  <Input style={{ outline: "none", borderBottomColor: "#B8860B", borderBottomWidth: 1 }} 
                  inputContainerStyle={{borderBottomWidth: 0}}
                  inputStyle={{fontSize: "1em"}} placeholder={typeClone !== "" ? typeClone : t('maintenance_type')} type="text" value={typeClone} 
                  onChangeText={(text) => setTypeClone(text)} />
                </TouchableOpacity>
                <Input style={{ outline: "none", borderBottomColor: "#B8860B", borderBottomWidth: 1 }} 
                  inputContainerStyle={{borderBottomWidth: 0}}
                  inputStyle={{fontSize: "1em"}} placeholder={t('details')}  type="text" value={details} 
                onChangeText={(text) => setDetails(text)} />
            </View>
            <View style={{marginBottom: "7vh", marginTop: "5vh"}}>
                <TouchableOpacity style={{flexDirection: "column", width: 300, alignItems: "center", justifyContent: "center"}} onPress={pickImage}>
                <MaterialIcons name="add-a-photo" size={24} color="black" />                    
                <Text style={{fontSize: 11, color: "black", marginLeft: 10}}>{t('ajout_photo')}</Text>
                </TouchableOpacity>
            </View>
            <Button 
            buttonStyle={{backgroundColor: "#B8860B"}} 
            titleStyle={{color: "black"}}
            onPress={(event) => {
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
                  message: t('maintenance_message_succes'),
                  type: "success"
                })
              }
            }} containerStyle={GlobalCameraFeatureStyle.button} title={t('maintenance_bouton')} />

<ModalWeb 
          animationType="slide"
          transparent={true}
          isVisible={showModal} 
          onBackdropPress={() => setShowModal(false)}
          style={GlobalCameraFeatureStyle.roomBoxView}>
              <View style={GlobalCameraFeatureStyle.modalRoom}>
                  <Text style={{
                      width: "100%", 
                      fontSize: 20,
                      paddingBottom: 10,
                      textAlign: "center",
                      fontWeight: "bold",
                      paddingTop: 10,
                      backgroundColor: "#B8860B",
                      borderTopLeftRadius: 15,
                      borderTopRightRadius: 15
                      }}>{t('choose_reason')}</Text>
                      <View style={{width: "100%", alignItems: "center"}}>
                        <TouchableOpacity style={{width: "100%"}} onPress={() => {
                          setTypeClone(t('msh_maintenance.m_type.t_paint'))
                          setType("paint")
                          setShowModal(false)
                        }}>
                          <Text style={{textAlign: "center", paddingBottom: 10, paddingTop: 10, width: "100%", borderTopColor: "lightgrey", borderTopWidth: 1}}>{t('msh_maintenance.m_type.t_paint')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width: "100%"}} onPress={() => {
                          setTypeClone(t('msh_maintenance.m_type.t_plumbery'))
                          setType("plumbery")
                          setShowModal(false)
                        }}>
                          <Text style={{textAlign: "center", paddingBottom: 10, paddingTop: 10, width: "100%", borderTopColor: "#B8860B", borderTopWidth: 1}}>{t('msh_maintenance.m_type.t_plumbery')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width: "100%"}} onPress={() => {
                          setTypeClone(t('msh_maintenance.m_type.t_electricity'))
                          setType("electricity")
                          setShowModal(false)
                        }}>
                          <Text style={{textAlign: "center", paddingBottom: 10, paddingTop: 10, width: "100%", borderTopColor: "#B8860B", borderTopWidth: 1}}>{t('msh_maintenance.m_type.t_electricity')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width: "100%"}} onPress={() => {
                          setTypeClone(t('msh_maintenance.m_type.t_cleaning'))
                          setType("cleaning")
                          setShowModal(false)
                        }}>
                          <Text style={{textAlign: "center", paddingBottom: 10, paddingTop: 10, width: "100%", borderTopColor: "#B8860B", borderTopWidth: 1}}>{t('msh_maintenance.m_type.t_cleaning')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width: "100%"}} onPress={() => {
                          setTypeClone(t('msh_maintenance.m_type.t_other'))
                          setType("others")
                          setShowModal(false)
                        }}>
                          <Text style={{textAlign: "center", paddingBottom: 10, paddingTop: 10, width: "100%", borderTopColor: "#B8860B", borderTopWidth: 1}}>{t('msh_maintenance.m_type.t_other')}</Text>
                        </TouchableOpacity>
                      </View>
              </View>
          </ModalWeb>

        </KeyboardAvoidingView>
    )
}

export default Maintenance
