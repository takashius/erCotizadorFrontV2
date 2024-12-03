import { Box } from "native-base";

export default ({ children }: { children: any }) => {
  return (
    <Box
      maxW="80"
      w={"80"}
      rounded="lg"
      overflow="hidden"
      borderColor="coolGray.200"
      borderWidth="1"
      _dark={{
        borderColor: "coolGray.600",
        backgroundColor: "gray.700",
      }}
      _web={{
        shadow: 2,
        borderWidth: 0,
      }}
      _light={{
        backgroundColor: "gray.50",
      }}
    >
      {children}
    </Box>
  );
};
