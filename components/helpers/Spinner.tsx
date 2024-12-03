import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";

const Spinner = () => {
  return (
    <View style={styles.indicatorContainer}>
      <ActivityIndicator size="large" color="#2196F3" animating={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  indicatorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Spinner;
