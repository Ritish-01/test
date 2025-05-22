// app/login.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import * as Device from 'expo-device';
import { router } from 'expo-router';
import { requestOtp } from '../lib/auth';

export default function Login() {
  const [email, setEmail] = useState('');

  const handleSendOtp = async () => {
    if (!email) return Alert.alert('Enter a valid email');

    const deviceId = Device.osBuildId || Device.deviceName || 'unknown-device';
    try {
      await requestOtp(email, deviceId);
      router.push({ pathname: '/verify', params: { email, deviceId } });
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to send OTP');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter your email</Text>
      <TextInput
        placeholder="email@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title="Send OTP" onPress={handleSendOtp} />
    </View>
  );
}
