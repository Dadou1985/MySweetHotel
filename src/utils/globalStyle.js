import { StyleSheet } from "react-native";

export default StyleSheet.create({
    shadow: {
        filter: "drop-shadow(1px 1px 1px #a17308)"
    },
    chatMessageShadow: {
        filter: "drop-shadow(1px 1px 1px black)"
    },
    headerShadow: {
        flex: 1,
        backgroundColor: 'black',

        // Web
        boxShadow: '0px 6px 12px rgba(0,0,0,0.4)',

        // iOS (au cas où)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,

        // Android
        elevation: 8,
      }
})