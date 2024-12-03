import { Box, Text, HStack, Switch } from "native-base";
import { type AddressFormProps } from "../types/general";
import { InputForm } from "./Form";
import { t } from "i18next";

const AddressForm = (props: AddressFormProps) => {
  const { post, params, errors, setErrors, formData, setData } = props;
  return (
    <Box>
      <InputForm
        data={{
          name: "title",
          errors,
          title: t("title"),
          placeholder: t("address.placeholder.title"),
          value: formData.title,
          formData,
          setData,
          require: true,
        }}
      />
      <InputForm
        data={{
          name: "city",
          errors,
          title: t("city"),
          placeholder: t("address.placeholder.city"),
          value: formData.city,
          formData,
          setData,
          require: true,
        }}
      />
      <InputForm
        data={{
          name: "line1",
          errors,
          title: t("address.placeholder.line1"),
          placeholder: t("address.placeholder.line1"),
          value: formData.line1,
          formData,
          setData,
          require: true,
        }}
      />
      <InputForm
        data={{
          name: "line2",
          errors,
          title: t("address.placeholder.line2"),
          placeholder: t("address.placeholder.line2"),
          value: formData.line2,
          formData,
          setData,
          require: false,
        }}
      />
      <InputForm
        data={{
          name: "zip",
          errors,
          title: t("address.placeholder.zip"),
          placeholder: t("address.placeholder.zip"),
          value: formData.zip,
          formData,
          setData,
          require: true,
        }}
      />
      <HStack alignItems="center" space={4} mb={2}>
        <Text>{t("default")}</Text>
        <Switch
          size="sm"
          offTrackColor="blue.100"
          onTrackColor="blue.200"
          onThumbColor="blue.500"
          offThumbColor="blue.50"
          defaultIsChecked={params ? params["default"] === "true" : false}
          onValueChange={() => {
            setData({ ...formData, default: formData?.default! });
          }}
        />
      </HStack>
    </Box>
  );
};

export default AddressForm;
