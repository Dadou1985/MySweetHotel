import React, { useState, useEffect, useRef } from 'react'
import { Text, AppState } from 'react-native';
import { useTranslation } from 'react-i18next'


const ChatNotification = ({userToken}) => {
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
      };*/}

      const sendPushNotification = async(token) => {
          const message = {
            to: token,
            sound: 'default',
            title: `Chat ${t('reception')}`,
            body: t('notif_message'),
            data: { someData: 'goes here' },
          };
        
          await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Accept-encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
          });
      }

      useEffect(() => {
        (() => sendPushNotification(userToken))()
      }, [])

    return (
        <Text style={{fontWeight: "bold", color: "red", marginLeft: 5, fontSize: 20}}>!</Text>
    )
}

export default ChatNotification
