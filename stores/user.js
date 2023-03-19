import {
	defineStore
} from 'pinia';
import apis from '@/config/apis/index';

export const userStore = defineStore('user', {
	state: () => {
		return { 
			user: uni.getStorageSync('user') || {},
		};
	},
	getters: { 
	}, 
	actions: {
		
		saveUserInfo(data) {
			this.user = data;
		},
		get_xcx_code() {
			return new Promise((resolve, rejected) => {
				uni.login({
					success: function (res){
						resolve(res.code);
					},
					fail: err => {
						// md5flag = true
						rejected(err)
					}
				});
			});
		},
		async refreshToken() {
			try{
				let code = await this.get_xcx_code();
				console.log('code打印:',code)
				return apis.login_cancel({params: {code}}) 
			}catch(e){
				return e
			}
		}
	},
});