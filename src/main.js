import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router/index.js';
import {
  Button,
  message,
  Row,
  Col,
  Input,
  InputNumber,
  Layout,
  Drawer,
  Popover,
  Form,
  Checkbox,
  Collapse,
  Tooltip,
  Divider,
  Card,
  Table,
  ConfigProvider,
  Switch,
  Modal,
  Select,
  SelectOption,
  Radio,
  DatePicker,
  Menu,
  Breadcrumb,
  Avatar,
  Dropdown,
  Result,
  Spin,
  Tag,
} from 'ant-design-vue';
import App from './App.vue';
import axios from 'axios';
window.axios = axios;

import '../node_modules/bootstrap/dist/css/bootstrap-grid.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap-utilities.min.css';
import '../node_modules/chart.js/dist/chart.umd.js';
import '../node_modules/dayjs/dayjs.min.js';
import '../node_modules/ol/dist/ol.js';
import '../node_modules/ol/ol.css';

// import '../node_modules/ol-ext/dist/ol-ext.js';
// import '../node_modules/ol-ext/dist/ol-ext.css';

const app = createApp(App);
app.config.productionTip = false;
app.use(createPinia());
app.use(router);

app.use(Button);
app.use(Layout);
app.use(Row);
app.use(Col);
app.use(Input);
app.use(InputNumber);
app.use(Drawer);
app.use(Popover);
app.use(Form);
app.use(Checkbox);
app.use(Collapse);
app.use(Tooltip);
app.use(Divider);
app.use(Card);
app.use(Table);
app.use(ConfigProvider);
app.use(Switch);
app.use(Modal);
app.use(Select);
app.use(SelectOption);
app.use(Radio);
app.use(DatePicker);
app.use(Menu);
app.use(Breadcrumb);
app.use(Avatar);
app.use(Dropdown);
app.use(Result);
app.use(Spin);
app.use(Tag);

app.mount('#app');

app.config.globalProperties.$message = message;
