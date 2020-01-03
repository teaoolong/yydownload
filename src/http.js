import axios from "axios";
import { Message, Loading } from "element-ui";

let loading;

function startLoading() {
  loading = Loading.service({
    lock: true,
    text: "加载中...",
    background: "rgba(0,0,0,0.7)"
  });
}

function endLoading() {
  loading.close();
}

axios.interceptors.request.use(
  config => {
    startLoading();
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  response => {
    endLoading();
    if (response.data.code == "10000") {
      Message.error("登入已过期,请重新登入");
      if (sessionStorage.sessionId) {
        sessionStorage.removeItem("sessionId");
      }
    }
    return response;
  },
  err => {
    endLoading();
    Message.error(err.response.data);
    return Promise.reject(err);
  }
);

export default axios;
