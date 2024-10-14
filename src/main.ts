import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.min.js';
import "bootstrap";
import '@popperjs/core';

import './assets/vendor/fonts/boxicons.css';

import './assets/vendor/css/core.css';
import './assets/vendor/css/theme-default.css';
import './assets/css/demo.css';

import './assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css';

import './assets/vendor/libs/popper/popper.js';
import './assets/vendor/js/menu.js';

import './assets/vendor/js/helpers.js';
import './assets/js/main.js';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
