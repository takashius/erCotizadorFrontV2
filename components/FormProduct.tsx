import { Box, HStack, Heading, Switch, Text } from "native-base";
import { ProductsFormProps } from "../types/general";
import { InputForm, SelectDropdownForm } from "./Form";
import { t } from "i18next";
import { useState } from "react";

const FormProduct = (props: ProductsFormProps) => {
  const { post, params, errors, setErrors, formData, setData, productList } = props;
  const [valueIva, setValueIva] = useState(params ? params['iva'] : false);

  return (
    <Box>
      {post === 'new' ?
        <SelectDropdownForm
          data={{
            name: "master",
            errors,
            selectData: productList.data,
            readonly: true,
            title: t("products.title"),
            placeholder: t("cotiza.placeholder.product"),
            value: formData.master,
            require: true,
            formData,
            setData
          }} /> :
        <Heading size="md" mb="2" alignSelf={"center"} color={"blue.500"}>
          {formData.name}
        </Heading>
      }
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
        }}
      />
      <InputForm
        data={{
          name: "amount",
          errors,
          title: t("amount"),
          placeholder: t("products.placeholder.amount"),
          value: String(formData.amount),
          formData,
          setData,
          keyboardType: "number-pad",
          require: true,
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
          value={valueIva}
          onValueChange={(value) => {
            setData({ ...formData, iva: value });
            setValueIva(value);
          }}
        />
      </HStack>
    </Box>
  );
}

export default FormProduct;