import React from "react";
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Row, HamburgerIcon, Icon, Menu, Text, Button, HStack, Box, Pressable } from "native-base";
import { type MenuItem } from "../../types/general";
import { router } from "expo-router";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { TouchableOpacity } from "react-native";

export const useOptions = ({
  title,
  back = false,
  edit = false,
  save = false,
  dropdown = false,
  menuItems,
  editAction,
  saveAction
}: {
  title: string,
  navigation: any,
  back?: boolean,
  edit?: boolean,
  save?: boolean,
  dropdown?: boolean,
  menuItems?: Array<MenuItem>,
  editAction?: any
  saveAction?: any
}
) => {
  const DisplayMenu = (display = true) => {
    if (display && menuItems) {

      return (<DropdownMenu menuItems={menuItems} />)
      // return (
      //   <Menu
      //     marginX={1}
      //     trigger={(triggerProps) => {
      //       return (
      //         <TouchableOpacity
      //           accessibilityLabel="More options menu"
      //           {...triggerProps}
      //         >
      //           <HamburgerIcon size="lg" style={{ color: "white" }} />
      //         </TouchableOpacity>
      //       );
      //     }}
      //   >
      //     {menuItems && menuItems.map((item) => (
      //       <Menu.Item onPress={item.onPress} isDisabled={item.isDisabled}>
      //         <HStack>
      //           <Icon color={"blue.500"} size="lg" as={<MaterialIcons name={item.icon} />} />
      //           <Text color={"blue.500"} ml={5}>{item.title}</Text>
      //         </HStack>
      //       </Menu.Item>
      //     ))}
      //   </Menu>
      // );
    } else {
      return false;
    }
  };

  const displayRight = () => (
    <Row>
      {edit && <Icon
        marginRight={15}
        onPress={() => editAction()}
        as={<AntDesign name="edit" />}
        size={6}
        color={"white"}
      />}
      {save && <Icon
        marginRight={15}
        onPress={() => saveAction()}
        as={<AntDesign name="save" />}
        size={6}
        color={"white"}
      />}
      {DisplayMenu(dropdown)}
    </Row>
  )

  const renderTitle = () => (
    <Text ml="1.5" color={'white'} fontWeight={"semibold"} fontSize={"md"}>{title}</Text>
  )

  if (back) {
    return {
      headerShown: true,
      headerBackVisible: false,
      headerBackTitleVisible: false,
      headerStyle: {
        backgroundColor: "#2196F3",
      },
      headerRight: () => displayRight(),
      headerTitle: () => renderTitle(),
      headerLeft: () => {
        return (
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <Icon
              as={<MaterialCommunityIcons name="backburger" />}
              size="lg"
              color={"white"}
            />
          </TouchableOpacity>
        );
      },
    };
  } else {
    return {
      headerShown: true,
      headerBackVisible: true,
      headerStyle: {
        backgroundColor: "#2196F3",
      },
      headerRight: () => displayRight(),
      headerTitle: () => renderTitle(),
    };
  }
};
