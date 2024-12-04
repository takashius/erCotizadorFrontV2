import { Animated, View } from "react-native";
import { Stack, router, useNavigation } from "expo-router";
import { Box, Fab, Icon } from "native-base";
import {
  SearchBar,
  CardCotizaItem,
  Spinner,
  useOptions,
  read,
  remove,
  DeleteButton
} from "../../../components";
import { useListCotiza, useDeleteCotiza } from "../../../api/cotiza";
import { useEffect, useState } from "react";
import { type Cotiza } from "../../../types/cotiza";
import { t } from "i18next";
import { AntDesign } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { SwipeListView } from "react-native-swipe-list-view";

export default () => {
  const responseQuery = useListCotiza();
  const deleteMutation = useDeleteCotiza();
  const [dataList, setDataList] = useState<Cotiza[]>();
  const [dataDefault, setDataDefault] = useState<Cotiza[]>();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    setDataList(responseQuery.data);
    setDataDefault(responseQuery.data);
  }, [responseQuery.data]);

  const isReturnFromForm = async () => {
    const updated = await read("mutateCotiza");
    if (updated && updated === 'true') {
      responseQuery.refetch();
      await remove("mutateCotiza");
    }
  };

  useEffect(() => {
    if (isFocused) {
      isReturnFromForm();
    }
  }, [isFocused]);

  const filterData = (search: string) => {
    if (dataDefault) {
      setDataList(
        dataDefault.filter(
          (item: Cotiza) =>
            item.description.toUpperCase().includes(search.toUpperCase()) ||
            item.title.toUpperCase().includes(search.toUpperCase())
        )
      );
    }
  };

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
      });
    }
  };

  return (
    <Box bg="white" safeArea flex="1">
      <Stack.Screen options={useOptions({ title: t("modules.cotiza"), navigation })} />

      <SearchBar filterData={filterData} />
      {responseQuery.isFetching ? (
        <Spinner />
      ) : (
        <SwipeListView
          accessibilityLabel="Quotes list"
          data={dataList}
          useFlatList={true}
          keyExtractor={(item) => item._id}
          disableRightSwipe={true}
          closeOnRowBeginSwipe={true}
          onRefresh={() => responseQuery.refetch()}
          refreshing={responseQuery.isFetching || deleteMutation.isPending}
          renderItem={({ item }) => <CardCotizaItem item={item} />}
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
                deleteRow={deleteRow}
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
            pathname: "/(tabs)/home/form",
            params: { post: "new" },
          });
        }}
        size="sm"
        icon={<Icon color="white" as={AntDesign} name="plus" size="sm" />}
      />
    </Box>

  );
};
