import { getRandomValues, randomUUID } from 'expo-crypto';

if (typeof global.crypto === 'undefined') {
  global.crypto = { getRandomValues, randomUUID } as Crypto;
}
