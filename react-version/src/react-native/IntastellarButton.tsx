import React from 'react';
import { TouchableOpacity, Text, Image, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useIntastellarRN } from './useIntastellarRN';
import { IntastellarConfig, IntastellarTheme } from '../types';

interface IntastellarButtonProps extends IntastellarConfig {
  theme?: IntastellarTheme;
  style?: any;
  textStyle?: any;
}

export const IntastellarButton: React.FC<IntastellarButtonProps> = ({
  theme = { theme: 'light', picker: 'button' },
  style,
  textStyle,
  ...config
}) => {
  const { users, isLoading, signin } = useIntastellarRN(config);

  const handlePress = () => {
    if (users.length === 1) {
      signin(users[0].email);
    } else {
      signin();
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Loading...';
    if (users.length === 1) return `Continue as ${users[0].name.first}`;
    return 'Sign in with Intastellar';
  };

  const isDark = theme.theme === 'dark';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isDark ? styles.darkButton : styles.lightButton,
        style,
      ]}
      onPress={handlePress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={isDark ? '#fff' : '#3c4043'} />
      ) : (
        <View style={styles.content}>
          {users.length === 1 && (
            <Image
              source={{ uri: users[0].image }}
              style={styles.profileImage}
            />
          )}
          <Image
            source={{ uri: 'https://www.intastellarsolutions.com/assets/logos/intastellar-new-planet.svg' }}
            style={styles.logo}
          />
          <Text style={[
            styles.text,
            isDark ? styles.darkText : styles.lightText,
            textStyle,
          ]}>
            {getButtonText()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
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
    gap: 8,
  },
  profileImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  logo: {
    width: 18,
    height: 18,
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
