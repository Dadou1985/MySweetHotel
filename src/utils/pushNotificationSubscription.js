import { db } from '../../firebase'

export function pushNotificationSubscription (uid, navigation, handleLoadUserDB) {
  const isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
                    navigator.userAgent &&
                    navigator.userAgent.indexOf('CriOS') == -1 &&
                    navigator.userAgent.indexOf('FxiOS') == -1;

    if(!isSafari) {
    
      function determineAppServerKey() {
        const vapidPublicKey =
        "BMSSazlbQtYWLKQKC-vr8gQcaX1piG2geiTDGBJXzQT_wW6dGdHbwnGReCH-6r_HcWVNE4vvBZG7VF059Hre-Bk";
          return urlBase64ToUint8Array(vapidPublicKey);
      }
      
      function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
          .replace(/\-/g, '+')
          .replace(/_/g, '/');
      
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
      
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      }
      
      function subscribeUser() {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then(function(reg) {
            reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: determineAppServerKey()
            }).then(function(sub) {
              console.log('Endpoint URL: ', sub.endpoint);
              const subPush = sub.toJSON()
                return db.collection("guestUsers")
                .doc(uid)
                .update({
                  token: subPush,
                  notificationStatus: "granted"
                })
                .then(handleLoadUserDB())
                .then(() => navigation.navigate('Chat'))
            }).catch(function(e) {
              if (Notification.permission === 'denied') {
                console.warn('Permission for notifications was denied');
              } else {
                console.error('Unable to subscribe to push', e);
              }
            });
          })
        }
      }
    
      return Notification.requestPermission(function(status) {
        console.log('Notification permission status:', status);
        console.log("**********", uid)
        if(status === 'granted'){
          return subscribeUser()
        }else{
          return db.collection("guestUsers")
          .doc(uid)
          .update({notificationStatus: "denied"})
          .then(handleLoadUserDB())
          .then(() => navigation.navigate('Chat'))
        }
      });
          
    } 
  }

