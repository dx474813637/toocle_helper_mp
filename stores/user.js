import {
	defineStore
} from 'pinia';
import apis from '@/config/apis/index';

export const userStore = defineStore('user', {
	state: () => {
		return { 
			user: {}, 
		};
	},
	getters: { 
	}, 
	actions: {
		
	},
});