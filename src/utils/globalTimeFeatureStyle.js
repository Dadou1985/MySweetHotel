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
        width: "100%",
    },
    button: {
        width: "80%",
        marginTop: 10,
        marginBottom: 50, 
        borderColor: "white",
        borderRadius: 30,
        filter: "drop-shadow(1px 1px 1px)"
    },
    datePickerButton: {
        width: 250,
        marginTop: 50, 
        marginBottom: 90,
        borderColor: "white",
        marginTop: 100
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
    datePicker: {
        width: 350,
        height: 260,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: "white",
        marginTop: 200
    },
    datePickerModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 55,
        backgroundColor: "white",
      },
      image: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end"
      },
      roomBoxView: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
      },
      modalRoom: {
          margin: 20,
          borderRadius: 15,
          backgroundColor: 'white',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
              width: 0,
              height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          width: "90%"
      }
})