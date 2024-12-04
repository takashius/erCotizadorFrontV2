import { Box } from "native-base";
import { Stack, router } from "expo-router";
import Spinner from "../components/helpers/Spinner";
import { remove, write } from "../components/helpers/LocalStorage";
import { useLogout } from "../api/auth";
import { useEffect } from "react";

export default function Logout() {
  const { isSuccess, isError, isFetched } = useLogout();

  const clearData = async () => {
    await remove("userToken");
    router.replace("/login");
  };

  useEffect(() => {
    if (isSuccess) {
      clearData();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      clearData();
    }
  }, [isError]);

  return (
    <Box bgColor={"blue.100"} flex={1}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Spinner />
    </Box>
  );
}
