import { View, Animated } from "react-native";
import { Stack, router, useNavigation } from "expo-router";
import { Box, Fab, Icon } from "native-base";
import { useIsFocused } from "@react-navigation/native";
import { SwipeListView } from "react-native-swipe-list-view";
import {
  SearchBar,
  CardCustomerItem,
  Spinner,
  useOptions,
  DeleteButton,
  read, remove
} from "../../../components";
import { useListCustomer, useDeleteCustomer } from "../../../api/customer";
import { type Customer } from "../../../types/customer";
import { useCallback, useEffect, useState } from "react";
import { t } from "i18next";
import { AntDesign } from "@expo/vector-icons";

export default () => {
  const [pattern, setPattern] = useState<string>('');
  const responseQuery = useListCustomer(pattern);
  const deleteMutation = useDeleteCustomer();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

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
    if (deleteMutation.isSuccess) {
      responseQuery.refetch();
    }
  }, [deleteMutation.isSuccess])

  const renderItem = useCallback(({ item }: { item: any }) => (
    <CardCustomerItem item={item} />
  ), []);

  return (
    <Box bg="white" safeArea flex="1">
      <Stack.Screen options={useOptions({ title: t("modules.customer"), navigation })} />
      <SearchBar filterData={setPattern} />
      {responseQuery.isLoading ? (
        <Spinner />
      ) : (
        <>
          <SwipeListView
            accessibilityLabel="Customer list swipe"
            data={responseQuery.data?.pages.map(page => page.results).flat()}
            useFlatList={true}
            keyExtractor={(item) => item._id!}
            disableRightSwipe={true}
            closeOnRowBeginSwipe={true}
            onRefresh={() => responseQuery.refetch()}
            refreshing={responseQuery.isFetching || deleteMutation.isPending}
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
          <Fab
            renderInPortal={false}
            shadow={2}
            backgroundColor={"blue.500"}
            onPress={() => {
              router.push({
                pathname: "/(tabs)/customer/form",
                params: { post: "new" },
              });
            }}
            size="sm"
            icon={<Icon color="white" as={AntDesign} name="plus" size="sm" />}
          />
        </>
      )}
    </Box>
  );
};
