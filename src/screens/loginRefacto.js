import React, { useState, useEffect, useContext, useLayoutEffect, useCallback } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, View, Image, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { StatusBar } from 'expo-status-bar'
import { auth, db } from "../../firebase"
import { UserContext } from '../components/userContext'
import { showMessage } from "react-native-flash-message"
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons'
import ModalWeb from 'modal-enhanced-react-native-web'
import globalStyle from '../utils/globalStyle'

// Constants
const THEME_COLOR = "#B8860B"

// Flag data configuration
const FLAG_DATA = {
    fr: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAArklEQVR4nO3avQnCYBiF0UwSdxDTmwkF8Qc70SZi1hBEHSABGxsJ1h8pjUu8IOh54C5w6ptlkiRJkvSPjctVFb3L9TFLKVWR63aHeZsXVfSy8XQ5RK+5P08ppSFy3WZ/bvLJELk2n7wBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPh5gHJdR+96e8z7vq8j99oeF82oqKP37ZOaJEmSJH2lD+DtRFTekXctAAAAAElFTkSuQmCC",
    en: "data:image/png;base64,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",
    es: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADR0lEQVR4nO2a22+TdRyHe+m1yI2xrN3bw9ruKJDNkDhYt6lBDMsMbBBQHOIhAxYJJFRAcSmhHmiQTcR11XVd2eYYK9u6HsbarhzCnBFRAb2oiOEKNS70/vGfeOcvod8nee6/nyfv1S+vwSAIgiAIgiAIglCMxAzlw8WsYdrgpJiVAKoPUK0EUH2AaiWA6gNUKwEWGhwUs4ZCzk4xq1uApaz6MQoDuJgL11LIuZQP+t8CPLpSwe/xKvLJWu7PVpGJrCYfr+R2dA33UzUszVcqH7esAfLT1SS2a3zb7qR/hZWBfWUEn7JycXs56W0W7o5XKR+3rAEexB18s6mEs8+bOLtB46uXSwg2WumtNxHYaOLelPpxyxLgwvsa48dMFHJ2/pq1cfFjE0GvjeBbRkJeCxd8pTxM2Sjk7KRPaqS6zcpH6hpgpm8VM4FV5PtthFZa6HOZGFhpIbarmaupcWYH/ORmhniQ3cTs1yaivUblI3UN8HP6CAuxQ+T7bPQ8WUrXjhX0thhJtDeT+XyEqwf6SQ5f4s9MC7fTB1iIf6h8pG4B/p6xkzy0hWh7E/GtGl8+odHZUcm5tjomWt3kxhJcPxomMzzFDf9m4rsamX5vCw+nbMqH6hLgR6+FyT2tJE90sHjYRvfTRjyv1eOvKGFncxc9b3jIRKa4NjnHT4MtXPbuZGJvGwtHrcqH6hLgUdZOuns3Iw1urp+qIfiCk0CDi9PPWHl9XxcHHa8w0lTHiHsdi343oQ31JD17KMyrH6pLgF8+s5I83MEPiWNcO7Oa821mwi1mhtyl9JjKCZZonK/VCGtWvvc1cSft4dKRN7l5/HH5Aubt3Mmd4Obl42RP1xDZaibcamboJTN969cSNlqIbHMwttHCos/N3XkP36V8/DunfqguAZayDlKD5UTPlXFvoozAZjtDrWYGXjQT7tzN8Doro/UakTVO8qPVpAYriAbK+CftVD5UlwD5eB1f+Pfzifcdfp1cy61QNRMHGxk92Umg9yPGTn1A7N1X+S30HH8knuXMp3vxdb/NrdE65UN1CfA4KgFUP0mpVh5FVR+gWgmg+gDVSgDVB6hWAqg+QLWGmME1Vsyq/klNEARBEARBEARBCf8BUD72BGfc2zUAAAAASUVORK5CYII=",
    de: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAWUlEQVR4nO3QQQ0AMBDDsPLHNk69x2DUkULAiSRJkqT1OjYAAAAAAAAAAAAAAAAAJE26NAAAAAAAAAAAAAAAAAB8gJcuDQAAAAAAAAAAAAAAAAAAJEmSJM11+E5Cu4Z5zL0AAAAASUVORK5CYII=",
    it: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAsElEQVR4nO3avQnCYBiF0UwSl9BSW8XlhBAEO9EmYtYQBH9qAzY2ItYfKY1LvBDQ88Bd4NQ3yyRJkiTpH5ssp1X0To/LIqVURe612RVNPqqil43LWRe95nk/pJS6yL1W2+MtH3aRa/LhBwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAXweYlPM6eufHtWjbto7ce70vb4NRHb2+T2qSJEmS1EtfJaB8msbUm8wAAAAASUVORK5CYII=",
    pt: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEt0lEQVR4nO2a3U9TdxyH/Uc67KClnnPawgHNsrls84U5Z+KSIWrMNjfNxqHqjFmcLwlcSFwyddFsZia70IvFsUVxWVCn8iYWaEtfKPQNViwtpdJWgUnxJbt4doEjXoOsEH9P8knO1Uk+z/md7zm/k7NsmUAgEAgEAoFAIBC8jFhrVjYsRL5fI3+XfaW4YbFnmUUrZyFyYq2lI60zstgjBAgBQoAQIAQIAULAi0u5plJ51IqzyTweXWVgZLkh7yUXXIC1uozTF8z4e2R6HRK9Tolo0IzfKePtkuh3K4Q+Kc572QURsKWuhF6njN8lEelVeDBayv1kCcMRC7msSjpeQsirEHDL+J0SSdPiWhHzEmA7aSXgWUX4lo1E1x6G79iIddgYum0jfKuawRaNwRaNYXsNcXsNgfbd9LlkEtb8F5+3gC/qzdxoMnL7VgUtW01cr9bPntTztoHLWgFRqYi0zsiQVMQVTY9772bcdglHm4m4tDhWwpwFxMIWIj6F5mvradtr4spBPaM6A6M6A77NRTTW6QmVGRjTGRkoM/B7nZ6erzdw766Vu0Ezrb/mv/ycBVTXm+luW0HIJxMNvs+oqYS0zki2vYNHk5NkkmlcnREe3h/n0eQkyW9OkNYZyezaTS6rkhiw0OeSSS3P/2Cck4DmVoWQVyGXVYmFN5F8JmDK5QagoyPKxo0/Mj4+DcDYqTOkdUbGPv2MXFYll1UJuBUGdixRAWGfgs8h0++W8Tg24Fwn4/qwcFZALveUixdnjgFi3x7Hvr2IweqtBDwz8vwuM6FGeWkK6G43YW8tps8l09P1Lm37TVw+pMfX2IamNXDzZpjq6l9obo6gaQ0ETh6h6VghzkMVBL0KYZ+Cq8OEv1tZmgLa/jQRC88855PRTXhXr6DrzUIGr91h27bz+HwjVFWdx+1OsH37BSLH6+l+p5D+nZWzt0CfS8bXKS1NAZHemauYy6qkht5g5PU1pHVG/r5+E4BMZoobN4I8efIPAPHaY6R1Rob32cgkSmZmgEch1LhEBbS2mWeHYC6rEt/5ESl9MYkDXwJgtw9RUfEDk5OPeDo9TbhiLfeWFzNy7gh/9ZtJDVkJuBUiO/Jbfs4CqmpL6e+RSAxYCHkV3Oc+x2Ez8MfBQmJn6nk8/ZjOzrtMj43Rf7SK374qwPmxBdfVSiZSpQyFLPQ6JUYLlqgAi1ZOMmolGjAT8ChEgyU4Dn+A/YiBlN5IUipjdO17JPUSQ6qRpsOv4j63i4dplQG/mexICe6rK/Jefl4CdtYqBHpkBvxmclmVTGI1kVN7iEvq7MnHdEaib60jcrmGiVQZUxkVv1Oms8VETMp/+XkJsGjl7D1hJeiVCXkVpjLP5sFAJYPXDxD8aR/Rjv3ci60nl1WZSJXOTH6HRNy6OPYB8xZg0crZWleK3ynT71YY7DPzYLSUiVQpAY8yux0OPrcdTpjyX/qFCrBo5Vhryjj7s5m+Hhlft0zAI9HrkPA7JbxdEkGPQmRX/l97F0zA81llU9lSa8HRpEwNvmYgqV88y/1/EfBfXtqPokKAECAECAFCgBCwhARYtZWXFiJn1yinMwWmS4s9+f5JTSAQCAQCgUAgEAjywr/ZVBJ3mPtZuAAAAABJRU5ErkJggg=="
}

// Language configuration
const LANGUAGES = [
    { title: "Français", value: "fr" },
    { title: "English", value: "en" },
    { title: "Español", value: "es" },
    { title: "Deutsche", value: "de" },
    { title: "Italiano", value: "it" },
    { title: "Português", value: "pt" }
]

// Add2HomeScreen images configuration
const ADD2SCREEN_IMAGES = {
    fr: ['fr-msh-screen.png', 'fr-msh-add2homeScreen.png'],
    en: ['en-msh-screen.png', 'en-msh-add2homeScreen.png'],
    es: ['es-msh-screen.png', 'es-msh-add2homeScreen.png'],
    de: ['de-msh-screen.png', 'de-msh-add2homeScreen.png'],
    it: ['it-msh-screen.png', 'it-msh-add2homeScreen.png'],
    pt: ['pt-msh-screen.png', 'pt-msh-add2homeScreen.png']
}

// Utility function to detect Safari browser
const isSafariBrowser = () => {
    return navigator.vendor?.indexOf('Apple') > -1 &&
           navigator.userAgent?.indexOf('CriOS') === -1 &&
           navigator.userAgent?.indexOf('FxiOS') === -1
}

// Reusable Flag Component
const FlagImage = ({ language, style }) => {
    const flagUri = FLAG_DATA[language] || FLAG_DATA.fr
    return (
        <Image
            id="flag"
            source={{ uri: flagUri }}
            style={[styles.flagImage, style]}
        />
    )
}

// Reusable Language Item Component
const LanguageItem = ({ data, onSelect }) => (
    <View style={styles.languageItem} key={data.value}>
        <TouchableOpacity
            activeOpacity={0.5}
            style={styles.languageButton}
            onPress={() => onSelect(data.value)}
        >
            <FlagImage language={data.value} />
            <Text style={styles.languageText}>{data.title}</Text>
        </TouchableOpacity>
    </View>
)

// Reusable Modal Close Button
const ModalCloseButton = ({ onClose, size = 24 }) => (
    <TouchableOpacity onPress={onClose}>
        <AntDesign name="closecircle" size={size} color="black" />
    </TouchableOpacity>
)

// Add2HomeScreen Pictures Component
const Add2ScreenPictures = ({ language }) => {
    const images = ADD2SCREEN_IMAGES[language] || ADD2SCREEN_IMAGES.fr

    // Dynamic require mapping
    const imageMap = {
        'fr-msh-screen.png': require('../../img/add2homeScreen/fr-msh-screen.png'),
        'fr-msh-add2homeScreen.png': require('../../img/add2homeScreen/fr-msh-add2homeScreen.png'),
        'en-msh-screen.png': require('../../img/add2homeScreen/en-msh-screen.png'),
        'en-msh-add2homeScreen.png': require('../../img/add2homeScreen/en-msh-add2homeScreen.png'),
        'es-msh-screen.png': require('../../img/add2homeScreen/es-msh-screen.png'),
        'es-msh-add2homeScreen.png': require('../../img/add2homeScreen/es-msh-add2homeScreen.png'),
        'de-msh-screen.png': require('../../img/add2homeScreen/de-msh-screen.png'),
        'de-msh-add2homeScreen.png': require('../../img/add2homeScreen/de-msh-add2homeScreen.png'),
        'it-msh-screen.png': require('../../img/add2homeScreen/it-msh-screen.png'),
        'it-msh-add2homeScreen.png': require('../../img/add2homeScreen/it-msh-add2homeScreen.png'),
        'pt-msh-screen.png': require('../../img/add2homeScreen/pt-msh-screen.png'),
        'pt-msh-add2homeScreen.png': require('../../img/add2homeScreen/pt-msh-add2homeScreen.png')
    }

    return (
        <View style={styles.add2ScreenContainer}>
            {images.map((img, index) => (
                <Image key={index} source={imageMap[img]} style={styles.img} />
            ))}
        </View>
    )
}

const Login = ({ navigation }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showModalLanguage, setShowModalLanguage] = useState(false)
    const [showModalAdd2Screen, setShowModalAdd2Screen] = useState(false)

    const { userDB, setUserDB } = useContext(UserContext)
    const { t } = useTranslation()
    const isSafari = isSafariBrowser()

    // URL params
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const hotelLogo = urlParams.get('url')
    const hotelId = urlParams.get('hotelId')

    const handleLoadUserDB = async (userId) => {
        try {
            const doc = await db.collection('guestUsers').doc(userId).get()

            if (!doc.exists) {
                return
            }

            setUserDB(doc.data())

            if (doc.data().checkoutDate !== "") {
                navigation.replace('My Sweet Hotel')
                setTimeout(() => {
                    showMessage({
                        message: t("succes_connection"),
                        type: "info",
                    })
                }, 1000)
            } else {
                navigation.navigate('Information', { hotelLogo, currentHotelId: hotelId })
            }
        } catch (error) {
            console.error("Error loading user data:", error)
        }
    }

    const handleUpdateLanguage = (userId) => {
        return db.collection('guestUsers')
            .doc(userId)
            .update({ language: i18next.language })
    }

    const handleLogin = () => {
        auth.signInWithEmailAndPassword(email.trim(), password)
            .then(() => {
                setEmail('')
                setPassword('')
            })
            .catch((error) => {
                if (error) {
                    setTimeout(() => {
                        showMessage({
                            message: t('login_error'),
                            type: "danger",
                        })
                    }, 1000)
                }
            })
    }

    const handleLanguageSelect = (languageValue) => {
        setShowModalLanguage(false)
        i18next.changeLanguage(languageValue)
    }

    // Add to Home Screen Modal Content
    const Add2HomeScreenContent = useCallback(() => {
        const closeButton = (
            <View style={styles.modalCloseRow}>
                <ModalCloseButton onClose={() => setShowModalAdd2Screen(false)} size={15} />
            </View>
        )

        const headerText = (
            <Text style={styles.add2ScreenHeader}>{t('add2homeScreen')}</Text>
        )

        if (isSafari) {
            return (
                <ScrollView contentContainerStyle={styles.modal}>
                    {closeButton}
                    {headerText}
                    <Text style={styles.centeredText}>{t('ios_add2homeScreen')}</Text>
                    <View style={styles.deviceSection}>
                        <Text style={styles.deviceTitle}>Iphone</Text>
                        <View>
                            <Image
                                source={require('../../img/ios-add2homeScreen/ios-add2HomeScreen.png')}
                                style={styles.iosImage1}
                            />
                            <Image
                                source={require('../../img/ios-add2homeScreen/ios-add2homeScreen2.png')}
                                style={styles.iosImage2}
                            />
                        </View>
                    </View>
                    <View style={styles.deviceSection}>
                        <Text style={styles.deviceTitle}>Ipad</Text>
                        <Image
                            source={require('../../img/ios-add2homeScreen/ipad-add2homeScreen.png')}
                            style={styles.iosImage2}
                        />
                    </View>
                </ScrollView>
            )
        }

        return (
            <ScrollView contentContainerStyle={styles.modal}>
                {closeButton}
                {headerText}
                <Text style={styles.centeredText}>{t('android_add2homeScreen')}</Text>
                <Add2ScreenPictures language={i18next.language} />
            </ScrollView>
        )
    }, [showModalAdd2Screen, t, isSafari])

    // Language Modal Content
    const LanguageModalContent = useCallback(() => (
        <ScrollView contentContainerStyle={styles.modalView}>
            <View style={styles.languageModalHeader}>
                <Text style={styles.languageModalTitle}>{t('selection_langue')}</Text>
                <ModalCloseButton onClose={() => setShowModalLanguage(false)} />
            </View>
            {LANGUAGES.map(data => (
                <LanguageItem
                    key={data.value}
                    data={data}
                    onSelect={handleLanguageSelect}
                />
            ))}
        </ScrollView>
    ), [showModalLanguage, t])

    // Navigation header setup
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => setShowModalLanguage(true)}
                        style={styles.headerButton}
                    >
                        <FlagImage language={i18next.language} />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity
                    style={styles.headerRight}
                    onPress={() => setShowModalAdd2Screen(true)}
                >
                    {/* Placeholder for add to home screen icon */}
                </TouchableOpacity>
            )
        })
    }, [i18next.language])

    // Auth state listener
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                handleUpdateLanguage(user.uid)
                    .then(() => handleLoadUserDB(user.uid))
            }
        })
        return unsubscribe
    }, [])

    // Set language from userDB
    useEffect(() => {
        if (userDB !== null) {
            i18next.changeLanguage(userDB.language)
        }
    }, [])

    const ModalComponent = Platform.OS === "web" ? ModalWeb : Modal

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View style={styles.flagRow}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => setShowModalLanguage(true)}
                    style={styles.fitContent}
                >
                    <FlagImage language={i18next.language} />
                </TouchableOpacity>
            </View>

            <StatusBar style="light" />

            {hotelLogo ? (
                <View style={styles.containerText}>
                    <Image
                        source={{ uri: hotelLogo }}
                        style={styles.hotelLogo}
                    />
                </View>
            ) : (
                <View style={styles.containerText}>
                    <Image
                        source={require('../../img/new-logo-msh.png')}
                        style={styles.defaultLogo}
                    />
                </View>
            )}

            <View style={styles.inputContainer}>
                <View style={styles.inputRow}>
                    <MaterialIcons
                        name="email"
                        size={24}
                        color={THEME_COLOR}
                        style={globalStyle.shadow}
                    />
                    <Input
                        style={styles.input}
                        placeholder={t('email')}
                        autoFocus
                        type="email"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View style={styles.inputRow}>
                    <FontAwesome
                        name="lock"
                        size={24}
                        color={THEME_COLOR}
                        style={[styles.lockIcon, globalStyle.shadow]}
                    />
                    <Input
                        style={styles.input}
                        placeholder={t('mot_de_passe')}
                        secureTextEntry
                        type="password"
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    onPress={handleLogin}
                    buttonStyle={styles.loginButtonStyle}
                    containerStyle={styles.button}
                    title={t('connection')}
                    titleStyle={styles.loginButtonTitle}
                />
                {userDB === null && (
                    <Button
                        onPress={() => navigation.navigate('Inscription', {
                            hotelLogo,
                            currentHotelId: hotelId
                        })}
                        containerStyle={styles.button2}
                        title={t('creation_compte')}
                        titleStyle={styles.registerButtonTitle}
                        type="clear"
                    />
                )}
            </View>

            {showModalLanguage && (
                <ModalComponent
                    animationType="slide"
                    transparent={true}
                    visible={showModalLanguage}
                    isVisible={showModalLanguage}
                    style={styles.centeredView}
                >
                    <LanguageModalContent />
                </ModalComponent>
            )}

            {showModalAdd2Screen && (
                <ModalWeb
                    animationType="slide"
                    transparent={true}
                    isVisible={showModalAdd2Screen}
                    style={styles.centeredView}
                >
                    <Add2HomeScreenContent />
                </ModalWeb>
            )}
        </KeyboardAvoidingView>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "white"
    },
    containerText: {
        flex: 3,
        width: "100%",
        padding: 5
    },
    text: {
        fontSize: 40,
        textAlign: "center"
    },
    inputContainer: {
        flex: 2,
        width: 300,
        justifyContent: "center"
    },
    buttonContainer: {
        flex: 2
    },
    button: {
        width: 200,
        marginBottom: 10,
        borderRadius: 30,
        filter: "drop-shadow(1px 1px 1px)",
        borderColor: THEME_COLOR,
        borderWidth: 1
    },
    button2: {
        width: 200,
        marginBottom: 10,
        borderRadius: 30,
        borderColor: THEME_COLOR,
        borderWidth: 1
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: "100vw",
        height: "100%"
    },
    modal: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    img: {
        marginBottom: 25,
        width: 200,
        height: 370,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    // New organized styles
    flagImage: {
        width: 30,
        height: 30,
        marginRight: 15
    },
    flagRow: {
        flexDirection: "row",
        width: "90vw",
        paddingTop: "1%"
    },
    fitContent: {
        width: "fit-content"
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center"
    },
    input: {
        outline: "none",
        borderBottomColor: THEME_COLOR,
        borderBottomWidth: 1
    },
    lockIcon: {
        marginLeft: 5,
        marginRight: 5
    },
    loginButtonStyle: {
        backgroundColor: THEME_COLOR
    },
    loginButtonTitle: {
        color: "black"
    },
    registerButtonTitle: {
        color: THEME_COLOR
    },
    hotelLogo: {
        flex: 1,
        resizeMode: "cover",
        borderRadius: 5
    },
    defaultLogo: {
        flex: 1,
        resizeMode: "contain",
        justifyContent: "center",
        width: "100%",
        marginLeft: "11vw"
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center"
    },
    headerButton: {
        marginLeft: 20
    },
    headerRight: {
        marginRight: 20
    },
    languageItem: {
        padding: 15,
        marginBottom: 30
    },
    languageButton: {
        flexDirection: "row",
        alignItems: "center"
    },
    languageText: {
        fontSize: 15
    },
    languageModalHeader: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: THEME_COLOR
    },
    languageModalTitle: {
        fontSize: 25,
        marginRight: 20,
        color: "black"
    },
    modalCloseRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        width: "90%",
        alignItems: "center",
        marginBottom: 10
    },
    add2ScreenHeader: {
        width: "100%",
        fontSize: 15,
        textAlign: "center",
        fontWeight: "bold",
        borderTopColor: "grey",
        borderTopWidth: 1,
        paddingTop: 10,
        paddingBottom: 10
    },
    add2ScreenContainer: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        marginTop: 15
    },
    centeredText: {
        textAlign: "center"
    },
    deviceSection: {
        marginTop: 25
    },
    deviceTitle: {
        fontWeight: "bold",
        fontSize: 15,
        marginBottom: 10
    },
    iosImage1: {
        width: 300,
        height: 30,
        marginBottom: 10
    },
    iosImage2: {
        width: 300,
        height: 400
    }
})
