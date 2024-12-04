import React, { useEffect, useState } from "react";
import { Stack, router, useLocalSearchParams, useNavigation } from "expo-router";
import { View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import {
  Box,
  Heading,
  Stack as _Stack,
  Text,
  HStack,
  Icon,
  Fab,
  VStack,
} from "native-base";
import {
  useOptions,
  CardAddressItem,
  Spinner,
  ModalAddress,
  DeleteButton,
  read, remove
} from "../../../components";
import { t } from "i18next";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useGetCustomer, useDeleteAddress } from "../../../api/customer";
import { SwipeListView } from "react-native-swipe-list-view";
import { Address } from "../../../types/customer";

export default () => {
  const params = useLocalSearchParams();
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState<string>("");
  const [submit, setSubmit] = useState(false);
  const [toEdit, setToEdit] = useState<Address>();
  const isFocused = useIsFocused();

  const { id } = params;
  const navigation = useNavigation();
  const responseQuery = useGetCustomer(id);
  const deleteAddressMutation = useDeleteAddress();

  useEffect(() => {
    if (submit) {
      setSubmit(false);
      responseQuery.refetch();
    }
  }, [submit]);

  const isReturnFromForm = async () => {
    const created = await read("mutateCustomer");
    if (created && created === 'true') {
      responseQuery.refetch();
      await remove("mutateCustomer");
    }
  };

  useEffect(() => {
    if (isFocused) {
      isReturnFromForm();
    }
  }, [isFocused]);

  useEffect(() => {
    if (deleteAddressMutation.isSuccess) {
      responseQuery.refetch();
    }
  }, [deleteAddressMutation.isSuccess]);

  const onEditAddress = (item: Address) => {
    setOpen(true);
    setPost("edit");
    item.id = responseQuery.data?._id!;
    setToEdit(item);
  };

  const onEditClick = () => {
    const item = responseQuery.data;
    if (item) {
      router.push({
        pathname: '/(tabs)/customer/form',
        params: {
          post: "edit",
          id: item._id!,
          title: item.title,
          name: item.name,
          lastname: item.lastname,
          rif: item.rif,
          email: item.email,
          phone: item.phone
        }
      });
    }
  }

  return (
    <Box bg="white" safeArea flex="1">
      <Stack.Screen
        options={useOptions({
          title: t("customer.detail"),
          navigation,
          back: true,
          edit: true,
          editAction: onEditClick
        })}
      />
      {responseQuery.isLoading ? (
        <Spinner />
      ) : (
        <_Stack px="4" space={0}>
          <_Stack space={2} pb="2">
            <Heading size="md" ml="-1" color={"blue.500"}>
              {responseQuery.data?.title}
            </Heading>
            <Text fontSize="lg" fontWeight="500">
              {responseQuery.data?.name} {responseQuery.data?.lastname}
            </Text>
          </_Stack>
          <HStack space={3} justifyContent="left">
            <VStack flex={1}>
              <HStack>
                <Icon
                  marginTop={1}
                  marginRight={2}
                  as={<MaterialIcons name="mail" />}
                  size={4}
                  color={"blue.500"}
                />
                <Text>{responseQuery.data?.email}</Text>
              </HStack>
              <HStack>
                {responseQuery.data?.phone && (
                  <Icon
                    marginTop={1}
                    as={<MaterialIcons name="phone" />}
                    size={4}
                    color={"blue.500"}
                  />
                )}
                <Text> {responseQuery.data?.phone}</Text>
              </HStack>
            </VStack>
            <VStack flex={1} alignItems={"flex-end"}>
              <Text>Rif: {responseQuery.data?.rif}</Text>
              <HStack>
                <Icon
                  marginTop={1}
                  as={<MaterialIcons name="location-city" />}
                  size={4}
                  color={"blue.500"}
                />
                <Text> {responseQuery.data?.addresses.length}</Text>
              </HStack>
            </VStack>
          </HStack>

          <_Stack space={2} pt="5" pb="3">
            <Heading size="md" ml="-1" color={"blue.500"}>
              {t("address.title")}
            </Heading>
          </_Stack>
          {responseQuery.isFetching ? (
            <Spinner />
          ) : (
            <SwipeListView
              data={responseQuery.data?.addresses!}
              useFlatList={true}
              disableRightSwipe={true}
              closeOnRowBeginSwipe={true}
              renderItem={({ item }) => (
                <CardAddressItem item={item} onClick={onEditAddress} />
              )}
              keyExtractor={(item: any) => item._id}
              contentContainerStyle={{ paddingBottom: 200 }}
              renderHiddenItem={(data, rowMap) => (
                <View
                  style={{
                    marginLeft: 270,
                    height: "90%",
                    width: 60,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DeleteButton
                    data={data}
                    rowMap={rowMap}
                    deleteMutation={deleteAddressMutation}
                    idParent={responseQuery.data!._id}
                  />
                </View>
              )}
              rightOpenValue={-75}
            />
          )}
        </_Stack>
      )}
      <ModalAddress
        idCustomer={responseQuery.data?._id!}
        open={open}
        setOpen={setOpen}
        setSubmit={setSubmit}
        post={post}
        params={toEdit}
      />
      <Fab
        renderInPortal={false}
        shadow={2}
        backgroundColor={"blue.500"}
        onPress={() => {
          setOpen(true);
          setPost("new");
        }}
        size="sm"
        icon={<Icon color="white" as={AntDesign} name="plus" size="sm" />}
      />
    </Box>
  );
};
