import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#0e0e97",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color as string} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: "Hijabs",
          tabBarIcon: ({ size, focused }) => (
            <Image
              source={require("../../../assets/images/Pictures/small-hijab.png")}
              style={{
                width: size,
                height: size,
                opacity: focused ? 1 : 0.6,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="page1"
        options={{
          title: "Dresses",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="woman" color={color as string} size={size} />
          ),
        }}
      />
      {/* "name" must match the Profile file name in app/(tabs), without .tsx */}
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color as string} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}