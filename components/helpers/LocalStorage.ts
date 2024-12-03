import * as SecureStore from "expo-secure-store";

const compatible = SecureStore.isAvailableAsync();

export const write = async (key:string, value:string) => {
  if (!compatible) return;

  const data = JSON.stringify(value);
  return await SecureStore.setItemAsync(key, data);
};

export const read = async (key:string) => {
  if (!compatible) return;

  return SecureStore.getItemAsync(key)
    .then((res) => JSON.parse(`${res}`))
    .catch((rej) => null);
};

export const remove = async (key:string) => {
  if (!compatible) return;

  return await SecureStore.deleteItemAsync(key);
};

// clear all use info
export const clear = async () => {
  if (!compatible) return;
  const keys = [
    "userToken",
    "userId",
    "userFirstName",
    "userLastName",
    "userEmail",
  ];
  keys.forEach((key) => {
    remove(key)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.warn(err);
      });
  });

  return;
};
