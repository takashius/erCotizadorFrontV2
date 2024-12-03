import { VStack, Input, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { t } from "i18next";

const SearchBar = ({ filterData }: { filterData: any }) => {
  return (
    <VStack w="90%" alignSelf="center" marginBottom={4}>
      <Input
        placeholder={t("search")}
        width="100%"
        borderRadius="4"
        py="3"
        px="1"
        fontSize="14"
        onChangeText={(value) => filterData(value)}
        InputLeftElement={
          <Icon
            m="2"
            ml="3"
            size="6"
            color="gray.400"
            as={<MaterialIcons name="search" />}
          />
        }
      />
    </VStack>
  );
};

export default SearchBar;
