import React from "react"
import { Button, Text, View, StyleSheet } from 'react-native';

const CustomFallback = (props) => (
   <View style={styles.container}>
      <Text style={styles.title}>Something happened!</Text>
      <Text style={styles.text}>{props.error.toString()}</Text>
   </View>
)

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ecf0f1',
      padding: 8,
      textAlign: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    icon: {
      fontSize: 48
    },
    text: {
      marginVertical: 16
    }
  });

export default CustomFallback