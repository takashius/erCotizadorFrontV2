import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { MenuItem } from '@/types/general';
import { HStack, HamburgerIcon, Icon, Text } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

type DropdownMenuProps = {
  menuItems: MenuItem[];
};

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ menuItems }) => {
  const [visible, setVisible] = useState(false);

  const toggleMenu = () => {
    setVisible(!visible);
  };

  const handleMenuItemPress = (onPress: () => void) => {
    setVisible(false);
    onPress();
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerIcon}>
        <HamburgerIcon size="lg" style={{ color: "white" }} />
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity style={styles.overlay}>
          <View style={styles.menu}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={(arg: any) => {
                  toggleMenu()
                  item.onPress(arg)
                }}
                style={styles.menuItem}
              >
                <HStack>
                  <Icon color={"blue.500"} size="lg" as={<MaterialIcons name={item.icon} />} />
                  <Text color={"blue.500"} ml={5}>{item.title}</Text>
                </HStack>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  hamburgerIcon: {
    padding: 10,
  },
  iconText: {
    fontSize: 24,
    color: 'white',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menu: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    width: 200,
  },
  menuItem: {
    padding: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: 'black',
  },
});
