import React from "react";
import {
  Box,
  HStack,
  Text,
  Center,
  Stack as _Stack,
  Heading,
  Icon,
} from "native-base";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { type Cotiza } from "../types/cotiza";
import { FormatDate } from "./helpers/Utils";
import Card from "./helpers/Card";

const CardCotizaItem = ({ item }: { item: Cotiza }) => {
  return (
    <Box alignItems="center" marginBottom={5}>
      <Link
        href={{
          pathname: "/(tabs)/home/detail",
          params: {
            id: item._id!,
          },
        }}
      >
        <Card>
          <_Stack p="4" space={2}>
            <_Stack space={2}>
              <Heading size="md" ml="-1" color={"blue.500"}>
                {item.title}
              </Heading>
              <Text fontSize="xs" color={"blue.300"} fontWeight="500">
                {item.description}
              </Text>
            </_Stack>
            <Text fontWeight="400">
              {item.customer.name} {item.customer.lastname}
            </Text>
            <HStack alignItems="center" space={4} justifyContent="space-between">
              <HStack alignItems="center">
                <Text color="coolGray.600" fontWeight="400">
                  {FormatDate(item.created.date)}
                </Text>
              </HStack>
            </HStack>
            <Center
              bg="blue.500"
              _text={{
                color: "warmGray.50",
                fontWeight: "700",
                fontSize: "xs",
              }}
              position="absolute"
              flexDir={"row"}
              right={"0"}
              bottom="0"
              px="3"
              py="1.5"
            >
              <Icon as={<FontAwesome name="dollar" />} size={4} color={"white"} />
              {item.amount.toLocaleString("es-VE")}
            </Center>
            <Center
              _text={{
                color: "blue.500",
                fontWeight: "700",
                fontSize: "xs",
              }}
              position="absolute"
              bottom="0"
              px="3"
              py="1.5"
            >
              {item.status.toUpperCase()}
            </Center>
          </_Stack>
        </Card>
      </Link>
    </Box>
  );
};

export default CardCotizaItem;
