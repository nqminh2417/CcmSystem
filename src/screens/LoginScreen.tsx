import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
    const handleLogin = () => {
        // TODO: sau này bạn xử lý login thật ở đây
        navigation.replace('Home'); // hoặc navigation.navigate('Home');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login Screen</Text>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Go to Home</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 24,
    },
    button: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#007bff',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
