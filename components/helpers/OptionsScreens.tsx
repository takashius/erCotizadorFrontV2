import React from "react";
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Row, HamburgerIcon, Icon, Menu, Text, Button, HStack } from "native-base";
import { Pressable } from "react-native";
import { type MenuItem } from "../../types/general";
import { router } from "expo-router";

export const useOptions = ({
  title,
  navigation,
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
    if (display) {
      return (
        <Menu
          marginX={1}
          trigger={(triggerProps) => {
            return (
              <Pressable
                accessibilityLabel="More options menu"
                {...triggerProps}
              >
                <HamburgerIcon size="lg" style={{ color: "white" }} />
              </Pressable>
            );
          }}
        >
          {menuItems && menuItems.map((item) => (
            <Menu.Item onPress={item.onPress} isDisabled={item.isDisabled}>
              <HStack>
                <Icon color={"blue.500"} size="lg" as={<MaterialIcons name={item.icon} />} />
                <Text color={"blue.500"} ml={5}>{item.title}</Text>
              </HStack>
            </Menu.Item>
          ))}
        </Menu>
      );
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
          <Icon
            onPress={() => {
              router.back();
            }}
            as={<MaterialCommunityIcons name="backburger" />}
            size="lg"
            color={"white"}
          />
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
