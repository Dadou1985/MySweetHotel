import React, { useContext } from "react"
import { Text, View, TouchableOpacity, Image, Platform, StyleSheet } from 'react-native';
import { UserContext } from '../components/userContext'
import { useTranslation } from 'react-i18next'

const CustomFallback = (props) => {
  const user = useContext(UserContext)
  const { t } = useTranslation()

  console.log("USER+++++++++++++++", props)
  
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Image source={{uri: user && user.userDB.logo}} 
          style={{
            flex: 1,
            width: '100%',
            resizeMode:"contain",
            borderRadius: 5}}>
        </Image>
      </View>
      <Text style={styles.title}>{t("boundary_error_message_begining")}</Text>
      <Text style={styles.text}>{t("boundary_error_message_ending")}</Text>
      {/* <Text style={styles.text}>{props.error.toString()}</Text> */}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ecf0f1',
      padding: '5%',
      textAlign: 'center',
    },
    logo: {
      flex: 4,
      width: '100%',
      height: '40%',
    },
    title: {
      // flex: 2,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    text: {
      flex: 2,
      marginVertical: 16,
      textAlign: 'center',
    }
  });

export default CustomFallback