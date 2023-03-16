import App from './App'
import uviewPlus from 'uview-plus'
import * as Pinia from 'pinia';
import apis from './config/apis/index'
import ws from '@/utils/webstocket.js'

import setHttp from '@/config/request.js'

// import DMessage from '@/utils/DMessage.js'
// import uToast from 'uview-plus/components/u-toast/u-toast.vue'

// import routingIntercept from '@/config/permission/index.js' 

import {
	createSSRApp
} from 'vue'
export function createApp() {
	
	const app = createSSRApp(App)
	
	// app.config.globalProperties.$axios = axios;
	const pinia = Pinia.createPinia()
	app.provide('$http', uni.$u.http); 
	app.provide('$api', apis); 
	app.provide('$ws', ws); 
	// app.provide('$msg', DMessage); 
	// app.component('uToast', uToast)
	app.use(uviewPlus).use(pinia);
	
	setHttp(pinia, ws)
	// routingIntercept(app)
	return {
		app,
		Pinia
	}
}
