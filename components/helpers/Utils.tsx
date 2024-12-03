import { Alert } from "react-native";

export const FormatDate = (date: string) => {
  const newDate = new Date(date);
  const response = `${newDate.getDate()}/${newDate.getMonth() + 1
    }/${newDate.getFullYear()}`;
  return response;
};

export const onError = (error: any) => {
  let keys = Object.keys(error);
  let messages = "";
  for (let i = 0; i < keys.length; i++) {
    let clave = keys[i];
    messages += error[clave];
  }

  Alert.alert('Error', messages);
}