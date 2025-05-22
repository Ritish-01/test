// app/verify.tsx
import { useLocalSearchParams, router } from 'expo-router';
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { verifyOtp } from '../lib/auth';

export default function Verify() {
  const { email, deviceId } = useLocalSearchParams();
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    try {
      const token = await verifyOtp(email, otp, deviceId);
      await SecureStore.setItemAsync('token', token);
      router.replace('/tabs');
    } catch (err) {
      Alert.alert('Verification Failed', err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter OTP sent to {email}</Text>
      <TextInput
        placeholder="123456"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title="Verify OTP" onPress={handleVerify} />
    </View>
  );
}
