import { Image, Dimensions, StyleSheet, Alert } from "react-native";
import { Box, Input, Icon, Pressable, Text, Button, Heading, Link } from "native-base";
import Spinner from "../components/helpers/Spinner";
import { Stack, useRouter } from "expo-router";
import { write, read } from "../components/helpers/LocalStorage";
import { MaterialIcons } from "@expo/vector-icons";
import { useLogin } from "../api/auth";
import { useState, useEffect } from "react";
import { t } from "i18next";
const { width } = Dimensions.get("screen");
const ratio = (width * 0.8) / 270;

export default function Login() {
  const logo = require("../assets/images/logo.png");
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const responseQuery = useLogin(username, password);
  const router = useRouter();

  const submitForm = () => {
    if (!username || !password)
      return Alert.alert("Error", "Please fill all fields!");
    responseQuery.refetch();
  };

  useEffect(() => {
    if (responseQuery.error) {
      setUsername("");
      setPassword("");
      Alert.alert("Error", "Usuario o contraseña incorrecta");
    }
  }, [responseQuery.isError]);

  useEffect(() => {
    readUserLogged();
  }, []);

  const readUserLogged = async () => {
    const data = await read("userToken");
    if (data) {
      router.replace("/(tabs)/home");
    }
  };

  useEffect(() => {
    const response = responseQuery.data;
    if (response) {
      write("userToken", response.token).then((res) => res);
      write("userId", response._id).then((res) => res);
      write("userName", response.name).then((res) => res);
      write("userLastName", response.lastname).then((res) => res);
      write("userEmail", response.email).then((res) => res);
      setUsername("");
      setPassword("");
      router.replace("/(tabs)/home");
    }
  }, [responseQuery.isSuccess]);

  const renderBodyLogin = () => (
    <Box>
      <Box alignSelf={"center"} marginTop={10}>
        <Heading size="lg" color="blue.500">
          Login
        </Heading>
      </Box>
      <Box marginTop={"1"} p="10" pb={4} pt={10}>
        <Input
          variant="underlined"
          onChangeText={setUsername}
          size="lg"
          placeholder="Username"
          keyboardType="email-address"
          InputRightElement={
            <Icon
              as={<MaterialIcons name="person" />}
              size={7}
              ml="2"
              color="muted.400"
            />
          }
        />
      </Box>
      <Box marginTop={"1"} p="10" pb={4} pt={4}>
        <Input
          variant="underlined"
          size="lg"
          onChangeText={setPassword}
          placeholder="Password"
          type={show ? "text" : "password"}
          InputRightElement={
            <Pressable onPress={() => setShow(!show)}>
              <Icon
                as={
                  <MaterialIcons
                    name={show ? "visibility" : "visibility-off"}
                  />
                }
                size={6}
                mr="2"
                color="muted.400"
              />
            </Pressable>
          }
        />
        <Link
          _text={{
            fontSize: "sm",
            fontWeight: "500",
            color: "blue.500"
          }}
          alignSelf="flex-end" mt="3"
          onPress={() => router.push('/recoverPass/step1')}
        >
          {t('forgetPassword')}
        </Link>
      </Box>
      <Box paddingX={20} marginTop={9}>
        <Button bgColor={"blue.500"} rounded={"3xl"} onPress={submitForm}>
          Login
        </Button>
      </Box>
      <Box paddingX={20} marginTop={2}>
        <Button rounded={"3xl"} onPress={() => router.push('/register')}>{t('register')}</Button>
      </Box>
    </Box>
  );

  return (
    <Box bgColor={"blue.100"} flex={1}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Box marginTop={"12"} alignSelf={"center"}>
        <Image source={logo} style={styles.logo} />
      </Box>
      {responseQuery.isFetching ? <Spinner /> : renderBodyLogin()}
    </Box>
  );
}
const styles = StyleSheet.create({
  logo: {
    width: width * 0.8,
    height: 100 * ratio,
    resizeMode: "contain",
  },
  spinner: {
    marginBottom: 50,
  },
});
