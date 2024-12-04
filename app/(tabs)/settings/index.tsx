import { Box, Divider, HStack, Icon, VStack } from "native-base"
import { Spinner, useOptions } from "../../../components"
import { t } from "i18next"
import { Stack, router, useNavigation } from "expo-router"
import { ScrollView, Text } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useAccount } from "../../../api/auth"

export default () => {
  const navigation = useNavigation();
  const responseQuery = useAccount();

  const renderItem = (title: string, link: any) => (
    <TouchableOpacity onPress={() => {
      if (link !== null) {
        router.push(link);
      }
    }}>
      <HStack justifyContent="space-between" py={1}>
        <Text>{title}</Text>
        <Icon
          as={<MaterialIcons name="arrow-forward-ios" />}
          size={6}
        />
      </HStack>
    </TouchableOpacity>
  )

  return (
    <Box safeArea flex={1} p={2} w="100%" padding='5' mx="auto">
      <Stack.Screen options={useOptions({ title: t("modules.settings"), navigation })} />
      {responseQuery.isLoading ? (
        <Spinner />
      ) :
        <ScrollView>
          <VStack space={3} divider={<Divider />}>
            {renderItem("General", "/(tabs)/settings/basicData")}
            {renderItem(t('settings.pdf'), "/(tabs)/settings/pdfData")}
            {renderItem(t('settings.email'), "/(tabs)/settings/emailData")}
            {renderItem(t('settings.language'), "/(tabs)/settings/languageData")}
            {responseQuery.data?.companys.length! > 1 &&
              renderItem(t('settings.company'), "/(tabs)/settings/companyData")
            }
            {renderItem(t('auth.logout'), "/logout")}
          </VStack>
        </ScrollView>
      }

    </Box>
  )
}