import React, { useState, useContext, memo } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated, Modal } from 'react-native';
import { auth, db, specialFirestoreOptions } from "../../firebase"
import { UserContext } from '../components/userContext'
import { showMessage } from "react-native-flash-message";
import { AntDesign, Entypo } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import ModalWeb from 'modal-enhanced-react-native-web';

const ClickNwaitDrawer = ({fadeAnim, fadeOut, navigation, closePanel}) => {
    const [user, setUser] = useState(auth.currentUser)
    const [showModal, setShowModal] = useState(false)
    const {userDB, setUserDB} = useContext(UserContext)

    const { t } = useTranslation()

    const handleClickAndWait = async (item) => {
        try {
            const docRef = await db.collection("hotels")
                .doc(userDB.hotelId)
                .collection('housekeeping')
                .doc("item")
                .collection(item)
                .add({
                    client: user.displayName,
                    room: userDB.room,
                    checkoutDate: userDB.checkoutDate,
                    createdAt: new Date(),
                    markup: Date.now(),
                });
            console.log(docRef.id);
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteItemChoosen = async(item) => {
        await db.collection('guestUsers')
        .doc(user.uid)
        .update(
            item
        )
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

    const handleItemToJourney = (item) => {
        return db.collection("guestUsers")
        .doc(user.uid)
        .collection('journey')
        .doc(userDB.journeyId)
        .collection('housekeeping')
        .doc("item")
        .set(
            item
        )
    }

    return (
        <Animated.View style={[styles.fadingContainer, {bottom: fadeAnim}]}>
                <View style={{flexDirection: "row", justifyContent: "flex-end", maxWidth: "90%", alignItems: "center"}}>
                    <Text style={{fontSize: 20, fontWeight: "bold", marginLeft: 120}}>{t('conciergerie')}</Text>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => {
                        fadeOut()
                        closePanel()}} style={{marginLeft: 100}}>
                        <AntDesign name="closecircle" size={20} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-around", mawWidth: "90%", alignItems: "center"}}>
                    <Text style={{textAlign: 'center'}}>{t('besoins')}</Text>
                    <TouchableOpacity activeOpacity={0.5} onPress={fadeOut}>
                        <AntDesign name="infocirlce" size={15} color="black" style={{marginLeft: 5}} onPress={() => setShowModal(true)} />
                    </TouchableOpacity>
                </View>
                <View style={styles.cncContainer}>
                    {userDB.towel &&
                        <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={() => {
                        handleClickAndWait("towel")
                        handleDeleteItemChoosen({towel: false})
                        //handleItemToJourney({towel:  specialFirestoreOptions.arrayUnion("towel")})
                        showMessage({
                            message: t('conciergerie_message_succes'),
                            type: "success",
                          })
                    }}>
                        <Image source={require('../../img/bath-towel.png')} style={styles.img} />    
                    </TouchableOpacity>}
                        {userDB.soap &&
                            <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={() => {
                        handleClickAndWait("soap")
                        handleDeleteItemChoosen({soap: false})
                        //handleItemToJourney({soap:  specialFirestoreOptions.arrayUnion("soap")})
                        showMessage({
                            message: t('conciergerie_message_succes'),
                            type: "success",
                          })
                    }}>
                        <Image source={require('../../img/soap.png')} style={styles.img} />    
                    </TouchableOpacity> }
                    {userDB.toiletPaper &&
                        <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={() => {
                        handleClickAndWait("toiletPaper")
                        handleDeleteItemChoosen({toiletPaper: false})
                        //handleItemToJourney({toiletPaper:  specialFirestoreOptions.arrayUnion("toiletPaper")})
                        showMessage({
                            message: t('conciergerie_message_succes'),
                            type: "success",
                          })
                    }}>
                        <Image source={require('../../img/toilet-paper.png')} style={styles.img} />    
                    </TouchableOpacity>}  
                    {userDB.hairDryer &&
                        <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={() => {
                        handleClickAndWait("hairDryer")
                        handleDeleteItemChoosen({hairDryer: false})
                        //handleItemToJourney({hairDryer:  specialFirestoreOptions.arrayUnion("hairDryer")})
                        showMessage({
                            message: t('conciergerie_message_succes'),
                            type: "success",
                          })
                    }}>
                        <Image source={require('../../img/hair-dryer.png')} style={styles.img} />    
                    </TouchableOpacity> }    
                </View>
                <View style={styles.cncContainer}>
                    {userDB.pillow &&
                        <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={() => {
                        handleClickAndWait("pillow")
                        handleDeleteItemChoosen({pillow: false})
                        //handleItemToJourney({pillow:  specialFirestoreOptions.arrayUnion("pillow")})
                        showMessage({
                            message: t('conciergerie_message_succes'),
                            type: "success",
                          })
                    }}>
                        <Image source={require('../../img/pillow.png')} style={styles.img} />    
                    </TouchableOpacity>}
                    {userDB.blanket &&
                        <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={() => {
                        handleClickAndWait("blanket")
                        handleDeleteItemChoosen({blanket: false})
                        //handleItemToJourney({blanket:  specialFirestoreOptions.arrayUnion("blanket")})
                        showMessage({
                            message: t('conciergerie_message_succes'),
                            type: "success",
                          })
                    }}>
                        <Image source={require('../../img/bed-sheets.png')} style={styles.img} />    
                    </TouchableOpacity>}  
                    {userDB.iron &&
                        <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={() => {
                        handleClickAndWait("iron")
                        handleDeleteItemChoosen({iron: false})
                        //handleItemToJourney({iron:  specialFirestoreOptions.arrayUnion("iron")})
                        showMessage({
                            message: t('conciergerie_message_succes'),
                            type: "success",
                          })
                    }}>
                        <Image source={require('../../img/iron.png')} style={styles.img} />    
                    </TouchableOpacity>}  
                    {userDB.babyBed &&
                        <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={() => {
                        handleClickAndWait("babyBed")
                        handleDeleteItemChoosen({babyBed: false})
                        //handleItemToJourney({babyBed:  specialFirestoreOptions.arrayUnion("babyBed")})
                        showMessage({
                            message: t('conciergerie_message_succes'),
                            type: "success",
                          })
                    }}>
                        <Image source={require('../../img/baby-crib.png')} style={styles.img} />    
                    </TouchableOpacity> } 
                    {!userDB.towel && !userDB.toiletPaper && !userDB.soap && !userDB.hairDryer && !userDB.pillow && !userDB.blanket && !userDB.iron && !userDB.babyBed && 
                        <TouchableOpacity style={{flexDirection: "column", alignItems: "center"}} activeOpacity={0.5} onPress={() => {
                            navigation.navigate('Chat')
                            }}>
                            <Entypo name="chat" size={40} color="black" />                   
                            <Text>{t('conciergerie_message_fin')}</Text>
                        </TouchableOpacity>}
                </View>
                <ModalWeb 
                animationType="slide"
                transparent={true}
                isVisible={showModal} 
                style={styles.centeredView}>
                    <View style={styles.modal}>
                        <View style={{flexDirection: "row", justifyContent: "flex-end", width: "90%", alignItems: "center", marginBottom: 10}}>
                            <TouchableOpacity activeOpacity={0.5} onPress={() => {
                                setShowModal(false)}} style={{marginLeft: 100}}>
                                <AntDesign name="closecircle" size={15} color="black" />
                            </TouchableOpacity>
                        </View>
                        <Text style={{
                            width: "100%", 
                            fontSize: 15,
                            paddingBottom: 10,
                            textAlign: "center",
                            fontWeight: "bold",
                            borderTopColor: "grey",
                            borderTopWidth: 1,
                            paddingTop: 10,
                            paddingBottom: 10
                            }}><AntDesign name="infocirlce" size={15} color="black" style={{marginRight: 15}} />
                            {t('conciergerie_conditions_titre')}</Text>
                            <Text style={{textAlign: "center"}}>{t('conciergerie_conditions_para1')}</Text>
                    </View>
                </ModalWeb>
        </Animated.View>
    )
}

export default memo(ClickNwaitDrawer)

const styles = StyleSheet.create({
    img: {
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
    fadingContainer: {
        alignItems: "center", 
        position: "absolute", 
        backgroundColor: "white",
        bottom: 0, 
        padding: 20,
        width: "100%"
    },
    cncContainer: {
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
          marginTop: 15,
          padding: 10,
      },
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
    modal: {
        padding: 10,
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
    }
})
