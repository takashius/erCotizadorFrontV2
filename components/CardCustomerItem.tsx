import React from "react";
import {
  Box,
  HStack,
  Text,
  Icon,
  Stack as _Stack,
  Heading,
  VStack,
} from "native-base";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { type Customer } from "../types/customer";
import Card from "./helpers/Card";

const CardCustomerItem = ({ item }: { item: Customer }) => {
  return (
    <Box alignItems="center" marginBottom={5}>
      <Link
        href={{
          pathname: "/(tabs)/customer/detail",
          params: {
            id: item._id!,
          },
        }}
      >
        <Card>
          <_Stack p="4" space={0}>
            <_Stack space={2}>
              <Heading size="md" ml="-1" color={"blue.500"}>
                {item.title}
              </Heading>
            </_Stack>
            <HStack space={3} justifyContent="left">
              <VStack flex={1}>
                <Text>
                  {item.name} {item.lastname}
                </Text>
                <HStack>
                  {item.phone && (
                    <Icon
                      marginTop={1}
                      as={<MaterialIcons name="phone" />}
                      size={4}
                      color={"blue.500"}
                    />
                  )}
                  <Text> {item.phone}</Text>
                </HStack>
              </VStack>
              <VStack flex={1} alignItems={"flex-end"}>
                <Text>Rif: {item.rif}</Text>
                <HStack>
                  <Icon
                    marginTop={1}
                    as={<MaterialIcons name="location-city" />}
                    size={4}
                    color={"blue.500"}
                  />
                  <Text> {item.addresses.length}</Text>
                </HStack>
              </VStack>
            </HStack>
          </_Stack>
        </Card>
      </Link>
    </Box>
  );
};

export default CardCustomerItem;
