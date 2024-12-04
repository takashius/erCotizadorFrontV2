import { Stack, router, useNavigation } from "expo-router";
import { Box, Fab, Icon, Stack as _Stack } from "native-base";
import { View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { SwipeListView } from "react-native-swipe-list-view";
import {
  SearchBar,
  Spinner,
  useOptions,
  DeleteButton,
  read, remove
} from "../../../components";
import { useDeleteProduct, useListProducts } from "../../../api/product";
import { AntDesign } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { t } from "i18next";
import CardProductItemList from "../../../components/CardProductItemList";

export default () => {
  const [pattern, setPattern] = useState<string>('');
  const deleteMutation = useDeleteProduct();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const responseQuery = useListProducts(pattern);

  const isReturnFromForm = async () => {
    const created = await read("mutateProduct");
    if (created && created === 'true') {
      responseQuery.refetch();
      await remove("mutateProduct");
    }
  };

  useEffect(() => {
    if (isFocused) {
      isReturnFromForm();
    }
  }, [isFocused]);

  useEffect(() => {
    if (deleteMutation.isSuccess) {
      responseQuery.refetch();
    }
  }, [deleteMutation.isSuccess])

  const renderItem = useCallback(({ item }: { item: any }) => (
    <CardProductItemList item={item} />
  ), []);

  return (
    <Box bg="white" safeArea flex="1">
      <Stack.Screen options={useOptions({ title: t("modules.product"), navigation })} />
      <SearchBar filterData={setPattern} />
      {responseQuery.isLoading ? (
        <Spinner />
      ) : (
        <SwipeListView
          data={responseQuery.data?.pages.map(page => page.results).flat()}
          useFlatList={true}
          keyExtractor={(item, index) => String(index)}
          disableRightSwipe={true}
          closeOnRowBeginSwipe={true}
          onRefresh={() => responseQuery.refetch()}
          onEndReached={() => {
            if (responseQuery.hasNextPage) {
              responseQuery.fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.3}
          refreshing={responseQuery.isFetching || deleteMutation.isPending}
          ListFooterComponent={responseQuery.isFetchingNextPage ? <Spinner /> : null}
          renderItem={renderItem}
          renderHiddenItem={(data, rowMap) => (
            <View
              style={{
                marginLeft: 280,
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
                deleteMutation={deleteMutation}
              />
            </View>
          )}
          rightOpenValue={-75}
        />
      )}

      <Fab
        renderInPortal={false}
        shadow={2}
        backgroundColor={"blue.500"}
        onPress={() => {
          router.push({
            pathname: "/(tabs)/products/form",
            params: { post: "new" },
          });
        }}
        size="sm"
        icon={<Icon color="white" as={AntDesign} name="plus" size="sm" />}
      />
    </Box>
  );
};
