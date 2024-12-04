import { Stack, useNavigation } from "expo-router";
import { Box, VStack, Text, HStack } from "native-base";
import { InputForm, Spinner, onError, useOptions } from "../../../components";
import { t } from "i18next";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useGetCompany, useSetConfigEmail, useUploadImage } from "../../../api/company";
import { Colors, ConfigPDF } from "../../../types/company";
import { useEffect, useState } from "react";
import { SelectImage, TextAreaForm } from "../../../components/Form";

export default () => {
  const navigation = useNavigation();
  const configMutation = useSetConfigEmail();
  const responseQuery = useGetCompany(false);
  const [errors, setErrors] = useState({});
  const [textBody, setTextBody] = useState<string>('');
  const [formData, setData] = useState<Colors>();
  const [image, setImage] = useState<any>();
  const uploadMutation = useUploadImage();

  const saveAction = () => {
    if (formData)
      formData.id = responseQuery?.data?._id;
    configMutation.mutate({ data: formData!, textBody });
  }

  useEffect(() => {
    if (image) {
      uploadMutation.mutate({ image, imageType: 'logoAlpha' });
    }
  }, [image])

  useEffect(() => {
    if (configMutation.isError) {
      onError(configMutation.error);
    }
  }, [configMutation.isError]);

  useEffect(() => {
    if (responseQuery.isSuccess) {
      setData(responseQuery.data.configMail?.colors);
      setTextBody(responseQuery.data.configMail?.textBody!);
    }
  }, [responseQuery.isSuccess])

  const renderColorsEmail = () => (
    <VStack mx="3">
      <SelectImage
        data={{
          name: "banner",
          title: "Banner",
          value: responseQuery?.data?.banner,
          setImage,
          isLoading: uploadMutation.isPending
        }}
      />
      <Box mt={25}>
        <InputForm
          data={{
            name: "background",
            errors,
            title: t("settings.background"),
            value: String(formData?.background),
            formData,
            setData
          }}
        />
        <InputForm
          data={{
            name: "primary",
            errors,
            title: t("settings.primary"),
            value: String(formData?.primary),
            formData,
            setData
          }}
        />
        <InputForm
          data={{
            name: "secundary",
            errors,
            title: t("settings.secondary"),
            value: String(formData?.secundary),
            formData,
            setData
          }}
        />
        <InputForm
          data={{
            name: "title",
            errors,
            title: t("settings.title"),
            value: String(formData?.title),
            formData,
            setData
          }}
        />
        <TextAreaForm
          data={{
            name: "textBody",
            errors,
            title: t("settings.textBody"),
            value: String(textBody ? textBody : ''),
            formData,
            setValue: setTextBody,
            description: t("settings.textBodyDescription"),
          }}
        />
      </Box>

    </VStack>
  );

  return (
    <Box safeArea flex={1} p={2} w="100%" px='5' mx="auto">
      <Stack.Screen options={useOptions({ title: t("settings.email"), navigation, back: true, save: true, saveAction })} />
      <ScrollView automaticallyAdjustKeyboardInsets>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {responseQuery.isLoading || configMutation.isPending ? (
            <Spinner />
          ) : <Box>
            {renderColorsEmail()}
          </Box>
          }
        </KeyboardAvoidingView>

      </ScrollView>

    </Box>
  )
}