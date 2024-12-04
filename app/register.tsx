import { Stack, router } from "expo-router";
import { Box, Button, HStack, Heading, Icon, VStack, useToast } from "native-base";
import { useEffect, useState } from "react";
import { Image, StyleSheet, KeyboardAvoidingView, ScrollView, Pressable } from "react-native";
import { InputForm, Spinner } from "../components";
import { t } from "i18next";
import { Register } from "../types/general";
import { MaterialIcons } from "@expo/vector-icons";
import { useRegister } from "../api/auth";
import { onError } from "../components/helpers/Utils";
const width = 170;
const ratio = (width * 0.8) / 270;

export default function register() {
  const logo = require("../assets/images/logo.png");
  const [show, setShow] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [errors, setErrors] = useState<Register>({});
  const [formData, setData] = useState<Register>({});
  const createMutation = useRegister();
  const toast = useToast();

  const validate = (formData: any) => {
    if (formData.name === undefined || formData.name === "") {
      setErrors({ ...errors, name: t('products.validations.nameRequired') });
      return false;
    } else if (formData.name?.length < 3) {
      setErrors({ ...errors, name: t('products.validations.nameShort') });
      return false;
    } else if (formData.email === undefined || formData.email === "") {
      setErrors({ ...errors, email: t('customer.validations.emailRequired') });
      return false;
    } else if (formData.password === undefined || formData.password === "") {
      setErrors({ ...errors, password: t('company.validations.passwordRequired') });
      return false;
    } else if (formData.repeatPassword === undefined || formData.repeatPassword === "") {
      setErrors({ ...errors, repeatPassword: t('company.validations.passwordRepeat') });
      return false;
    } else if (formData.password !== formData.repeatPassword) {
      setErrors({ ...errors, repeatPassword: t('company.validations.passwordMatch') });
      return false;
    } else if (formData.companyName === undefined || formData.companyName === "") {
      setErrors({ ...errors, companyName: t('company.validations.companyNameRequired') });
      return false;
    } else if (formData.companyName?.length < 3) {
      setErrors({ ...errors, companyName: t('products.validations.nameShort') });
      return false;
    } else if (formData.docId === undefined || formData.docId === "") {
      setErrors({ ...errors, docId: t('customer.validations.rifRequired') });
      return false;
    }

    return true;
  };

  const onSubmit = () => {
    validate(formData) ? createMutation.mutate(formData) : console.log('Validation Failed');
  };

  useEffect(() => {
    if (createMutation.isError) {
      onError(createMutation.error);
    }
  }, [createMutation.isError])

  const onRegister = () => {
    router.back();
    toast.show({
      title: t('registerSuccessToast')
    })
  }

  return (
    <Box safeArea flex={1} p={2} w="100%" padding='5' mx="auto" bgColor={"blue.100"}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <HStack alignItems="center">
        <Image source={logo} style={styles.logo} />
        <VStack>
          <Heading size="lg" color="blue.500">
            {t('welcome')}
          </Heading>
          <Heading color="muted.400" size="xs">
            {t('signSubtitle')}
          </Heading>
        </VStack>
      </HStack>

      {createMutation.isPending ? (
        <Spinner />
      ) : createMutation.isSuccess ? (
        onRegister()
      ) : (
        <ScrollView automaticallyAdjustKeyboardInsets>
          <KeyboardAvoidingView
            behavior={'padding'}
          >
            <VStack space={2} mt={5}>
              <InputForm
                data={{
                  name: "name",
                  errors,
                  title: t("name"),
                  value: formData.name,
                  formData,
                  setData,
                  require: true,
                  description: t("products.nameDescription"),
                }}
              />
              <InputForm
                data={{
                  name: "email",
                  errors,
                  title: t("email"),
                  value: formData.email,
                  formData,
                  setData,
                  require: true,
                  keyboardType: 'email-address'
                }}
              />
              <InputForm
                data={{
                  name: "password",
                  errors,
                  title: t("password"),
                  value: formData.password,
                  formData,
                  setData,
                  require: true,
                  type: show ? "text" : "password",
                  InputRightElement: (
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
                  )
                }}
              />
              <InputForm
                data={{
                  name: "repeatPassword",
                  errors,
                  title: t("repeatPassword"),
                  value: formData.repeatPassword,
                  formData,
                  setData,
                  require: true,
                  type: showRepeat ? "text" : "password",
                  InputRightElement: (
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
                  )
                }}
              />

              <Heading color="blue.300" my='3' size="lg">
                {t('company.data')}
              </Heading>

              <InputForm
                data={{
                  name: "companyName",
                  errors,
                  title: t("company.name"),
                  value: formData.companyName,
                  formData,
                  setData,
                  require: true,
                  description: t("products.nameDescription"),
                }}
              />
              <InputForm
                data={{
                  name: "docId",
                  errors,
                  title: t("company.docId"),
                  value: formData.docId,
                  formData,
                  setData,
                  require: true,
                }}
              />

              <VStack space={2} mt={5}>
                <Button bgColor={"blue.500"} rounded={"3xl"} onPress={onSubmit}>
                  {t('signUp')}
                </Button>
              </VStack>
            </VStack>
          </KeyboardAvoidingView>
        </ScrollView>
      )}
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