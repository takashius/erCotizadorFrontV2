import {
  Stack,
  useLocalSearchParams,
  router,
  useNavigation,
} from "expo-router";
import { Box, VStack, HStack, Text, Switch, Button } from "native-base";
import { useOptions } from "../../../components/helpers/OptionsScreens";
import { useEffect, useState } from "react";
import { useCreateProduct, useUpdateProduct } from "../../../api/product";
import { ProductForm } from "../../../types/products";
import { InputForm } from "../../../components/Form";
import Spinner from "../../../components/helpers/Spinner";
import { t } from "i18next";
import { onError } from "../../../components";

export default () => {
  const params = useLocalSearchParams();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const { post } = params;
  const navigation = useNavigation();
  const [errors, setErrors] = useState({});
  const defaultData = {
    name: "",
    iva: false,
    price: Number(""),
    description: "",
    id: "",
  };

  const transformData = (params: any) => ({
    name: params.name,
    iva: String(params.iva) === "true",
    price: Number(params.price),
    description: params.description,
    id: params.id,
  });

  const [formData, setData] = useState<ProductForm>(
    post === "new" ? defaultData : transformData(params)
  );

  useEffect(() => {
    if (createMutation.isError) {
      onError(createMutation.error);
    }
  }, [createMutation.isError]);

  const validate = () => {
    if (formData.name === undefined || formData.name === "") {
      setErrors({ ...errors, name: t("products.validations.nameRequired") });
      return false;
    } else if (formData.name.length < 3) {
      setErrors({ ...errors, name: t("products.validations.nameShort") });
      return false;
    } else if (!formData.price) {
      setErrors({ ...errors, price: t("products.validations.priceRequired") });
      return false;
    } else if (formData.price < 0) {
      setErrors({ ...errors, price: t("products.validations.priceIncorrect") });
      return false;
    }
    setErrors({});
    return true;
  };

  const onSubmit = () => {
    validate() && submitForm();
  };

  const submitForm = () => {
    if (post === "new") {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate(formData);
    }
  };

  const renderForm = () => (
    <VStack mx="3">
      <InputForm
        data={{
          name: "name",
          errors,
          title: t("name"),
          placeholder: t("products.placeholder.name"),
          value: formData.name,
          formData,
          setData,
          require: true,
          description: t("products.nameDescription"),
        }}
      />
      <InputForm
        data={{
          name: "description",
          errors,
          title: t("description"),
          placeholder: t("products.placeholder.description"),
          value: formData.description,
          formData,
          setData,
        }}
      />
      <InputForm
        data={{
          name: "price",
          errors,
          title: t("price"),
          placeholder: t("products.placeholder.price"),
          value: String(formData.price),
          formData,
          setData,
          keyboardType: "number-pad",
          require: true,
          description: t("products.priceDescription"),
        }}
      />
      <HStack alignItems="center" space={4}>
        <Text>{t("tax")}</Text>
        <Switch
          size="sm"
          offTrackColor="blue.100"
          onTrackColor="blue.200"
          onThumbColor="blue.500"
          offThumbColor="blue.50"
          defaultIsChecked={params["iva"] === "true"}
          onValueChange={() => {
            setData({ ...formData, iva: !formData.iva });
          }}
        />
      </HStack>
      <Button bgColor={"blue.500"} rounded={"3xl"} onPress={onSubmit} mt="5">
        {t("submit")}
      </Button>
    </VStack>
  );

  return (
    <Box bg="white" safeArea flex="1">
      <Stack.Screen
        options={useOptions({
          title: post == "new" ? t("products.new") : t("products.edit"),
          navigation,
          back: true
        })}
      />
      {createMutation.isPending || updateMutation.isPending ? (
        <Spinner />
      ) : createMutation.isSuccess || updateMutation.isSuccess ? (
        router.back()
      ) : (
        renderForm()
      )}
    </Box>
  );
};
