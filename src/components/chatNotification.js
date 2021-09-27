import React, { useState, useEffect, useRef } from 'react'
import { Text, AppState } from 'react-native';
import { useTranslation } from 'react-i18next'
import { functions  } from '../../firebase';
import webPush from "web-push"

const ChatNotification = ({userToken, icon}) => {
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    const { t } = useTranslation()


    {/*useEffect(() => {
        AppState.addEventListener('change', _handleAppStateChange);
      
        return () => {
          AppState.removeEventListener('change', _handleAppStateChange);
        };
      }, []);
      
      const _handleAppStateChange = (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log('App has come to the foreground!');
        }
      
        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        console.log('AppState', appState.current);
      };

      const sendPushNotification = async(token) => {
          const message = {
            sound: 'default',
            title: `Chat ${t('reception')}`,
            body: t('notif_message'),
            data: { someData: 'goes here' },
          };
        
          await fetch('token.endpoint', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Accept-encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
          });
      }*/}

      {/*const sendWebPush = (token) => {
        const pushSubscription = token

        const vapidPublicKey = "BMSSazlbQtYWLKQKC-vr8gQcaX1piG2geiTDGBJXzQT_wW6dGdHbwnGReCH-6r_HcWVNE4vvBZG7VF059Hre-Bk"

        const vapidPrivateKey = "Pz_eIme7ErLghd0i14HoV9xtPPM-05iEEkQuGTmy7ns"

        const payload = "test"

        const options = {
          gcmAPIKey: "AAAArcsD5Yk:APA91bFbvLMKJOajrLQQCwJG92E4M5hjciSmTtX7RCIqAiCTnOTaj43ODkq425tc6ECexVFLVcI38f8Mx82RZ0rqAqXokA465E3L_MLLbdHtZt3RZYa1Yw4Lg6FuLi2Hvz2Ee5trybnD",
          vapidDetails: {
            subject: 'mailto:david.simba1985@gmail.com',
            publicKey: vapidPublicKey,
            privateKey: vapidPrivateKey
          },
          TTL: 60,
        }

        return webPush.sendNotification(
          pushSubscription,
          payload,
          options
        );
      }

      useEffect(() => {
        sendWebPush(userToken)
      }, [])*/}

      useEffect(() => {
        if(userToken) {
          const sendPushNotification = functions.httpsCallable('sendPushNotification')
        return sendPushNotification({token: userToken, icon: icon, body: "Vous avez un nouveau message !", title: "Chat Reception"})
        }
      }, [])

    return (
        <Text style={{fontWeight: "bold", color: "red", marginLeft: 5, fontSize: 20}}>!</Text>
    )
}

export default ChatNotification
