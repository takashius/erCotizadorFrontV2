import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { t } from "i18next";

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: t("modules.cotiza"),
          tabBarIcon: ({ color }) => <Icon
            as={<MaterialIcons name="receipt" />}
            size={28}
            color={color}
          />,
        }}
      />
      <Tabs.Screen
        name="customer"
        options={{
          title: t("modules.customer"),
          tabBarIcon: ({ color }) => <Icon
            as={<MaterialIcons name="person" />}
            size={28}
            color={color}
          />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: t("modules.product"),
          tabBarIcon: ({ color }) => <Icon
            as={<MaterialIcons name="local-offer" />}
            size={28}
            color={color}
          />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("modules.settings"),
          tabBarIcon: ({ color }) => <Icon
            as={<MaterialIcons name="app-settings-alt" />}
            size={28}
            color={color}
          />,
        }}
      />
    </Tabs>
  );
}
