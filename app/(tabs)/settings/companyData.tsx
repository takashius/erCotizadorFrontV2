import { Box, Divider, HStack, Radio, VStack, useToast } from "native-base"
import { Spinner, useOptions } from "../../../components"
import { t } from "i18next"
import { Stack, useNavigation } from "expo-router"
import { ScrollView, Text } from "react-native"
import { SetStateAction, useEffect, useState } from "react"
import { useAccount, useSelectCompany } from "../../../api/auth"

export default () => {
  const navigation = useNavigation();
  const [value, setValue] = useState('');
  const responseQuery = useAccount();
  const selectCompanyMutation = useSelectCompany();
  const toast = useToast();

  const onChangeCompany = (nextValue: SetStateAction<string>) => {
    if (nextValue) {
      selectCompanyMutation.mutate({ user: responseQuery.data?._id!, company: nextValue.toString() });
    }
  }

  useEffect(() => {
    if (selectCompanyMutation.isSuccess) {
      toast.show({
        title: t('settings.changeCompany')
      })
    }
  }, [selectCompanyMutation.isSuccess])

  useEffect(() => {
    if (responseQuery.isSuccess) {
      responseQuery.data!.companys.map((item) => {
        if (item.selected === true) {
          setValue(item.company._id!);
        }
      })
    }
  }, [responseQuery.isSuccess])

  const renderItem = (name: string | undefined, value: string) => {
    return (
      <HStack justifyContent="space-between" py={1}>
        <Text>{name}</Text>
        <Radio value={value} my={1} accessibilityLabel={name}></Radio>
      </HStack>
    )
  }

  return (
    <ScrollView>
      <Box safeArea flex={1} p={2} padding='5' w="100%" mx="auto">
        <Stack.Screen options={useOptions({ title: t("settings.company"), navigation, back: true })} />
        {responseQuery.isLoading || selectCompanyMutation.isPending ? (
          <Spinner />
        ) :
          <Radio.Group name="myRadioGroup" accessibilityLabel="change Company" value={value} onChange={onChangeCompany}>
            <VStack space={3} divider={<Divider />} w="100%">
              {responseQuery.data!.companys.map(item => (renderItem(item.company.name, item.company._id!)))}
            </VStack>
          </Radio.Group>
        }
      </Box>
    </ScrollView>
  )
}
