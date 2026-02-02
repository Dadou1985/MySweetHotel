import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white"
    },
    containerText: {
        flex: 2,
        width: "100%"
    },
    text: {
        fontSize: 30,
        textAlign: "center",
    },
    inputContainer: {
        width: "80%",
        marginTop: 40, 
    },
    button: {
        width: "80%",
        marginTop: 10, 
        marginBottom: 50,
        borderColor: "white",
        borderRadius: 30
    },
    img: {
        width: 24,
        height: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginRight: 5
    },
    roomBoxView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: "90%"
    },
    modalRoom: {
      flexDirection: "column",
        backgroundColor: 'white',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        borderRadius: 15,
        paddingBottom: 15,
        width: 350
    }
})