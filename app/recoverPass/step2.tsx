import { Image, Dimensions, StyleSheet, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { Box, Button, Center, Heading, Icon, Input, Toast } from "native-base";
import { t } from "i18next";
import { MaterialIcons } from "@expo/vector-icons";
import { Recovery, useRecoveryTwo } from "../../api/auth";
import { useEffect, useState } from "react";
import { Spinner } from "../../components";
import { onError } from "../../components/helpers/Utils";
const { width } = Dimensions.get("screen");
const ratio = (width * 0.8) / 270;

export default () => {
  const [code, setCode] = useState<string>();
  const [show, setShow] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [password, setPassword] = useState<string>();
  const [passwordRepeat, setPasswordRepeat] = useState<string>();
  const logo = require("../../assets/images/logo.png");
  const params = useLocalSearchParams();
  const recoveryMutation = useRecoveryTwo();
  const { email } = params;

  useEffect(() => {
    if (recoveryMutation.isError) {
      onError(recoveryMutation.error);
    }
  }, [recoveryMutation.isError])

  useEffect(() => {
    if (recoveryMutation.isSuccess) {
      Alert.alert("", t('recoveryPass.success_change'), [
        { text: "Ok", onPress: () => router.push('/login') },
      ]);
    }
  }, [recoveryMutation.isSuccess])

  const submitForm = () => {
    if (code === undefined || code === '') {
      return Alert.alert('', t('recoveryPass.empty_code'));
    } else if (code.length !== 6) {
      return Alert.alert('', t('recoveryPass.wrong_code'));
    } else if (password === undefined || password === '') {
      return Alert.alert('', t('company.validations.passwordRequired'));
    } else if (password !== passwordRepeat) {
      return Alert.alert('', t('company.validations.passwordMatch'));
    }
    else {
      const data: Recovery = {
        code: code!,
        email: email.toString(),
        newPass: password
      }
      recoveryMutation.mutate(data);
    }
  }

  return (
    <Box safeArea flex={1} p={2} w="100%" padding='5' mx="auto" bgColor={"blue.100"}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Box marginTop={"12"} alignSelf={"center"}>
        <Image source={logo} style={styles.logo} />
        <Center mt="6">
          <Heading size="lg" color="blue.500">
            {t('recoveryPass.step2.title')}
          </Heading>
          <Heading color="muted.400" size="xs" px="6">
            {t('recoveryPass.step2.subtitle')}
          </Heading>
        </Center>
      </Box>
      {recoveryMutation.isPending ? <Spinner /> :
        <ScrollView automaticallyAdjustKeyboardInsets>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >

            <Box marginTop={"1"} p="10" pb={4} pt={6}>
              <Input
                variant="underlined"
                onChangeText={setCode}
                size="lg"
                keyboardType="number-pad"
                maxLength={6}
                placeholder={t('recoveryPass.step2.code')}
                InputRightElement={
                  <Icon
                    as={<MaterialIcons name="lock" />}
                    size={7}
                    ml="2"
                    color="muted.400"
                  />
                }
              />
              <Input
                marginTop='12'
                variant="underlined"
                size="lg"
                onChangeText={setPassword}
                placeholder="New Password"
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
              <Input
                marginTop='3'
                variant="underlined"
                size="lg"
                onChangeText={setPasswordRepeat}
                placeholder="Repeat Password"
                type={showRepeat ? "text" : "password"}
                InputRightElement={
                  <Pressable onPress={() => setShowRepeat(!showRepeat)}>
                    <Icon
                      as={
                        <MaterialIcons
                          name={showRepeat ? "visibility" : "visibility-off"}
                        />
                      }
                      size={6}
                      mr="2"
                      color="muted.400"
                    />
                  </Pressable>
                }
              />
            </Box>

            <Box paddingX={20} marginTop={9}>
              <Button bgColor={"blue.500"} rounded={"3xl"} onPress={submitForm}>
                {t('submit')}
              </Button>
            </Box>
          </KeyboardAvoidingView>
        </ScrollView>
      }
    </Box>
  )
}

const styles = StyleSheet.create({
  logo: {
    width: width * 0.8,
    height: 100 * ratio,
    resizeMode: "contain",
  }
});