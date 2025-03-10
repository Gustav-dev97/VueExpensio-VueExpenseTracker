import { createApp } from 'vue'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import './assets/style.css'
import App from './App.vue'

import { OhVueIcon, addIcons } from "oh-vue-icons";
import { BiCalculatorFill, MdModeeditoutlineOutlined, MdAddOutlined, BiDownload } from "oh-vue-icons/icons";
import i18n from './i18n';

addIcons(BiCalculatorFill, MdModeeditoutlineOutlined, MdAddOutlined, BiDownload)

const app = createApp(App)

app.component("v-icon", OhVueIcon);
app.use(i18n);
app.use(Toast)
app.mount('#app')
