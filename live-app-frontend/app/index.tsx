// app/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    SecureStore.getItemAsync('token').then((token) => {
      if (token) router.replace('/tabs');
      else router.replace('/login');
    });
  }, []);

  return null;
}
