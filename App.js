import 'react-native-gesture-handler';
import React, { useState, Suspense, useEffect, useRef } from 'react';
import { StyleSheet, Text, Image, Alert } from 'react-native';
import { NavigationContainer, NavigationAction } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/login'
import RegisterScreen from './src/screens/Register'
import ChatScreen from './src/screens/chat'
import RoomChangeScreen from './src/screens/RoomChange'
import MaintenanceScreen from './src/screens/maintenance'
import TimerScreen from './src/screens/Timer'
import TaxiScreen from './src/screens/Taxi'
import Information from './src/screens/Information'
import UserProfileScreen from './src/screens/userProfile'
import FlashMessage from "react-native-flash-message"
import './src/i18next'
import { UserContext } from './src/components/userContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { View } from 'react-native-web';
import { AntDesign } from '@expo/vector-icons';
import * as serviceWorkerRegistration from "./src/serviceWorkerRegistration";
import * as Sentry from 'sentry-expo';
//import { messaging } from "./firebase"

{/*Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});*/}

const Stack = createStackNavigator();

const globalScreenOptions = {
  headerTitleStyle: {color: "black"},
  headerTintColor: "black"
}

Sentry.init({
  dsn: 'https://01e8968dd6a54aa7b199c617f99f0d9a@o1024943.ingest.sentry.io/5990835',
  enableInExpoDevelopment: false,
  debug: false, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
});


export default function App() {
  const [userDB, setUserDB] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const notificationListener = useRef();
  const responseListener = useRef();
  const [notification, setNotification] = useState(false);
  const loading = <Text style={{color: "white"}}>Loading...</Text>

  const load = async () => {
    try{
        let userMemo = await AsyncStorage.getItem("userDB")

        if(userMemo !== null){
            setUserDB(JSON.parse(userMemo))
        }
    }catch (err) {
        alert(err)
    }
}

  useEffect(() => {
      load().then(() => {
        return setTimeout(() => {
          setIsLoading(false)
        }, 3000);})
  }, [])


  {/*useEffect(() => {
    messaging.onMessage((payload) => {
      console.log("Message received. ", payload);
      const { title, ...options } = payload.notification;
      navigator.serviceWorker.register("firebase-messaging-sw.js");
      function showNotification() {
        Notification.requestPermission(function (result) {
          if (result === "granted") {
            navigator.serviceWorker.ready.then(function (registration) {
              registration.showNotification(payload.notification.title, {
                body: payload.notification.body,
                tag: payload.notification.tag,
              });
            });
          }
        });
      }
      showNotification();
    });
  }, [])*/}


  {/*useEffect(() => {
    messaging.onMessage((payload) => {
      console.log('Message received. ', payload);
    });
  }, [])

  useEffect(() => {
    const unsubscribe = messaging.onMessage(async remoteMessage => {
      Alert.alert('Vous avez un nouveau message !', JSON.stringify(remoteMessage))
    })
    return unsubscribe()
  }, [])*/}
  

  {/*useEffect(() => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    setNotification(notification);
  });


  // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    console.log(response);
  });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    }
  }, [])*/}


  if(!isLoading) {
   return <>
      <UserContext.Provider value={{userDB, setUserDB}}>
        <Suspense fallback={loading}>
        <NavigationContainer>
          <Stack.Navigator 
          initialRouteName="Connexion"
          screenOptions={globalScreenOptions}
          >
              <Stack.Screen name="Connexion" component={LoginScreen} options={{headerLeft: null, headerTitle: null}} />
              <Stack.Screen name="Inscription" component={RegisterScreen} />
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen name="Délogement" component={RoomChangeScreen} />
              <Stack.Screen name="Maintenance" component={MaintenanceScreen} />
              <Stack.Screen name="Réveil" component={TimerScreen} />
              <Stack.Screen name="Taxi" component={TaxiScreen}/>
              <Stack.Screen name="Information" component={Information} />
              <Stack.Screen name="My Sweet Hotel" component={UserProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        </Suspense>
      </UserContext.Provider>
      <FlashMessage position="top" style={{zIndex: 10}} />
      </>
  }else{
    return <View style={styles.container}>
      <Image id="flag" style={{backgroundColor: "#fff", width: "90%", height: "90%"}}
      source={require('./assets/msh-splashScreen.png')} 
      />
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <AntDesign name="copyright" size={10} color="black" style={{marginRight: 5}} />
        <Text>My Sweet Hotel</Text>
      </View>
    </View> 
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

serviceWorkerRegistration.register();
