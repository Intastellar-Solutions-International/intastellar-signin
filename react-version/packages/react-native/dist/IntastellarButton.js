var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator, Image as ReactNativeImage } from 'react-native';
import { useIntastellarRN } from './useIntastellarRN';
export const IntastellarButton = (_a) => {
    var { theme = { theme: 'light', picker: 'button' }, style, textStyle } = _a, config = __rest(_a, ["theme", "style", "textStyle"]);
    const { users, isLoading, signin } = useIntastellarRN(config);
    const handlePress = () => {
        if (users.length === 1) {
            signin(users[0].email);
        }
        else {
            signin();
        }
    };
    const getButtonText = () => {
        if (isLoading)
            return 'Loading...';
        if (users.length === 1)
            return `Continue as ${users[0].name.first}`;
        return 'Sign in with Intastellar';
    };
    const isDark = theme.theme === 'dark';
    return (<TouchableOpacity style={[
            styles.button,
            isDark ? styles.darkButton : styles.lightButton,
            style,
        ]} onPress={handlePress} disabled={isLoading}>
      {isLoading ? (<ActivityIndicator color={isDark ? '#fff' : '#3c4043'}/>) : (<View style={styles.content}>
          {users.length === 1 ?
                <>
              <ReactNativeImage source={{ uri: users[0].image }} style={styles.profileImage} resizeMode="cover"/>
                <Text style={[
                        styles.text,
                        isDark ? styles.darkText : styles.lightText,
                        textStyle,
                    ]}>
                {getButtonText()}
              </Text>
              <ReactNativeImage source={{ uri: 'https://www.intastellarsolutions.com/assets/logos/intastellar-new-planet.png' }} style={styles.logo} resizeMode="contain"/>
            </>
                : <>
              <ReactNativeImage source={{ uri: 'https://www.intastellarsolutions.com/assets/logos/intastellar-new-planet.png' }} style={styles.logo} resizeMode="contain"/>
                <Text style={[
                        styles.text,
                        isDark ? styles.darkText : styles.lightText,
                        textStyle,
                    ]}>
                {getButtonText()}
              </Text>
          </>}
          
        </View>)}
    </TouchableOpacity>);
};
const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 4,
        borderWidth: 1,
        minHeight: 44,
    },
    lightButton: {
        backgroundColor: '#fff',
        borderColor: '#dadce0',
    },
    darkButton: {
        backgroundColor: '#2d2d2d',
        borderColor: '#5f6368',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 8,
    },
    logo: {
        width: 18,
        height: 18,
        marginRight: 8,
    },
    logoContainer: {
        width: 18,
        height: 18,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 12,
        color: '#4285f4',
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
    },
    lightText: {
        color: '#3c4043',
    },
    darkText: {
        color: '#fff',
    },
});
//# sourceMappingURL=IntastellarButton.js.map