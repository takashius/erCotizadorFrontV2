import { Stack, router, useNavigation } from "expo-router"
import { VStack, Box, useToast, HStack, Text, Switch } from "native-base"
import { InputForm, Spinner, onError, useOptions } from "../../../components"
import { t } from "i18next"
import { useEffect, useState } from "react"
import { KeyboardAvoidingView, ScrollView } from "react-native"
import { useGetCompany, useSetConfig, useUploadImage } from "../../../api/company"
import { Company } from "../../../types/company"
import { SelectForm, SelectImage } from "../../../components/Form"

export default () => {
  const navigation = useNavigation();
  const [errors, setErrors] = useState({});
  const responseQuery = useGetCompany(true);
  const uploadMutation = useUploadImage();
  const configMutation = useSetConfig();
  const toast = useToast();

  const [formData, setData] = useState<Company>();
  const [image, setImage] = useState<any>();
  const [itemSwitch, setItemSwitch] = useState(true);

  useEffect(() => {
    if (responseQuery.isSuccess) {
      setData(responseQuery.data)
      setData({ ...responseQuery.data, id: responseQuery.data._id })
      setItemSwitch(responseQuery.data?.correlatives?.manageInvoiceCorrelative!)
    }
  }, [responseQuery.isSuccess])

  useEffect(() => {
    if (image) {
      uploadMutation.mutate({ image, imageType: 'logo' });
    }
  }, [image])

  useEffect(() => {
    if (configMutation.isSuccess) {
      router.back();
      toast.show({
        title: t('settings.toastSave')
      })
    }
  }, [configMutation.isSuccess]);

  useEffect(() => {
    if (configMutation.isError) {
      onError(configMutation.error);
    }
  }, [configMutation.isError]);

  const saveAction = () => {
    configMutation.mutate(formData!)
  }

  const currencies = [
    { id: "Bs", title: "Bs" },
    { id: "$", title: "$" },
    { id: "€", title: "€" }
  ];
  const rates = [
    { id: "$", title: "$" },
    { id: "€", title: "€" }
  ];

  const renderForm = () => (
    <VStack mx="3">
      <InputForm
        data={{
          name: "iva",
          errors,
          title: t("tax"),
          value: String(formData?.iva),
          formData,
          setData,
          keyboardType: "decimal-pad"
        }}
      />
      <InputForm
        data={{
          name: "address",
          errors,
          title: t("address.title_single"),
          value: formData?.address,
          formData,
          setData,
        }}
      />
      <InputForm
        data={{
          name: "description",
          errors,
          title: t("description"),
          value: formData?.description,
          formData,
          setData,
        }}
      />
      <InputForm
        data={{
          name: "phone",
          errors,
          title: t("phone"),
          value: formData?.phone,
          formData,
          setData,
          keyboardType: "phone-pad"
        }}
      />
      <InputForm
        data={{
          name: "rif",
          errors,
          title: t("rif"),
          value: formData?.rif,
          formData,
          setData,
        }}
      />
      <SelectForm
        data={{
          name: "currencySymbol",
          search: false,
          errors,
          selectData: currencies,
          title: t("settings.currency"),
          placeholder: t("settings.currencyPlaceholder"),
          value: formData?.currencySymbol,
          formData,
          setData
        }} />
      <SelectForm
        data={{
          name: "currencyRate",
          search: false,
          errors,
          selectData: rates,
          title: t("settings.rates"),
          placeholder: t("settings.currencyPlaceholder"),
          value: formData?.currencySymbol,
          formData,
          setData
        }} />

      <HStack alignItems="center" space={4}>
        <Text>{t("settings.correlatives")}</Text>
        {formData?.correlatives?.manageInvoiceCorrelative !== undefined &&
          <Switch
            size="sm"
            offTrackColor="blue.100"
            onTrackColor="blue.200"
            onThumbColor="blue.500"
            offThumbColor="blue.50"
            defaultIsChecked={formData?.correlatives?.manageInvoiceCorrelative}
            onValueChange={() => {
              if (formData)
                setData({
                  ...formData, correlatives: {
                    ...formData.correlatives!,
                    manageInvoiceCorrelative: !formData?.correlatives?.manageInvoiceCorrelative
                  }
                });
            }}
          />
        }
      </HStack>
      <SelectImage
        data={{
          name: "logo",
          title: t("logo"),
          value: String(formData?.logo),
          setImage,
          isLoading: uploadMutation.isPending
        }}
      />

    </VStack>
  );

  return (
    <Box safeArea flex={1} p={2} w="100%" padding='5' mx="auto">
      <Stack.Screen options={useOptions({ title: t("modules.settings"), navigation, back: true, save: true, saveAction })} />
      <ScrollView automaticallyAdjustKeyboardInsets>
        <KeyboardAvoidingView
          behavior={'padding'}
        >
          {responseQuery.isLoading || configMutation.isPending ? (
            <Spinner />
          ) : renderForm()
          }
        </KeyboardAvoidingView>

      </ScrollView>

    </Box>
  )
}