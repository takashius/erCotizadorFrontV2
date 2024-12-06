import { t } from "i18next";
import {
  FormControl,
  Input,
  Text,
  WarningOutlineIcon,
  Box,
  Button,
  VStack,
  Badge,
  Icon,
  TextArea
} from "native-base";
import { Dimensions, StyleSheet, Image } from 'react-native';
import { Platform, TouchableWithoutFeedback } from "react-native";
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import SelectDropdown from 'react-native-select-dropdown'
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from "react-native-gesture-handler";
import Spinner from "./helpers/Spinner";
import { useEffect, useState } from "react";
const { width } = Dimensions.get('window');
const ratio = (width * 0.8) / 270;

export const InputForm = ({ data }: { data: any }) => {
  return (
    <FormControl
      w={data.col === true ? "1/2" : "full"}
      px={data.col === true ? "2" : 0}
      {...(data.require && { isRequired: true })}
      isInvalid={`${data.name}` in data.errors}
    >
      <FormControl.Label
        _text={{
          bold: true,
        }}
      >
        {data.title}
      </FormControl.Label>
      <Input
        placeholder={data.placeholder}
        defaultValue={data.value}
        isReadOnly={data.readonly}
        onTouchStart={data.onItemClick}
        {...(data.readonly && { value: data.value })}
        {...(data.keyboardType && { keyboardType: data.keyboardType })}
        {...(data.type && { type: data.type })}
        {...(data.InputRightElement && { InputRightElement: data.InputRightElement })}
        onChangeText={(value) =>
          data.setData({ ...data.formData, [data.name]: value })
        }
      />
      {`${data.name}` in data.errors ? (
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          {data.errors[data.name]}
        </FormControl.ErrorMessage>
      ) : (
        <FormControl.HelperText>{data.description}</FormControl.HelperText>
      )}
    </FormControl>
  );
};

export const TextAreaForm = ({ data }: { data: any }) => {
  return (
    <FormControl
      w={data.col === true ? "1/2" : "full"}
      px={data.col === true ? "2" : 0}
      {...(data.require && { isRequired: true })}
      isInvalid={`${data.name}` in data.errors}
    >
      <FormControl.Label
        _text={{
          bold: true,
        }}
      >
        {data.title}
      </FormControl.Label>
      <TextArea
        h={20}
        w="100%"
        placeholder={data.placeholder}
        defaultValue={data.value}
        isReadOnly={data.readonly}
        {...(data.readonly && { value: data.value })}
        {...(data.keyboardType && { keyboardType: data.keyboardType })}
        onChangeText={(value) => {
          data.setData && data.setData({ ...data.formData, [data.name]: value });
          data.setValue && data.setValue(value);
        }
        }
      />
      {`${data.name}` in data.errors ? (
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          {data.errors[data.name]}
        </FormControl.ErrorMessage>
      ) : (
        <FormControl.HelperText>{data.description}</FormControl.HelperText>
      )}
    </FormControl>
  );
};

export const InputDate = ({ data }: { data: any }) => {

  return (
    <TouchableWithoutFeedback onPress={data.onItemClick}>
      <FormControl
        w={data.col === true ? "1/2" : "full"}
        px={data.col === true ? "2" : 0}
        {...(data.require && { isRequired: true })}
        isInvalid={`${data.name}` in data.errors}
      >
        <FormControl.Label
          _text={{
            bold: true,
          }}
        >
          {data.title}
        </FormControl.Label>

        <Box
          borderColor={'#d4d4d4'}
          borderWidth={1}
          borderRadius={'5'}
          height={Platform.OS == 'ios' ? "1/3" : "12"}
          padding={"2"}
        >
          <Text>{data.value ? data.value : t("cotiza.placeholder.date")}</Text>
        </Box>
        {`${data.name}` in data.errors ? (
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {data.errors[data.name]}
          </FormControl.ErrorMessage>
        ) : (
          <FormControl.HelperText>{data.description}</FormControl.HelperText>
        )}
      </FormControl>
    </TouchableWithoutFeedback>
  )
}

export const SelectImage = ({ data }: { data: any }) => {
  const [image, setImage] = useState<any>();
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  useEffect(() => {
    setIsLoading(data.isLoading);
  }, [data.isLoading])
  const pickImage = async () => {

    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled) {
      setIsLoading(true);
      data.setImage(result.assets[0]);
      setImage(result.assets[0].uri);
    }
  };
  return (
    <FormControl
      w={data.col === true ? "1/2" : "full"}
      px={data.col === true ? "2" : 0}
      {...(data.require && { isRequired: true })}
    >
      <FormControl.Label
        _text={{
          bold: true,
        }}
      >
        {data.title}
      </FormControl.Label>
      {(data.value && data.value !== 'undefined' && data.value !== undefined) ?
        <Box alignItems="center">
          <TouchableOpacity onPress={pickImage}>
            <VStack>
              {data.isLoading || isLoading ?
                <Spinner /> :
                <Box>
                  <Badge
                    rounded="full" mb={-6} zIndex={1} alignSelf="flex-end">
                    <Icon
                      onPress={() => { }}
                      as={<AntDesign name="edit" />}
                      size={6}
                      color={"blue.500"}
                      shadow={"1"}
                    />
                  </Badge>
                  {image ?
                    <Image source={{ uri: image }} style={styles.logo} /> :
                    <Image source={{ uri: data.value }} style={styles.logo} />}

                </Box>
              }
            </VStack>
          </TouchableOpacity>
        </Box>
        :
        <Button
          variant="outline"
          color={'blue.500'}
          onPress={pickImage}
          isLoading={data.isLoading}
          isLoadingText={t('uploading')}
        >{t('selectImage')}</Button>
      }
    </FormControl>
  )
}

export const SelectForm = (dataObj: any) => {
  const { data } = dataObj;
  const dataSelect = data.selectData?.map((item: any) => item.title);
  return (
    <FormControl
      w={data.col === true ? "1/2" : "full"}
      px={data.col === true ? "2" : 0}
      {...(data.require && { isRequired: true })}
    >
      <FormControl.Label
        _text={{
          bold: true,
        }}
      >
        {data.title}
      </FormControl.Label>
      <SelectDropdown
        data={dataSelect}
        onSelect={(selectedItem, index) => {
          data.setData({ ...data.formData, [data.name]: data.selectData[index]?.id })
        }}
        defaultValue={data.value}
        defaultButtonText={data.placeholder}
        buttonTextAfterSelection={(selectedItem: any, index: any) => {
          return selectedItem;
        }}
        rowTextForSelection={(item: any, index: any) => {
          return item;
        }}
        {...(data.search && {
          search: true,
          searchInputStyle: styles.dropdown1searchInputStyleStyle,
          searchPlaceHolder: t('filter'),
          searchPlaceHolderColor: 'darkgrey',
          renderSearchInputLeftIcon: () => {
            return <FontAwesome name={'search'} color={'darkgrey'} size={18} />;
          }
        })}
        buttonStyle={styles.dropdown1BtnStyle}
        buttonTextStyle={styles.dropdown1BtnTxtStyle}
        renderDropdownIcon={(isOpened: any) => {
          return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'darkgrey'} size={12} />;
        }}
        dropdownIconPosition={'right'}
        dropdownStyle={styles.dropdown1DropdownStyle}
        rowStyle={styles.dropdown1RowStyle}
        rowTextStyle={styles.dropdown1RowTxtStyle}
      />
      {`${data.name}` in data.errors ? (
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          {data.errors[data.name]}
        </FormControl.ErrorMessage>
      ) : (
        <FormControl.HelperText>{data.description}</FormControl.HelperText>
      )}
    </FormControl>
  )
};

export const SelectDropdownForm = (dataObj: any) => {
  const { data } = dataObj;
  const dataSelect = data.selectData?.map((item: any) => item.name)
  return (
    <FormControl
      w={data.col === true ? "1/2" : "full"}
      px={data.col === true ? "2" : 0}
      {...(data.require && { isRequired: true })}
    >
      <FormControl.Label
        _text={{
          bold: true,
        }}
      >
        {data.title}
      </FormControl.Label>
      <SelectDropdown
        data={dataSelect}
        onSelect={(selectedItem, index) => {
          data.setData({
            ...data.formData,
            master: data.selectData[index]?.id,
            name: data.selectData[index]?.name,
            description: data.selectData[index]?.description,
            price: data.selectData[index]?.price,
            iva: data.selectData[index]?.iva,
          })
        }}
        defaultButtonText={data.placeholder}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
        search
        searchInputStyle={styles.dropdown1searchInputStyleStyle}
        searchPlaceHolder={t('filter')}
        searchPlaceHolderColor={'darkgrey'}
        renderSearchInputLeftIcon={() => {
          return <FontAwesome name={'search'} color={'darkgrey'} size={18} />;
        }}
        buttonStyle={styles.dropdown1BtnStyle}
        buttonTextStyle={styles.dropdown1BtnTxtStyle}
        renderDropdownIcon={isOpened => {
          return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'darkgrey'} size={12} />;
        }}
        dropdownIconPosition={'right'}
        dropdownStyle={styles.dropdown1DropdownStyle}
        rowStyle={styles.dropdown1RowStyle}
        rowTextStyle={styles.dropdown1RowTxtStyle}
      />
      {`${data.name}` in data.errors ? (
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          {data.errors[data.name]}
        </FormControl.ErrorMessage>
      ) : (
        <FormControl.HelperText>{data.description}</FormControl.HelperText>
      )}
    </FormControl>
  )
};

const styles = StyleSheet.create({

  dropdown1BtnStyle: {
    width: '100%',
    backgroundColor: 'transparent',
    height: 35,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d4d4d4',
  },
  dropdown1BtnTxtStyle: { color: '#444', textAlign: 'left', fontSize: 12 },
  dropdown1DropdownStyle: { backgroundColor: '#EFEFEF' },
  dropdown1RowStyle: { backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' },
  dropdown1RowTxtStyle: { color: '#444', textAlign: 'left', fontSize: 12 },
  dropdown1searchInputStyleStyle: {
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d4d4d4',
  },
  logo: {
    width: width * 0.6,
    height: 100 * ratio,
    resizeMode: "contain",
  },
})
