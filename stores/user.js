import {
	defineStore
} from 'pinia';
import apis from '@/config/apis/index';

export const userStore = defineStore('user', {
	state: () => {
		return { 
			user: uni.getStorageSync('user') || {},
			user_info: {},
			user_loading: false,
		};
	},
	getters: { 
	}, 
	actions: {
		async getUserInfo() {
			this.user_loading = true
			const res = await apis.my_info();
			this.user_loading = false
			if(res.code == 1) {
				this.user_info = res.list
			}
			return res
		},
		clearLogout() {
			this.user = {}
			this.user_info = {}
			uni.removeStorageSync('user')
			uni.removeStorageSync('poster')
			uni.removeStorageSync('userid')
			uni.removeStorageSync('WebSocketInfo')
			uni.reLaunch({
				url: '/pages/index/index',
				success() {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				}
			})
		},
		async logout() {
			uni.showLoading()
			const res = await apis.logout();
			if(res.code == 1) {
				this.clearLogout()
			}
		},
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