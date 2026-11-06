import * as SecureStore from 'expo-secure-store';

const CLAVE_TOKEN = 'zp_token';

export function leerToken() {
  return SecureStore.getItemAsync(CLAVE_TOKEN);
}

export function guardarToken(token: string) {
  return SecureStore.setItemAsync(CLAVE_TOKEN, token);
}

export function borrarToken() {
  return SecureStore.deleteItemAsync(CLAVE_TOKEN);
}
