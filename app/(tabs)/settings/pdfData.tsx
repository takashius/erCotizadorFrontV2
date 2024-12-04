import { Stack, useNavigation } from "expo-router";
import { Box, VStack, Text, HStack } from "native-base";
import { InputForm, Spinner, onError, useOptions } from "../../../components";
import { t } from "i18next";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useGetCompany, useSetConfigPdf, useUploadImage } from "../../../api/company";
import { ConfigPDF } from "../../../types/company";
import { useEffect, useState } from "react";
import { SelectImage } from "../../../components/Form";

export default () => {
  const navigation = useNavigation();
  const configMutation = useSetConfigPdf();
  const responseQuery = useGetCompany(true);
  const [errors, setErrors] = useState({});
  const [formData, setData] = useState<ConfigPDF>();
  const [image, setImage] = useState<any>();
  const uploadMutation = useUploadImage();

  const saveAction = () => {
    transformData(formData);
    configMutation.mutate(formData!);
  }

  const transformData = (dataForm: any) => {
    if (formData) {
      formData.id = responseQuery?.data?._id!;
      if (dataForm.xLogo) {
        formData.logo.x = dataForm.xLogo;
      }
      if (dataForm.yLogo) {
        formData.logo.y = dataForm.yLogo;
      }
      if (dataForm.widthLogo) {
        formData.logo.width = dataForm.widthLogo;
      }
      if (dataForm.xAlpha) {
        formData.logoAlpha.x = dataForm.xAlpha;
      }
      if (dataForm.yAlpha) {
        formData.logoAlpha.y = dataForm.yAlpha;
      }
      if (dataForm.widthAlpha) {
        formData.logoAlpha.width = dataForm.widthAlpha;
      }
    }
  }

  useEffect(() => {
    if (image) {
      uploadMutation.mutate({ image, imageType: 'logoAlpha' });
    }
  }, [image])

  useEffect(() => {
    if (responseQuery.isSuccess) {
      setData(responseQuery.data.configPdf);
    }
  }, [responseQuery.isSuccess]);

  useEffect(() => {
    if (configMutation.isError) {
      onError(configMutation.error);
    }
  }, [configMutation.isError]);

  const renderColorLogo = () => (
    <VStack mx="3">
      <Text color={"blue.500"} fontWeight="500" fontSize={20} pl={1} pb={4}>
        {t("logo")}
      </Text>
      <InputForm
        data={{
          name: "widthLogo",
          errors,
          title: t("settings.width"),
          value: String(formData?.logo.width),
          formData,
          setData,
          keyboardType: "decimal-pad"
        }}
      />
      <HStack>
        <InputForm
          data={{
            col: true,
            name: "xLogo",
            errors,
            title: t("settings.x"),
            value: String(formData?.logo.x),
            formData,
            setData,
            keyboardType: "decimal-pad"
          }}
        />
        <InputForm
          data={{
            col: true,
            name: "yLogo",
            errors,
            title: t("settings.y"),
            value: String(formData?.logo.y),
            formData,
            setData,
            keyboardType: "decimal-pad"
          }}
        />
      </HStack>

    </VStack>
  );

  const renderColorLogoAlpha = () => (
    <VStack mx="3">
      <Text color={"blue.500"} fontWeight="500" fontSize={20} pl={1} py={4}>
        {t("settings.logoAlpha")}
      </Text>
      <SelectImage
        data={{
          name: "logoAlpha",
          title: t("logo"),
          value: responseQuery?.data?.logoAlpha,
          setImage,
          isLoading: uploadMutation.isPending
        }}
      />
      <InputForm
        data={{
          name: "widthAlpha",
          errors,
          title: t("settings.width"),
          value: String(formData?.logoAlpha.width),
          formData,
          setData,
          keyboardType: "decimal-pad"
        }}
      />
      <HStack>
        <InputForm
          data={{
            col: true,
            name: "xAlpha",
            errors,
            title: t("settings.x"),
            value: String(formData?.logoAlpha.x),
            formData,
            setData,
            keyboardType: "decimal-pad"
          }}
        />
        <InputForm
          data={{
            col: true,
            name: "yAlpha",
            errors,
            title: t("settings.y"),
            value: String(formData?.logoAlpha.y),
            formData,
            setData,
            keyboardType: "decimal-pad"
          }}
        />
      </HStack>

    </VStack>
  );

  return (

    <Box safeArea flex={1} p={2} w="100%" px='5' mx="auto">
      <Stack.Screen options={useOptions({ title: t("settings.pdf"), navigation, back: true, save: true, saveAction })} />
      <ScrollView automaticallyAdjustKeyboardInsets>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {responseQuery.isLoading || configMutation.isPending ? (
            <Spinner />
          ) : <Box>
            {renderColorLogo()}
            {renderColorLogoAlpha()}
          </Box>
          }
        </KeyboardAvoidingView>

      </ScrollView>

    </Box>
  )
}