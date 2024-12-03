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
  Badge,
} from "native-base";
import Card from "./helpers/Card";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { ProductForm } from "../types/products";
import { t } from "i18next";
import { Pressable } from "react-native";

const CardProductItem = ({ item, openLink = true, onClick }: { item: ProductForm, openLink?: Boolean, onClick?: any }) => {
  const iva = false;

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
          {item.amount &&
            <VStack flex={1}>
              <HStack>
                <Badge
                  bg={"blue.500"} rounded="full" mb={-4} mr={-4} zIndex={1} variant="solid" alignSelf="flex-end" _text={{
                    fontSize: 12
                  }}>
                  {item.amount}
                </Badge>
              </HStack>
            </VStack>
          }
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
                color={iva ? "blue.500" : "red.300"}
              />
            </HStack>
          </VStack>
        </HStack>
      </_Stack>
    </Card>
  )

  return (
    <Box alignItems="center" marginBottom={5}>
      {openLink ? <Link
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
      >{renderCard()}</Link> :
        <Pressable onPress={() => onClick(item)}>{renderCard()}</Pressable>}

    </Box>
  );
};

export default CardProductItem;
