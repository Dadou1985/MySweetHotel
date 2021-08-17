import React, { useState, useEffect, useContext, useLayoutEffect } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, View, Image, Modal, TouchableOpacity, ImageBackground, ScrollView } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { StatusBar } from 'expo-status-bar'
import { auth, db } from "../../firebase"
import { UserContext } from '../components/userContext'
import { showMessage } from "react-native-flash-message"
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { AntDesign } from '@expo/vector-icons';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const {userDB, setUserDB} = useContext(UserContext)
    const [showModalLanguage, setShowModalLanguage] = useState(false)

    const { t } = useTranslation()

    const renderSwitchFlag = () => {
        switch(i18next.language) {
            case 'fr':
                return <Image id="flag" 
                source={{uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAArklEQVR4nO3avQnCYBiF0UwSdxDTmwkF8Qc70SZi1hBEHSABGxsJ1h8pjUu8IOh54C5w6ptlkiRJkvSPjctVFb3L9TFLKVWR63aHeZsXVfSy8XQ5RK+5P08ppSFy3WZ/bvLJELk2n7wBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPh5gHJdR+96e8z7vq8j99oeF82oqKP37ZOaJEmSJH2lD+DtRFTekXctAAAAAElFTkSuQmCC"}} 
                style={{width: 30, height: 30, marginRight: 15}} />
            case 'en':
                return <Image id="flag" 
                source={{uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAIgklEQVR4nO2aeVCU5x3HN03jJG2TTtKZNCVGbfEWJ4lXBc9gPcYr3jFeqSdax6j1ihXxAo8qYLRWKx71QNGAxFYFUUBALo8VOcQAslzKIcu6CLvs9X76B90XXl+MggjJ5P3OfGd22Pf5Hd93n+d9nu+LSqVAgQIFChQoUKBAgQIFP0UYNA++BQJq81SQOmrSjMO5E6cdaFReicoMAwIyvvROUru65T7J8oSU80DAstXBaY2d223RiYwsTelZIKAyLfs/qeNXZqhd3XJVUW8NIGfLYWxVJmojOfU+46ccwMFxTaMxJOwOAEkjlhCu6iGjLuYWACPG7W20nL/vvI7N2y9S/rgKa3klWav/QeTrLmJOlf1DbJtRFJ28yJMIvXSHPoN8fnQCvN/Wnb8sOUV+gQ7BaqNgXxAxvx0i5kr88HPKLl9Dlbv9GFG/Hih+ccN5Jvr4ZIkIFosVv8NxdO7u+aMQYPTEf6FOygegNCSOhC6TxBwxvxvGg4NnEWw2AFQA5oc6vlu4jYif/1G8MPWz1RhzHkiE0OkMeGw6R6sOHj9IAZwHenMuJBWAipQsbg1dJMa+8ou+ZHvsw1phkPSkGj/lAClp1Y1W3MkmafhicVDk6y5krdqNRV8hGZStKWXW/OM/GAE6fryJfQdiMJutmIq0pM/1JOLVXtVxX+nJnS/WU1VQIunBbLay1y8GlYPjGlq2c2fpqiCKi8sB0IYlkNh1cs3P5t0hFOwLQrDaJEHiErMZOnpPswnQqoMHazeeo0xXic1QhcbzIFfe7C/GU38yn3L1Xdm6di4kFeeB3jg4rqkWwM62Thvw2RWB0WhGsNq4vz9YsnAkOH2G9mK8JJggCJwOUtPNZVuTCjDT7Tj3sh+CIFB49DyxH4wQ48S3H8fDs1GyxpOSCxg72U8SR1VX8O59thH47S0EQajz0ZE0bBEVadmS4AaDGe+vw2nrtOGlCjB09B7iEqpz66LUXOsxXRwf/ZtB5O8KQDBbJLUVFun5ctk3vN/WXRavTgHsHD72nyRezwHAmPOA1Ml/E5NFvNqLu/O3YC4pkyQrKi5nycogWraTJ3sRAbq5bOObM2oEQcCQmUfy2OU1a1ULZzKX7cSiK5fUUmkwsX3nZRyd1j+1x+8VwM65C0+Qm1/dqD4+mRvOM8XkUW8NIGfrv2UbqZS0B0yYevCFBWjrtAHf3REYDGbMWj0Zi3cQ8VpvcUzKhFUY7hXIpuWpwJt87Lz1mb09lwAOjmto02kdm7aGUv64qvpOB4QR23qUWEhsm1EUBYTJ5l3opTv0/ZNvvQVo2c6dZV+dobi4HJvJTJ6PP1Fvu4rXXu/1BY+uJsny1Xdhfm4B7OzaczNHjiditdqwGU3kbDksWXlvuMxCn5AiKcq+kbLP3WcJsHVHGHfSCwEoCQwnznFMjdCtRlLkHwKCIMmhyWnYo1nVb7AvDeHchSfI1pQCYCrWctdtM/EdxhPfYTwJnSaSvcEPa6VRdoeeRwAAU2Ep6XM9JTFzNh/GZpRONavVxrGT13AdvqtBfajqrPAl43kEaCooAlz5ZT+amuI29QlGvtGnyWtR1VXIT4mKAM1dQHNTEaC5C2huqpJGLKGpGfPukDqLueEyq8lrUfYB2rJKGsqKStNTA1v0FZgf6kTWttXqLYAgSGKZH+qwmcwA2GxCg+vXllXW/zDk4FhtoS1fHUzJw8eyWk1FWtLneUk8udQp7hhzC7H831J7lgCWJ6w3gNILsSR0niheG/PeUO7vD0aw2ggJqzlx1vswVN8Bk6YfEk9qtWEzmtB4HZKcDG/2nYM+MZVsTSkz3Y4Teun5jsMz5h7l0NF4mRCC1UbB3kDJGpLYdTLai/FYLFYOHonHqYfXyxGg/5CdXAqXG4wIAoXHLkg8uTjHMZQEhqPTGVi7scZGr68h0m+wLxcvp8tSPtWmS71HebmRTVtDadNpXeMI0KW7V513A0AXc4vrPWeIRUS97Uqejz+mSiP7D8XSqZv0RUpDLbEJUw+K1n1tGHMLSZvqTvgrPQlXVdt06fO8MBVrycsvY8HiUw0XoHVHD9Z7XUCvl5/pDVn5JI9bIRYe8VpvMhbvwKzVcz40DRfXul+lvYgn2LKdO4tXBFJYpJfVo7+Wxs2+c8Q4V97sj8brEDajCXVSPp9O2l8/AWYv8EeTUypLZCnTk7HUh8gWzmKy5DHLqczI43bKfcY9YTk3pgB2Ojqt5+++l6k0yJ9AJUERxLUdK8aLbTWSwuPV7tG5kFScP/H+fgGGfbqH+GsaWWDBbCFv50mi36nx5K51n47uyk0eFOpZ9Ne6LeeXIYCdHzlv5cTpG9hsgrxW3xNS/7DnDHQxtzCbrbKpqXJwrLacTwdVW84yVYMjiW9Xo+rVlsMpPHqeiooqtvlc4g9dnm45v0wB7Bw0YjfRV7Pq/rUu8ZY4yMnjVmDIzOPRIwPrPM/TuqMHKu+vwzEYzLIA5TfTuTlgXs28+lV/NJsOYKkw4n/qOh/13vLcRb5MAeycNvsI32UWy/owZOZJ1qvIFs5kLPXBUqYnJ1cr3wpX5ReTNt2jZmX9WS/S53hiKiwl+moWg0bsrndxTSGAg+MaPmi/llVrz1KqrXiyLXTRaskTK/odV/J8T9QIYH1cyT33vUS+0Ue86NbghTxOziQjq4Rps480uPGmEsDODh9uZPfeKKqqpK/IEASK/EOIbTWy5jQo2Gzc9wsm5r2h4h8TOk+k9EIspdoKvvI4S6v2a1+4+aYUwM5e/bdz5mySbG2zGU3kbK5+n6HKWLAlTT3QrcBOjcc+NVZr0O3b+aF/nndUM+Fzv4LGYkR0VjgQmLl4R0rtnHbqE1MvAoFLVwbfbcy8GzwvJBsMpjNAYG0acu//t7n/SU2BAgUKFChQoECBAgUKmgX/AzWeBvYb6mW+AAAAAElFTkSuQmCC"}} 
                style={{width: 30, height: 30, marginRight: 15}} />
            case 'es':
                return <Image id="flag" 
                source={{uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADR0lEQVR4nO2a22+TdRyHe+m1yI2xrN3bw9ruKJDNkDhYt6lBDMsMbBBQHOIhAxYJJFRAcSmhHmiQTcR11XVd2eYYK9u6HsbarhzCnBFRAb2oiOEKNS70/vGfeOcvod8nee6/nyfv1S+vwSAIgiAIgiAIglCMxAzlw8WsYdrgpJiVAKoPUK0EUH2AaiWA6gNUKwEWGhwUs4ZCzk4xq1uApaz6MQoDuJgL11LIuZQP+t8CPLpSwe/xKvLJWu7PVpGJrCYfr+R2dA33UzUszVcqH7esAfLT1SS2a3zb7qR/hZWBfWUEn7JycXs56W0W7o5XKR+3rAEexB18s6mEs8+bOLtB46uXSwg2WumtNxHYaOLelPpxyxLgwvsa48dMFHJ2/pq1cfFjE0GvjeBbRkJeCxd8pTxM2Sjk7KRPaqS6zcpH6hpgpm8VM4FV5PtthFZa6HOZGFhpIbarmaupcWYH/ORmhniQ3cTs1yaivUblI3UN8HP6CAuxQ+T7bPQ8WUrXjhX0thhJtDeT+XyEqwf6SQ5f4s9MC7fTB1iIf6h8pG4B/p6xkzy0hWh7E/GtGl8+odHZUcm5tjomWt3kxhJcPxomMzzFDf9m4rsamX5vCw+nbMqH6hLgR6+FyT2tJE90sHjYRvfTRjyv1eOvKGFncxc9b3jIRKa4NjnHT4MtXPbuZGJvGwtHrcqH6hLgUdZOuns3Iw1urp+qIfiCk0CDi9PPWHl9XxcHHa8w0lTHiHsdi343oQ31JD17KMyrH6pLgF8+s5I83MEPiWNcO7Oa821mwi1mhtyl9JjKCZZonK/VCGtWvvc1cSft4dKRN7l5/HH5Aubt3Mmd4Obl42RP1xDZaibcamboJTN969cSNlqIbHMwttHCos/N3XkP36V8/DunfqguAZayDlKD5UTPlXFvoozAZjtDrWYGXjQT7tzN8Doro/UakTVO8qPVpAYriAbK+CftVD5UlwD5eB1f+Pfzifcdfp1cy61QNRMHGxk92Umg9yPGTn1A7N1X+S30HH8knuXMp3vxdb/NrdE65UN1CfA4KgFUP0mpVh5FVR+gWgmg+gDVSgDVB6hWAqg+QLWGmME1Vsyq/klNEARBEARBEARBCf8BUD72BGfc2zUAAAAASUVORK5CYII="}} 
                style={{width: 30, height: 30, marginRight: 15}} />
            case 'de':
                return <Image id="flag" 
                source={{uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAWUlEQVR4nO3QQQ0AMBDDsPLHNk69x2DUkULAiSRJkqT1OjYAAAAAAAAAAAAAAAAAJE26NAAAAAAAAAAAAAAAAAB8gJcuDQAAAAAAAAAAAAAAAAAAJEmSJM11+E5Cu4Z5zL0AAAAASUVORK5CYII="}} 
                style={{width: 30, height: 30, marginRight: 15}} />
            case 'it':
                return <Image id="flag" 
                source={{uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAsElEQVR4nO3avQnCYBiF0UwSl9BSW8XlhBAEO9EmYtYQBH9qAzY2ItYfKY1LvBDQ88Bd4NQ3yyRJkiTpH5ssp1X0To/LIqVURe612RVNPqqil43LWRe95nk/pJS6yL1W2+MtH3aRa/LhBwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAXweYlPM6eufHtWjbto7ce70vb4NRHb2+T2qSJEmS1EtfJaB8msbUm8wAAAAASUVORK5CYII="}} 
                style={{width: 30, height: 30, marginRight: 15}} />
            case 'pt':
                return <Image id="flag" 
                source={{uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEt0lEQVR4nO2a3U9TdxyH/Uc67KClnnPawgHNsrls84U5Z+KSIWrMNjfNxqHqjFmcLwlcSFwyddFsZia70IvFsUVxWVCn8iYWaEtfKPQNViwtpdJWgUnxJbt4doEjXoOsEH9P8knO1Uk+z/md7zm/k7NsmUAgEAgEAoFAIBC8jFhrVjYsRL5fI3+XfaW4YbFnmUUrZyFyYq2lI60zstgjBAgBQoAQIAQIAULAi0u5plJ51IqzyTweXWVgZLkh7yUXXIC1uozTF8z4e2R6HRK9Tolo0IzfKePtkuh3K4Q+Kc572QURsKWuhF6njN8lEelVeDBayv1kCcMRC7msSjpeQsirEHDL+J0SSdPiWhHzEmA7aSXgWUX4lo1E1x6G79iIddgYum0jfKuawRaNwRaNYXsNcXsNgfbd9LlkEtb8F5+3gC/qzdxoMnL7VgUtW01cr9bPntTztoHLWgFRqYi0zsiQVMQVTY9772bcdglHm4m4tDhWwpwFxMIWIj6F5mvradtr4spBPaM6A6M6A77NRTTW6QmVGRjTGRkoM/B7nZ6erzdw766Vu0Ezrb/mv/ycBVTXm+luW0HIJxMNvs+oqYS0zki2vYNHk5NkkmlcnREe3h/n0eQkyW9OkNYZyezaTS6rkhiw0OeSSS3P/2Cck4DmVoWQVyGXVYmFN5F8JmDK5QagoyPKxo0/Mj4+DcDYqTOkdUbGPv2MXFYll1UJuBUGdixRAWGfgs8h0++W8Tg24Fwn4/qwcFZALveUixdnjgFi3x7Hvr2IweqtBDwz8vwuM6FGeWkK6G43YW8tps8l09P1Lm37TVw+pMfX2IamNXDzZpjq6l9obo6gaQ0ETh6h6VghzkMVBL0KYZ+Cq8OEv1tZmgLa/jQRC88855PRTXhXr6DrzUIGr91h27bz+HwjVFWdx+1OsH37BSLH6+l+p5D+nZWzt0CfS8bXKS1NAZHemauYy6qkht5g5PU1pHVG/r5+E4BMZoobN4I8efIPAPHaY6R1Rob32cgkSmZmgEch1LhEBbS2mWeHYC6rEt/5ESl9MYkDXwJgtw9RUfEDk5OPeDo9TbhiLfeWFzNy7gh/9ZtJDVkJuBUiO/Jbfs4CqmpL6e+RSAxYCHkV3Oc+x2Ez8MfBQmJn6nk8/ZjOzrtMj43Rf7SK374qwPmxBdfVSiZSpQyFLPQ6JUYLlqgAi1ZOMmolGjAT8ChEgyU4Dn+A/YiBlN5IUipjdO17JPUSQ6qRpsOv4j63i4dplQG/mexICe6rK/Jefl4CdtYqBHpkBvxmclmVTGI1kVN7iEvq7MnHdEaib60jcrmGiVQZUxkVv1Oms8VETMp/+XkJsGjl7D1hJeiVCXkVpjLP5sFAJYPXDxD8aR/Rjv3ci60nl1WZSJXOTH6HRNy6OPYB8xZg0crZWleK3ynT71YY7DPzYLSUiVQpAY8yux0OPrcdTpjyX/qFCrBo5Vhryjj7s5m+Hhlft0zAI9HrkPA7JbxdEkGPQmRX/l97F0zA81llU9lSa8HRpEwNvmYgqV88y/1/EfBfXtqPokKAECAECAFCgBCwhARYtZWXFiJn1yinMwWmS4s9+f5JTSAQCAQCgUAgEAjywr/ZVBJ3mPtZuAAAAABJRU5ErkJggg=="}} 
                style={{width: 30, height: 30, marginRight: 15}} />
            default:
                return <Image id="flag" 
                source={{uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAArklEQVR4nO3avQnCYBiF0UwSdxDTmwkF8Qc70SZi1hBEHSABGxsJ1h8pjUu8IOh54C5w6ptlkiRJkvSPjctVFb3L9TFLKVWR63aHeZsXVfSy8XQ5RK+5P08ppSFy3WZ/bvLJELk2n7wBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPh5gHJdR+96e8z7vq8j99oeF82oqKP37ZOaJEmSJH2lD+DtRFTekXctAAAAAElFTkSuQmCC"}} 
                style={{width: 30, height: 30, marginRight: 15}} />
        }
    }

    const handleLoadUserDB = (userId) => {
        return db.collection('guestUsers')
        .doc(userId)
        .get()
        .then((doc) => {
            if (doc.exists) {
            setUserDB(doc.data())
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).then(() => {
            return navigation.navigate('Information')
        })
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => setShowModalLanguage(true)}>
                        {renderSwitchFlag()}
                    </TouchableOpacity>
                </View>),
                headerLeft: null,
        })
    }, [i18next.language])

    useEffect(() => {
        
        let unsubscribe = auth.onAuthStateChanged(function(user) {
            if (user) {
                handleLoadUserDB(user.uid)
                setTimeout(() => {
                    showMessage({
                        message: t("succes_connection"),
                        type: "info",
                    })
                }, 1000);
            } 
          });
        return unsubscribe
    }, [])

    useEffect(() => {
        if(userDB !== null) {
            i18next.changeLanguage(userDB.language)
        }
    }, [])

    const Login = () => {
        auth.signInWithEmailAndPassword(email.trim(), password)
        .then(() => {
            setEmail('') 
            setPassword('')
        }).catch(function(error) {
            if(error) {
                setTimeout(() => {
                    showMessage({
                        message: t('login_error'),
                        type: "danger",
                      })
                }, 1000)
            }
        })
    }

    console.log("userDB", userDB)


    const internationalization = [
        {title: "Français", value: "fr", countryFlag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAArklEQVR4nO3avQnCYBiF0UwSdxDTmwkF8Qc70SZi1hBEHSABGxsJ1h8pjUu8IOh54C5w6ptlkiRJkvSPjctVFb3L9TFLKVWR63aHeZsXVfSy8XQ5RK+5P08ppSFy3WZ/bvLJELk2n7wBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPh5gHJdR+96e8z7vq8j99oeF82oqKP37ZOaJEmSJH2lD+DtRFTekXctAAAAAElFTkSuQmCC"},
        {title: "English", value: "en", countryFlag: "data:image/png;base64,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"},
        {title: "Español", value: "es", countryFlag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADR0lEQVR4nO2a22+TdRyHe+m1yI2xrN3bw9ruKJDNkDhYt6lBDMsMbBBQHOIhAxYJJFRAcSmhHmiQTcR11XVd2eYYK9u6HsbarhzCnBFRAb2oiOEKNS70/vGfeOcvod8nee6/nyfv1S+vwSAIgiAIgiAIglCMxAzlw8WsYdrgpJiVAKoPUK0EUH2AaiWA6gNUKwEWGhwUs4ZCzk4xq1uApaz6MQoDuJgL11LIuZQP+t8CPLpSwe/xKvLJWu7PVpGJrCYfr+R2dA33UzUszVcqH7esAfLT1SS2a3zb7qR/hZWBfWUEn7JycXs56W0W7o5XKR+3rAEexB18s6mEs8+bOLtB46uXSwg2WumtNxHYaOLelPpxyxLgwvsa48dMFHJ2/pq1cfFjE0GvjeBbRkJeCxd8pTxM2Sjk7KRPaqS6zcpH6hpgpm8VM4FV5PtthFZa6HOZGFhpIbarmaupcWYH/ORmhniQ3cTs1yaivUblI3UN8HP6CAuxQ+T7bPQ8WUrXjhX0thhJtDeT+XyEqwf6SQ5f4s9MC7fTB1iIf6h8pG4B/p6xkzy0hWh7E/GtGl8+odHZUcm5tjomWt3kxhJcPxomMzzFDf9m4rsamX5vCw+nbMqH6hLgR6+FyT2tJE90sHjYRvfTRjyv1eOvKGFncxc9b3jIRKa4NjnHT4MtXPbuZGJvGwtHrcqH6hLgUdZOuns3Iw1urp+qIfiCk0CDi9PPWHl9XxcHHa8w0lTHiHsdi343oQ31JD17KMyrH6pLgF8+s5I83MEPiWNcO7Oa821mwi1mhtyl9JjKCZZonK/VCGtWvvc1cSft4dKRN7l5/HH5Aubt3Mmd4Obl42RP1xDZaibcamboJTN969cSNlqIbHMwttHCos/N3XkP36V8/DunfqguAZayDlKD5UTPlXFvoozAZjtDrWYGXjQT7tzN8Doro/UakTVO8qPVpAYriAbK+CftVD5UlwD5eB1f+Pfzifcdfp1cy61QNRMHGxk92Umg9yPGTn1A7N1X+S30HH8knuXMp3vxdb/NrdE65UN1CfA4KgFUP0mpVh5FVR+gWgmg+gDVSgDVB6hWAqg+QLWGmME1Vsyq/klNEARBEARBEARBCf8BUD72BGfc2zUAAAAASUVORK5CYII="},
        {title: "Deutsche", value: "de", countryFlag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAWUlEQVR4nO3QQQ0AMBDDsPLHNk69x2DUkULAiSRJkqT1OjYAAAAAAAAAAAAAAAAAJE26NAAAAAAAAAAAAAAAAAB8gJcuDQAAAAAAAAAAAAAAAAAAJEmSJM11+E5Cu4Z5zL0AAAAASUVORK5CYII="},
        {title: "Italiano", value: "it", countryFlag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAsElEQVR4nO3avQnCYBiF0UwSl9BSW8XlhBAEO9EmYtYQBH9qAzY2ItYfKY1LvBDQ88Bd4NQ3yyRJkiTpH5ssp1X0To/LIqVURe612RVNPqqil43LWRe95nk/pJS6yL1W2+MtH3aRa/LhBwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAXweYlPM6eufHtWjbto7ce70vb4NRHb2+T2qSJEmS1EtfJaB8msbUm8wAAAAASUVORK5CYII="},
        {title: "Português", value: "pt", countryFlag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEt0lEQVR4nO2a3U9TdxyH/Uc67KClnnPawgHNsrls84U5Z+KSIWrMNjfNxqHqjFmcLwlcSFwyddFsZia70IvFsUVxWVCn8iYWaEtfKPQNViwtpdJWgUnxJbt4doEjXoOsEH9P8knO1Uk+z/md7zm/k7NsmUAgEAgEAoFAIBC8jFhrVjYsRL5fI3+XfaW4YbFnmUUrZyFyYq2lI60zstgjBAgBQoAQIAQIAULAi0u5plJ51IqzyTweXWVgZLkh7yUXXIC1uozTF8z4e2R6HRK9Tolo0IzfKePtkuh3K4Q+Kc572QURsKWuhF6njN8lEelVeDBayv1kCcMRC7msSjpeQsirEHDL+J0SSdPiWhHzEmA7aSXgWUX4lo1E1x6G79iIddgYum0jfKuawRaNwRaNYXsNcXsNgfbd9LlkEtb8F5+3gC/qzdxoMnL7VgUtW01cr9bPntTztoHLWgFRqYi0zsiQVMQVTY9772bcdglHm4m4tDhWwpwFxMIWIj6F5mvradtr4spBPaM6A6M6A77NRTTW6QmVGRjTGRkoM/B7nZ6erzdw766Vu0Ezrb/mv/ycBVTXm+luW0HIJxMNvs+oqYS0zki2vYNHk5NkkmlcnREe3h/n0eQkyW9OkNYZyezaTS6rkhiw0OeSSS3P/2Cck4DmVoWQVyGXVYmFN5F8JmDK5QagoyPKxo0/Mj4+DcDYqTOkdUbGPv2MXFYll1UJuBUGdixRAWGfgs8h0++W8Tg24Fwn4/qwcFZALveUixdnjgFi3x7Hvr2IweqtBDwz8vwuM6FGeWkK6G43YW8tps8l09P1Lm37TVw+pMfX2IamNXDzZpjq6l9obo6gaQ0ETh6h6VghzkMVBL0KYZ+Cq8OEv1tZmgLa/jQRC88855PRTXhXr6DrzUIGr91h27bz+HwjVFWdx+1OsH37BSLH6+l+p5D+nZWzt0CfS8bXKS1NAZHemauYy6qkht5g5PU1pHVG/r5+E4BMZoobN4I8efIPAPHaY6R1Rob32cgkSmZmgEch1LhEBbS2mWeHYC6rEt/5ESl9MYkDXwJgtw9RUfEDk5OPeDo9TbhiLfeWFzNy7gh/9ZtJDVkJuBUiO/Jbfs4CqmpL6e+RSAxYCHkV3Oc+x2Ez8MfBQmJn6nk8/ZjOzrtMj43Rf7SK374qwPmxBdfVSiZSpQyFLPQ6JUYLlqgAi1ZOMmolGjAT8ChEgyU4Dn+A/YiBlN5IUipjdO17JPUSQ6qRpsOv4j63i4dplQG/mexICe6rK/Jefl4CdtYqBHpkBvxmclmVTGI1kVN7iEvq7MnHdEaib60jcrmGiVQZUxkVv1Oms8VETMp/+XkJsGjl7D1hJeiVCXkVpjLP5sFAJYPXDxD8aR/Rjv3ci60nl1WZSJXOTH6HRNy6OPYB8xZg0crZWleK3ynT71YY7DPzYLSUiVQpAY8yux0OPrcdTpjyX/qFCrBo5Vhryjj7s5m+Hhlft0zAI9HrkPA7JbxdEkGPQmRX/l97F0zA81llU9lSa8HRpEwNvmYgqV88y/1/EfBfXtqPokKAECAECAFCgBCwhARYtZWXFiJn1yinMwWmS4s9+f5JTSAQCAQCgUAgEAjywr/ZVBJ3mPtZuAAAAABJRU5ErkJggg=="},
        //{title: "中国人", value: "zh", countryFlag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACIElEQVR4nO2av08TcRjG+6+01LxvHVQSZMCYGCXWCAMOJrgRJ+MCgw5EEx2QOLmb+AcwCHFgAQdGh7trKXfFStorP0x0aKhRpOPjcGBSU2iB4kPp+0meNLmm37zPp9/vNZc0FjMMwzAMwzAMw+hGnLjMdHNiTlzQzWmLgMxlgZcS+Lf4hSgCwgnFz0+K4iN+oVMR8Pn+we+5ScHWa8VOVrE1Lcj28Uu1VUDumqC6oE0XKjwQuBf4hdouoDypqIWK3EDri+aHBcEdweoIv+CRBeQGBH5a4N8WBGlBdVFQC6PtHexd99MC71LjBT0VbLyIPlMa5xc8soDlq4LKh6hAw5QUm1MKN3mAgJQgPySoLinWn539Y9HwCLhJwcZLRa1YX/6Xo1i919rC/k1+uWML2M/2fL2A8hP+wP9NQLZPUCspdtcUlblIQGW2+a/BfjJX+OVOJCAcV/xYUgSDAichKD5W7OS1aTHvomC5X/HtbXQ/6ch7gBMXrD1UeKn6ays3BMHdw3eBlxJ8fxfdRNefC5wefsljCThJwglF+FRRGG39yHS0ADcZffMr1/euJf55PcNpi4DypGL7o+LLGL8QRcDmK8XvvOLrGz1/D0NN0xNt/8KoItPLL0TZAX/TAWf+dAV0YEwAewB2TAB7AHZMAHsAdkwAewB2TAB7AHZMAHsAdkwAewB2TAB7AHZiTkLfd3PYf1IzDMMwDMMwDMOg8AdY5LBZmahqcAAAAABJRU5ErkJggg=="},
        //{title: "日本語", value: "ja", countryFlag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABeklEQVR4nO2aPW7CQBCFfZMIRXQUlEjcJoScgp/rpEgoKGixi1BhfIK1WxfQ2Evl4qWyRBQj2cmOR2LfJ01r3nyw3vXgICCEEEIIIYQQHwHw7nMF8BwK0A6gDQVoB9CGArQ+uLIWhTEojEFlrVaMfgWcjzGSxQq7yRSfT88/ajeZIlmscIlPfUbqR0CZZvh6mf9q+l4dZnOUadZHNHkB+T7EdjRu3Xxd29EYeRhJx5MVkO9DbAbDzs3XtRkMxSWICSjT7E/ffNMvQXI5iAnosubb3BOkEBFwPsbOmq9LancQEZAsVs4FJMu1RFQZAU37/H9rN5lKRHUvoLLWefN1VfbqOq57AYUxYgIKY1zHpQAuAedXhOc3QYDbIA9CgOdHYYAPQwCAPIz8fRyuycPI34FITZlmOMw6jMRe3x5nJHbLJT4hWa7vD0WX68ccijZR2evNWNz9Ca8t/GNEO4A2FKAdQBsK0A6gTQDgw+fSfkmNEEIIIYQQQlT4Br+ujKb91WeKAAAAAElFTkSuQmCC"},
        //{title: "한국어", value: "ko", countryFlag: "data:image/png;base64,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"},
        //{title: "عرب", value: "ar", countryFlag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAs0lEQVR4nO3QsQ1BURiA0X+FR1QSFTXRI6JTm0IjYQKFikSiZQCFARQ63gKiMc0zhNvcvPMl3wInQpIkSZLq2COG1xTvx73j9NK65nY8YlCleDfrlpNzs8ptAAAAAAAAAAAAAAD+/DIfvdb3xSe3kwF8V4eyyjAAAAAAAAAAAAAAAAD897bRfxZF8c7tZADLaJcRUWU3AAAAAAAAAAAAgPoC9G8p3kTnFBG3DJckSZKk+vUD4GJjvgc8XTAAAAAASUVORK5CYII="},
      ]


    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.containerText}>
                <Image source={require('../../img/new-logo-msh.png')} style={{width: "75%", height: "55%", marginLeft: 75}} />
            </View>
            <View style={styles.inputContainer}>
                <Input placeholder={t('email')} autofocus type="email" value={email} 
                onChangeText={(text) => setEmail(text)} />
                <Input placeholder={t('mot_de_passe')} secureTextEntry type="password" value={password} 
                onChangeText={(text) => setPassword(text)} />
            </View>
            <Button raised={true} onPress={() => Login()} containerStyle={styles.button} title={t('connection')} />
            {userDB === null && <Button raised={true} onPress={() => navigation.navigate('Inscription')} containerStyle={styles.button} title={t('creation_compte')} type="clear" />}
       
            <Modal 
            animationType="slide"
            transparent={true}
            visible={showModalLanguage} 
            style={styles.centeredView}>
                <ScrollView contentContainerStyle={styles.modalView}>
                    <View style={{
                        flexDirection: "row", 
                        width: 420, 
                        alignItems: "center", 
                        justifyContent: "center", 
                        marginBottom: 10, 
                        paddingTop: 10, 
                        paddingBottom: 10, 
                        backgroundColor: "lightblue"}}>
                        <Text style={{fontSize: 25, marginRight: 20}}>{t('selection_langue')}</Text>
                        <TouchableOpacity>
                            <AntDesign name="closecircle" size={24} color="black" onPress={() => setShowModalLanguage(false)} />
                        </TouchableOpacity>
                    </View>
                {internationalization.map(data =>(
                    <View style={{
                        padding: 15, 
                        marginBottom: 30}}>
                            <TouchableOpacity activeOpacity={0.5} style={{flexDirection: "row", justifyContent: "center"}} onPress={() => {
                                setShowModalLanguage(false)
                                i18next.changeLanguage(data.value)
                            }}>
                                <Image source={{uri: data.countryFlag}} style={{width: 30, height: 30, marginRight: 15}} />
                                <Text style={{fontSize: 15}}>
                                    {data.title}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )) }
                </ScrollView>
            </Modal>
        </KeyboardAvoidingView>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    containerText: {
        width: 500, 
        height: 300, 
        flexDirection: "row", 
        justifyContent: "center", 
        alignItems: "center"
    },
    text: {
        fontSize: 40,
        textAlign: "center"
    },
    inputContainer: {
        width: 300,
        marginBottom: 50
    },
    button: {
        width: 200,
        marginTop: 10, 
        borderColor: "white",
        borderRadius: 30
 
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
    modalView: {
        marginTop: 55,
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
    }
})
