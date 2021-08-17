import React, { useLayoutEffect, useState, useContext } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, View, Image, TouchableOpacity, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Entypo } from '@expo/vector-icons';
import { auth, db } from "../../firebase"
import { SimpleLineIcons, MaterialIcons } from '@expo/vector-icons';
import { Input, Button } from 'react-native-elements';
import { UserContext } from '../components/userContext'
import moment from 'moment'
import { Divider } from 'react-native-elements';
import { showMessage, hideMessage } from "react-native-flash-message";


const Home = ({ navigation }) => {
    const [user, setUser] = useState(auth.currentUser)
    const {userDB, setUserDB} = useContext(UserContext)

    const Logout = async () => {
        if(userDB.checkoutDate === moment(new Date()).format('L')) {
            await auth.signOut()
            .then(navigation.replace('Connexion'))
            return setUserDB(null)
        }else{
            await auth.signOut()
            .then(navigation.replace('Connexion'))
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
            <SimpleLineIcons 
            name="logout" 
            size={24} 
            color="white" 
            style={{marginRight: 20}}
            onPress={() => {
                Logout()
                setTimeout(() => {
                    showMessage({
                        message: "Vous venez de vous déconnecter !",
                        type: "info",
                      })
                }, 1000)
            }} />)
        })
    }, [])


    const handleClickAndWait = (item) => {
        return db.collection("hotels")
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
            }).then(function(docRef){
                console.log(docRef.id)
            }).catch(function(error) {
                console.error(error)
            })
    }

    const handleDeleteItemChoosen = async(item) => {
        await db.collection('guestUsers')
        .doc(user.uid)
        .update(
            item
        )
        db.collection('guestUsers')
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

    console.log("$$$$$$", userDB)

    return (
        <KeyboardAvoidingView style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.textContainer}>
                <Text style={{fontSize: 20, fontWeight: "bold"}}>{userDB.hotelName}</Text>
                <Text>{user.displayName}</Text>
            </View>
           
            <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('Chat')}>
                <Entypo name="chat" size={50} />  
            </TouchableOpacity>
           
            <View style={styles.containerTop}>
                <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={() => navigation.navigate('Délogement')}>
                    <MaterialIcons name="room-preferences" size={55} color="black" />                
                </TouchableOpacity>            
                <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={() => navigation.navigate('Maintenance')}>
                    <Image source={{uri: "https://static.thenounproject.com/png/41655-200.png"}} style={styles.img} />
                </TouchableOpacity>
            </View>
            
                <TouchableOpacity activeOpacity={0.5} style={{position: "absolute", top: 260}} onPress={() => navigation.navigate('Portail utilisateur')}>
                    <Image source={{uri: user.photoURL}}
                    style={{width: 150, height: 150, borderRadius: 100}} />
                </TouchableOpacity>
            
            <View style={styles.containerBottom}>
                <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={() => navigation.navigate('Réveil')}>
                    <Image source={{uri: "https://image.flaticon.com/icons/png/512/62/62834.png"}} style={styles.img} />
                </TouchableOpacity>           
                <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={() => navigation.navigate('Taxi')}>
                    <Image source={{uri: "https://cdn2.iconfinder.com/data/icons/car-11/100/taxi3-512.png"}} style={styles.img} />
                </TouchableOpacity>
            </View>
            
            <View style={{width: "100%", flexDirection: "column", alignItems: "center"}}>
                <Text style={{fontSize: 20, fontWeight: "bold"}}>Click & Wait</Text>
                <View style={styles.cncContainer}>
                    {userDB.towel &&
                        <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={() => {
                        handleClickAndWait("towel")
                        handleDeleteItemChoosen({towel: false})
                        showMessage({
                            message: "Votre demande a été transmise à la réception !",
                            type: "success",
                          })
                    }}>
                        <Image source={{uri: "https://cdn4.iconfinder.com/data/icons/everyday-objects-line-art-1/128/towels-512.png"}} style={styles.img} />    
                    </TouchableOpacity>}
                        {userDB.soap &&
                            <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={() => {
                        handleClickAndWait("soap")
                        handleDeleteItemChoosen({soap: false})
                        showMessage({
                            message: "Votre demande a été transmise à la réception !",
                            type: "success",
                          })
                    }}>
                        <Image source={{uri: "https://cdn0.iconfinder.com/data/icons/beauty-and-fashion-14/512/Soap_bar-512.png"}} style={styles.img} />    
                    </TouchableOpacity> }
                    {userDB.toiletPaper &&
                        <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={() => {
                        handleClickAndWait("toilet-paper")
                        handleDeleteItemChoosen({toiletPaper: false})
                        showMessage({
                            message: "Votre demande a été transmise à la réception !",
                            type: "success",
                          })
                    }}>
                        <Image source={{uri: "https://www.clipartmax.com/png/middle/181-1817034_toilet-trauma-youtube-toilet-paper-roll-icon.png"}} style={styles.img} />    
                    </TouchableOpacity>}  
                    {userDB.hairDryer &&
                        <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={() => {
                        handleClickAndWait("hair-dryer")
                        handleDeleteItemChoosen({hairDryer: false})
                        showMessage({
                            message: "Votre demande a été transmise à la réception !",
                            type: "success",
                          })
                    }}>
                        <Image source={{uri: "https://www.clipartmax.com/png/middle/177-1778082_hair-dryer-icon-hair-dryer.png"}} style={styles.img} />    
                    </TouchableOpacity> }    
                </View>
                <View style={styles.cncContainer}>
                    {userDB.pillow &&
                        <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={() => {
                        handleClickAndWait("pillow")
                        handleDeleteItemChoosen({pillow: false})
                        showMessage({
                            message: "Votre demande a été transmise à la réception !",
                            type: "success",
                          })
                    }}>
                        <Image source={{uri: "https://cdn.iconscout.com/icon/premium/png-256-thumb/pillow-1427897-1207484.png"}} style={styles.img} />    
                    </TouchableOpacity>}
                    {userDB.blanket &&
                        <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={() => {
                        handleClickAndWait("blanket")
                        handleDeleteItemChoosen({blanket: false})
                        showMessage({
                            message: "Votre demande a été transmise à la réception !",
                            type: "success",
                          })
                    }}>
                        <Image source={{uri: "https://www.pinclipart.com/picdir/middle/159-1599759_weighted-blanket-blanket-clipart.png"}} style={styles.img} />    
                    </TouchableOpacity>}  
                    {userDB.iron &&
                        <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={() => {
                        handleClickAndWait("iron")
                        handleDeleteItemChoosen({iron: false})
                        showMessage({
                            message: "Votre demande a été transmise à la réception !",
                            type: "success",
                          })
                    }}>
                        <Image source={{uri: "https://secure.webtoolhub.com/static/resources/icons/set73/c814a79e.png"}} style={styles.img} />    
                    </TouchableOpacity>}  
                    {userDB.babyBed &&
                        <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={() => {
                        handleClickAndWait("baby-bed")
                        handleDeleteItemChoosen({babyBed: false})
                        showMessage({
                            message: "Votre demande a été transmise à la réception !",
                            type: "success",
                          })
                    }}>
                        <Image source={{uri: "https://www.pngkey.com/png/full/548-5481965_baby-bed-with-a-mobile-toy-with-hanging.png"}} style={styles.img} />    
                    </TouchableOpacity> } 
                </View>
            </View>
            {/*<Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={{fontSize: 20, textAlign: "center"}}>Bonjour {user.email}</Text>
                            <Input 
                            placeholder="Entrez votre numéro de chambre" 
                            autofocus 
                            type="number" 
                            value={room} 
                            onChangeText={(text) => setRoom(text)} />
                            <Button title="Enregistrer" />
                            <Button title="Fermer" type="clear" onPress={() => setShowModal(false)} />
                        </View>
                    </View>
            </Modal>*/}
        </KeyboardAvoidingView>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20
    },
    containerTop: {
        width: "90%",
        height: "20%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    containerBottom: {
        width: "100%",
        height: "20%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    textContainer: {
        flexDirection: "column",
        alignItems: "center",
        height: 100
    },
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        width: 350,
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      cncContainer: {
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
          marginTop: 15
      }
})
