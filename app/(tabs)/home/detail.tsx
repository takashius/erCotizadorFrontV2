import React, { useEffect, useState } from "react";
import { Stack, router, useLocalSearchParams, useNavigation } from "expo-router";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { SwipeListView } from "react-native-swipe-list-view";
import * as FileSystem from 'expo-file-system';
import { Alert, Animated, ScrollView, View } from "react-native";
import * as Sharing from "expo-sharing";
import { Buffer } from "buffer";
import {
  Box,
  Heading,
  Stack as _Stack,
  Text,
  HStack,
  Icon,
  Fab,
  VStack,
  SimpleGrid,
} from "native-base";
import {
  useOptions,
  Spinner,
  DeleteButton,
  read, remove, write, Card, CardProductItem, ModalProducts
} from "../../../components";
import { useGetCotiza, useDeleteProduct, useGetPdf, useSendCotiza, useUpdateCotizaRate } from "../../../api/cotiza";
import { t } from "i18next";
import { ProductForm } from "../../../types/products";
import { MenuItem } from "../../../types/general";
import { useIsFocused } from "@react-navigation/native";

export default () => {
  const params = useLocalSearchParams();
  const [submit, setSubmit] = useState(false);
  const [total, setTotal] = useState<Number>(0);
  const [toEdit, setToEdit] = useState<ProductForm>();
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState<string>("");
  const [dataList, setDataList] = useState<ProductForm[] | undefined>();
  const isFocused = useIsFocused();

  const { id } = params;
  const navigation = useNavigation();
  const responseQuery = useGetCotiza(id!);
  const deleteProductMutation = useDeleteProduct();
  const getPdf = useGetPdf();
  const sendCotiza = useSendCotiza();
  const updateRate = useUpdateCotizaRate();

  const saveReportFile = async (pdfData: any) => {
    try {
      const buff = Buffer.from(pdfData, 'base64');
      const pdf = buff.toString('base64');
      const fileUri = FileSystem.documentDirectory + `${encodeURI('invoice_' + responseQuery.data?.sequence)}.pdf`;
      await FileSystem.writeAsStringAsync(fileUri, pdf, { encoding: FileSystem.EncodingType.Base64 });
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      Alert.alert('Error', `Could not Download file ${error}`);
    }
  }

  useEffect(() => {
    if (isFocused) {
      isReturnFromForm();
    }
  }, [isFocused]);

  useEffect(() => {
    if (deleteProductMutation.isSuccess) {
      setTotal(deleteProductMutation.data.total);
    }
  }, [deleteProductMutation.isSuccess])

  const isReturnFromForm = async () => {
    const created = await read("mutateCotiza");
    if (created && created === 'true') {
      responseQuery.refetch();
      await remove("mutateCotiza");
      await write("editCotizaInDetail", 'true');
    }
  };

  useEffect(() => {
    if (responseQuery.data) {
      setDataList(responseQuery.data.products);
      setTotal(responseQuery.data.amount);
    }
  }, [responseQuery.data]);

  useEffect(() => {
    if (submit) {
      setSubmit(false);
      responseQuery.refetch();
      write("editCotizaInDetail", 'true').then((res) => res);
    }
  }, [submit]);

  useEffect(() => {
    if (getPdf.isSuccess) {
      saveReportFile(getPdf.data)
    }
  }, [getPdf.isSuccess]);

  useEffect(() => {
    if (sendCotiza.isSuccess) {
      Alert.alert("Exito", t('sendCotizaSuccess'));
    }
  }, [sendCotiza.isSuccess]);

  useEffect(() => {
    if (updateRate.isError) {
      Alert.alert("Error", t('updateRateError'));
    }
  }, [updateRate.isError]);

  const deleteRow = (rowMap: any, rowKey: any) => {
    if (dataList !== undefined) {
      rowMap[rowKey].closeRow();
      const config = {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      };
      Animated.timing(new Animated.Value(50), config).start(() => {
        const newData = [...dataList];
        const prevIndex = dataList.findIndex(
          (item: any) => item._id === rowKey
        );
        newData.splice(prevIndex, 1);
        setDataList(newData);
        write("editCotizaInDetail", 'true').then((res) => res);
      });
    }
  };

  const onEditClick = (item: ProductForm) => {
    setOpen(true);
    setPost("edit");
    item.id = responseQuery.data?._id!;
    setToEdit(item);
  }

  const onEditCotiza = () => {
    const item = responseQuery.data!;
    router.push({
      pathname: '/(tabs)/home/form',
      params: {
        post: "edit",
        id: item._id!,
        title: item.title,
        number: item.number,
        description: item.description,
        date: item.date,
        customer: item.customer?._id!
      }
    });
  }
  const menuItems: MenuItem[] = [{
    icon: 'edit',
    title: t('edit'),
    onPress: () => onEditCotiza(),
    isDisabled: false
  }, {
    icon: 'autorenew',
    title: t('updateRate'),
    onPress: () => { updateRate.mutate({ id: responseQuery.data?._id! }) },
    isDisabled: false
  }, {
    icon: 'picture-as-pdf',
    title: t('pdf'),
    onPress: () => { getPdf.mutate({ id: responseQuery.data?._id!, libre: false }) },
    isDisabled: false
  }, {
    icon: 'picture-as-pdf',
    title: t('pdfLibre'),
    onPress: () => { getPdf.mutate({ id: responseQuery.data?._id!, libre: true }) },
    isDisabled: false
  },
  {
    icon: 'outgoing-mail',
    title: t('sendMail'),
    onPress: () => { sendCotiza.mutate(responseQuery.data?._id!) },
    isDisabled: false
  }]

  return (
    <Box bg="white" safeArea flex="1">
      <Stack.Screen
        options={useOptions({
          title: t("cotiza.detail"),
          navigation,
          back: true,
          dropdown: true,
          menuItems: menuItems,
        })}
      />
      {responseQuery.isFetching || getPdf.isPending || sendCotiza.isPending || updateRate.isPending ? (
        <Spinner />
      ) : (
        <>
          <_Stack p="4" pt="0" space={0}>
            <_Stack space={2} pb="2">
              <Heading size="md" color={"blue.500"}>
                {responseQuery.data?.title}
              </Heading>
            </_Stack>

            <HStack justifyContent="space-between">
              <HStack>
                <Icon
                  marginTop={1}
                  marginRight={2}
                  as={<MaterialIcons name="receipt" />}
                  size={4}
                  color="blue.500"
                />
                <Text color="blue.500">{t('invoice')}: </Text>
                <Text>{responseQuery.data?.number}</Text>
              </HStack>
              <HStack>
                <Text mr={1}>{responseQuery.data?.date}</Text>
                <Icon
                  marginTop={1}
                  marginRight={2}
                  as={<MaterialIcons name="calendar-today" />}
                  size={4}
                  color="blue.500"
                />
              </HStack>
            </HStack>
            <HStack justifyContent="space-between">
              <HStack>
                <Icon
                  marginTop={1}
                  marginRight={2}
                  as={<MaterialIcons name="attach-money" />}
                  size={4}
                  color={"blue.500"}
                />
                <Text color="blue.500" mr={2}>
                  {t('subtotal')}:
                </Text>
                <Text>{responseQuery.data?.amount.toLocaleString("es-VE")}</Text>
              </HStack>
              <HStack>
                <Text color="blue.500" mr={2}>
                  {t('tax')}:
                </Text>
                <Text>{responseQuery.data?.totalIva}</Text>
                <Icon
                  marginTop={1}
                  marginRight={2}
                  as={<MaterialIcons name="attach-money" />}
                  size={4}
                  color={"blue.500"}
                />
              </HStack>
            </HStack>
            <HStack justifyContent="space-between">
              <HStack>
                <Icon
                  marginTop={1}
                  marginRight={2}
                  as={<MaterialIcons name="attach-money" />}
                  size={4}
                  color={"blue.500"}
                />
                <Text fontWeight="semibold" color="blue.500" mr={2}>
                  {t('total')}:
                </Text>
                <Text>{responseQuery.data?.total?.toLocaleString("es-VE")}</Text>
              </HStack>
              <HStack>
                <Text color="blue.500" mr={2}>
                  {t('exchangeRate')}:
                </Text>
                <Text>{responseQuery.data?.rate.toLocaleString("es-VE")}</Text>
                <Icon
                  marginTop={1}
                  marginRight={2}
                  as={<MaterialIcons name="attach-money" />}
                  size={4}
                  color={"blue.500"}
                />
              </HStack>
            </HStack>
          </_Stack>

          <ScrollView>
            <VStack space={4} p="4" pt="0">
              <_Stack space={2} pb="2">
                <Heading size="md" mt="5" color={"blue.500"}>
                  {t("customer.detail")}
                </Heading>
              </_Stack>
              <HStack justifyContent="center">
                <Card>
                  <_Stack p="4" space={0}>
                    <_Stack space={2} pb="2">
                      <Heading size="md" ml="-1" color={"blue.500"}>
                        {responseQuery.data?.customer?.title}
                      </Heading>
                      <Text fontSize="lg" fontWeight="500">
                        {responseQuery.data?.customer?.name}{" "}
                        {responseQuery.data?.customer?.lastname}
                      </Text>
                    </_Stack>
                    <VStack>
                      <HStack>
                        <Icon
                          marginTop={1}
                          marginRight={2}
                          as={<MaterialIcons name="mail" />}
                          size={4}
                          color={"blue.500"}
                        />
                        <Text>{responseQuery.data?.customer?.email}</Text>
                      </HStack>
                      {responseQuery.data?.customer?.phone && (
                        <HStack>
                          <Icon
                            marginTop={1}
                            as={<MaterialIcons name="phone" />}
                            size={4}
                            color={"blue.500"}
                          />
                          <Text> {responseQuery.data?.customer?.phone}</Text>
                        </HStack>
                      )}
                      <Text>Rif: {responseQuery.data?.customer?.rif}</Text>
                    </VStack>
                  </_Stack>
                </Card>
              </HStack>

              <_Stack space={2} pt="5" pb="3">
                <Heading size="md" ml="-1" color={"blue.500"}>
                  {t("products.title")}
                </Heading>
              </_Stack>

              {responseQuery.isLoading || deleteProductMutation.isPending ? (
                <Spinner />
              ) : (
                <SwipeListView
                  data={dataList}
                  useFlatList={true}
                  disableRightSwipe={true}
                  closeOnRowBeginSwipe={true}
                  renderItem={({ item }) => (
                    <CardProductItem openLink={false} item={item} onClick={onEditClick} />
                  )}
                  keyExtractor={(item: any) => item._id}
                  contentContainerStyle={{ paddingBottom: 300 }}
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
                        deleteMutation={deleteProductMutation}
                        idParent={responseQuery.data!._id}
                        deleteRow={deleteRow}
                      />
                    </View>
                  )}
                  rightOpenValue={-75}
                />
              )}
            </VStack>
          </ScrollView>
        </>
      )}
      <ModalProducts
        idCotiza={responseQuery.data?._id!}
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

  )
}