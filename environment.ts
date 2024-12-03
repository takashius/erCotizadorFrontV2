import Constants from "expo-constants";

const ENV = {
  dev: {
    apiUrl: "http://192.168.30.135:8080",
    type: "dev",
  },
  prod: {
    apiUrl: "https://17k7htqzc1.execute-api.us-east-2.amazonaws.com/v1",
    type: "production",
  },
  digitalOcean: {
    apiUrl: "https://cotizador-zod9w.ondigitalocean.app",
    type: "production",
  },
};

const getEnvVars = (env = Constants.expoConfig) => {
  // if (__DEV__) {
  //   return ENV.dev;
  // } else if (env === 'staging') {
  //   return ENV.staging;
  // } else if (env === 'production') {
  //   return ENV.prod;
  // } else {
  //   return ENV.staging;
  // }
  return ENV.digitalOcean;
};

export default getEnvVars;
