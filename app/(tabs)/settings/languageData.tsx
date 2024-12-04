import { Box, Divider, HStack, Radio, VStack, useToast } from "native-base"
import { read, useOptions, write } from "../../../components"
import { t } from "i18next"
import { Stack, useNavigation } from "expo-router"
import { ScrollView, Text } from "react-native"
import { SetStateAction, useEffect, useState } from "react"

export default () => {
  const navigation = useNavigation();
  const [value, setValue] = useState('');
  const toast = useToast();

  useEffect(() => {
    loadLanguage();
  }, [])

  useEffect(() => {
    if (value) {
      write("locationUser", value).then((res) => res);
    }
  }, [value]);

  const loadLanguage = async () => {
    const locationUser = await read("locationUser");
    setValue(locationUser);
  }

  const onChangeLanguage = (nextValue: SetStateAction<string>) => {
    toast.show({
      title: t('settings.changeLanguage')
    })
    setValue(nextValue);
  }

  return (
    <Box safeArea flex={1} p={2} padding='5' w="100%" mx="auto">
      <Stack.Screen options={useOptions({ title: t("settings.language"), navigation, back: true })} />

      <ScrollView>
        <Radio.Group name="myRadioGroup" accessibilityLabel="Language" value={value} onChange={onChangeLanguage}>
          <VStack space={3} divider={<Divider />} w="100%">
            <HStack justifyContent="space-between" py={1}>
              <Text>Español</Text>
              <Radio value="es" my={1} accessibilityLabel="Spanish"></Radio>
            </HStack>
            <HStack justifyContent="space-between" py={1}>
              <Text>English</Text>
              <Radio value="en" my={1} accessibilityLabel="English"></Radio>
            </HStack>
          </VStack>
        </Radio.Group>

      </ScrollView>
    </Box>
  )
}
