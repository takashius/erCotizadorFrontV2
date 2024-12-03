import { Box, Text, HStack, Switch, VStack, Button } from "native-base";
import { type CustomerFormProps } from "../types/general";
import { InputForm } from "./Form";
import { t } from "i18next";

const CustomerForm = (props: CustomerFormProps) => {
  const { post, params, errors, setErrors, formData, setData, onSubmit } =
    props;
  return (
    <VStack mx="3">
      <HStack>
        <InputForm
          data={{
            col: true,
            name: "title",
            errors,
            title: t("title"),
            placeholder: t("customer.placeholder.title"),
            value: formData.title,
            formData,
            setData,
            require: true,
          }}
        />
        <InputForm
          data={{
            col: true,
            name: "email",
            errors,
            title: t("email"),
            placeholder: t("customer.placeholder.email"),
            value: formData.email,
            formData,
            setData,
            keyboardType: "email-address",
            require: true,
          }}
        />
      </HStack>
      <HStack>
        <InputForm
          data={{
            col: true,
            name: "name",
            errors,
            title: t("name"),
            placeholder: t("customer.placeholder.name"),
            value: formData.name,
            formData,
            setData,
            require: true,
          }}
        />
        <InputForm
          data={{
            col: true,
            name: "lastname",
            errors,
            title: t("lastname"),
            placeholder: t("customer.placeholder.lastname"),
            value: formData.lastname,
            formData,
            setData,
            require: true,
          }}
        />
      </HStack>
      <HStack>
        <InputForm
          data={{
            col: true,
            name: "rif",
            errors,
            title: t("rif"),
            placeholder: t("customer.placeholder.rif"),
            value: formData.rif,
            formData,
            setData,
            require: true,
          }}
        />
        <InputForm
          data={{
            col: true,
            name: "phone",
            errors,
            title: t("phone"),
            placeholder: t("customer.placeholder.phone"),
            value: formData.phone,
            formData,
            keyboardType: "phone-pad",
            setData,
            require: false,
          }}
        />
      </HStack>

      {post === "new" && (
        <Box>
          <Text color={"blue.500"} fontWeight="500" fontSize={20} pl={1} py={4}>
            {t("address.title_single")}
          </Text>

          <HStack>
            <InputForm
              data={{
                col: true,
                name: "address.line1",
                errors,
                title: t("address.placeholder.line1"),
                placeholder: t("address.placeholder.line1"),
                value: "",
                formData,
                setData,
                require: true,
              }}
            />
            <InputForm
              data={{
                col: true,
                name: "address.line2",
                errors,
                title: t("address.placeholder.line2"),
                placeholder: t("address.placeholder.line2"),
                value: "",
                formData,
                setData,
                require: false,
              }}
            />
          </HStack>

          <HStack>
            <InputForm
              data={{
                col: true,
                name: "address.city",
                errors,
                title: t("city"),
                placeholder: t("address.placeholder.city"),
                value: "",
                formData,
                setData,
                require: true,
              }}
            />
            <InputForm
              data={{
                col: true,
                name: "address.zip",
                errors,
                title: t("address.placeholder.zip"),
                placeholder: t("address.placeholder.zip"),
                value: "",
                formData,
                setData,
              }}
            />
          </HStack>
        </Box>
      )}

      <Button bgColor={"blue.500"} rounded={"3xl"} onPress={onSubmit} mt="5">
        {t("submit")}
      </Button>
    </VStack>
  );
};
export default CustomerForm;
