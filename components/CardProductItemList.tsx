import React from "react";
import { Link } from "expo-router";
import {
  Box,
  HStack,
  Text,
  Icon,
  Stack as _Stack,
  Heading,
  VStack,
} from "native-base";
import Card from "./helpers/Card";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { ProductForm } from "../types/products";
import { t } from "i18next";

const CardProductItemList = ({ item }: { item: ProductForm }) => {
  const renderCard = () => (
    <Card>
      <_Stack p="4" space={0}>
        <_Stack space={2}>
          <Heading size="md" color={"blue.500"}>
            {item.name}
          </Heading>
        </_Stack>
        <Text>{item.description}</Text>
        <HStack space={3} justifyContent="left">
          <VStack flex={1}>
            <HStack>
              <Icon
                marginTop={1}
                as={<FontAwesome name="dollar" />}
                size={4}
                color={"blue.500"}
              />
              <Text>{item.price}</Text>
            </HStack>
          </VStack>
          <VStack flex={1} alignItems={"flex-end"}>
            <HStack>
              <Text>{t("tax")}: </Text>
              <Icon
                marginTop={1}
                as={
                  <MaterialCommunityIcons
                    name={
                      item.iva
                        ? "checkbox-marked-circle-outline"
                        : "close-circle-outline"
                    }
                  />
                }
                size={4}
                color={item.iva ? "blue.500" : "red.300"}
              />
            </HStack>
          </VStack>
        </HStack>
      </_Stack>
    </Card>
  )

  return (
    <Box alignItems="center" marginBottom={5}>
      <Link
        href={{
          pathname: "/(tabs)/products/form",
          params: {
            post: "edit",
            id: item._id!,
            name: item.name,
            description: item.description,
            price: item.price,
            iva: String(item.iva),
          },
        }}
      >{renderCard()}</Link>

    </Box>
  );
};

export default CardProductItemList;
