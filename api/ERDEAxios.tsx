import axios from "axios";
import urlJoin from "url-join";
import getEnvVars from "../environment";
import { read } from "../components/helpers/LocalStorage";
import { locale } from "expo-localization";

const { apiUrl } = getEnvVars();

const DEBUG = true;

const ERDEAxios = axios.create();

// interceptor for outgoing requests
ERDEAxios.interceptors.request.use(
  async (config) => {
    const userToken = await read("userToken");
    const contentType = await read("contentType");
    if (userToken) {
      config.headers["Authorization"] = "Bearer " + userToken;
    }
    config.headers["Accept-Language"] = locale;
    if (contentType) {
      config.headers["Content-type"] = "multipart/form-data";
      console.log('Content-type', "multipart/form-data");
    } else {
      console.log('Content-type', "application/json");
      config.headers["Content-type"] = "application/json";
    }
    config.url = urlJoin(apiUrl, `${config.url}`);
    if (DEBUG) {
      console.log("URL", config.method, config.url);
      config.data && console.log("DATA", config.data);
    }
    return config;
  },
  (error) => {
    if (DEBUG) {
      console.log("API CALL UNSUCCESSFUL");
      console.log(JSON.stringify(error, null, 2));
    }
    return Promise.reject(error);
  }
);

// interceptor for incoming responses
ERDEAxios.interceptors.response.use(
  (response) => {
    if (DEBUG) {
      console.log("API CALL RESPONSE SUCCESSFUL");
    }

    if (response?.status === 200 || response?.status === 201) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    const errorMsg = JSON.stringify(error.message);

    if (DEBUG) {
      console.log("API ERROR", errorMsg);
    }

    if (error?.response?.status) {
      switch (error.response.status) {
        case 400:
          console.log(
            "Bad Request - please check the request parameters for correct configuration",
            errorMsg
          );
          break;
        case 401:
          console.log("Session Expired", errorMsg);
          break;
        case 403:
          console.log(
            "Forbidden - the passed auth params do not have permission to view this resource",
            errorMsg
          );
          break;
        case 404:
          console.log("Not Found", errorMsg);
          break;
        case 502:
          return Promise.reject('Falla Temporal de comunicacion  con el servidor, intente nuevamente mas tarde');
          break;
        default:
          return Promise.reject(errorMsg);
      }
      return Promise.reject(error.response.data);
    }
  }
);

export default ERDEAxios;
