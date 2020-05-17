// const _iplist_ = {'home': '192.168.1.45', 'work': '192.168.10.166'};
const _iplist_ = {'home': '192.168.1.8', 'work': '192.168.1.31'};
const _ip_ = 'home';

window._env_ = {
  VERSION: "Production/develpment",
  REACT_APP_ROOT_STATIC_URL: `http://${_iplist_[_ip_]}:9000/public-upload`,
  REACT_APP_ROOT_SERVER_URL: `http://${_iplist_[_ip_]}:8080`,
  REACT_APP_SERVER_SECURE_URL: `http://${_iplist_[_ip_]}:8080/user`,
  REACT_APP_SERVER_PUBLIC_URL: `http://${_iplist_[_ip_]}:8080/public`,
  REACT_APP_PUBLIC_USER: "kikirikii",
  REACT_APP_DEFAULT_COPY_FILE: "institutmed-copy",
  REACT_APP_ROOT_CLIENT_URL: "",
  REACT_APP_STOMP_SERVER: `http://${_iplist_[_ip_]}:8080/stomp/websocket/test`,
  REACT_APP_CONTACT_PAGE: "contact",
  REACT_APP_PRIVACY_POLICY_PAGE: "privacy-policy",
  REACT_APP_TERMS_OF_USE_PAGE: "terms-of-use",
  REACT_APP_NOT_FOUND_PAGE: "not-found",
  REACT_APP_IMPRINT_PAGE: "imprint",
};

// window._env_ = {
//   VERSION: "Production/develpment",
//   REACT_APP_ROOT_STATIC_URL: "http://192.168.11.190:9000/public-upload",
//   REACT_APP_ROOT_SERVER_URL: "http://192.168.11.190:8080",
//   REACT_APP_SERVER_SECURE_URL: "http://192.168.11.190:8080/user",
//   REACT_APP_SERVER_PUBLIC_URL: "http://192.168.11.190:8080/public",
//   REACT_APP_PUBLIC_USER: "kikirikii",
//   REACT_APP_DEFAULT_COPY_FILE: "institutmed-copy",
//   REACT_APP_ROOT_CLIENT_URL: "",
//   REACT_APP_STOMP_SERVER: "http://192.168.11.190:8080/stomp/websocket/test",
//   REACT_APP_CONTACT_PAGE: "contact",
//   REACT_APP_PRIVACY_POLICY_PAGE: "privacy-policy",
//   REACT_APP_TERMS_OF_USE_PAGE: "terms-of-use",
//   REACT_APP_NOT_FOUND_PAGE: "not-found",
//   REACT_APP_IMPRINT_PAGE: "imprint",
// };
